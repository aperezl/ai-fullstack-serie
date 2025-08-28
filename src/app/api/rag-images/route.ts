import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages, UIMessage, UIMessagePart, generateText, UIDataTypes, UITools } from 'ai';
import { z } from 'zod';
import { findRelevantChunks } from '@/lib/ai/rag';

export const maxDuration = 30;

// Helper para extraer la primera imagen de un mensaje
const extractFirstImage = (parts: UIMessagePart<UIDataTypes, UITools>[]): UIMessagePart<UIDataTypes, UITools> | undefined => {
  return parts.find(part => part.type === 'file' && part.mediaType.startsWith('image/'));
}

// Helper para extraer el texto de un mensaje
const extractText = (parts: UIMessagePart<UIDataTypes, UITools>[]): string => {
  return parts.filter(part => part.type === 'text').map(part => (part as { type: 'text', text: string }).text).join(' ');
}

// Definimos un schema de Zod para validar el cuerpo de la petición
const PostBodySchema = z.object({
  messages: z.array(z.any()), // Por ahora, aceptamos cualquier objeto de mensaje
});

export async function POST(req: Request) {

  try {
    const body = await req.json();
    const validation = PostBodySchema.safeParse(body);

    if (!validation.success) {
      return new Response(JSON.stringify(validation.error.flatten()), { status: 400 });
    }

    const { messages }: { messages: UIMessage[] } = validation.data;
    const lastUserMessage = messages[messages.length - 1];
    const userText = extractText(lastUserMessage.parts);
    const userImage = extractFirstImage(lastUserMessage.parts);
    let enhancedQuery = userText;

    // --- Estrategia "Texto como Pivote" ---
    if (userImage) {
      console.log('Imagen detectada. Generando descripción...');
      const visionModel = google('gemini-2.0-flash-001');

      // Creamos un prompt específico para la descripción de la imagen
      const descriptionResponse = await generateText({
        model: visionModel,
        system: `Describe esta imagen en detalle. Céntrate en los objetos principales, su estilo y cualquier texto visible. La descripción se usará para buscar productos similares en una base de datos.
        Descripción de la imagen:`,
        // La API multimodal del AI SDK es inteligente. Pasamos el mensaje de usuario
        // completo y se encargará de usar la parte de la imagen.
        messages: convertToModelMessages([lastUserMessage]),
      });

      // Esperamos el texto completo de la descripción
      const imageDescription = await descriptionResponse.text;
      console.log('Descripción generada:', imageDescription);

      // Combinamos la pregunta del usuario con la descripción
      enhancedQuery = `${userText}. Descripción de la imagen adjunta: ${imageDescription}`;
    }
    // --- Fin de la Estrategia ---

    // Instanciar el modelo de IA
    const model = google('gemini-2.0-flash-001');


    const relevantChunks = await findRelevantChunks(enhancedQuery, 5);

    // 2. Construir el contexto para el prompt
    const context = relevantChunks.map(chunk => chunk.content).join('\n---\n');

    // 3. Crear el prompt aumentado
    const systemPrompt = `
      Eres un asistente experto en la vida y el legado de Aaron Swartz.
      Tu tono debe ser siempre respetuoso, empático y lleno de admiración por su trabajo.
      Habla de él con cariño, como si estuvieras contando la historia de un amigo inspirador.
      Responde a la pregunta del usuario basándote únicamente en el siguiente contexto.
      Si la respuesta no se encuentra en el contexto, responde con amabilidad que esa información específica no está en tu base de conocimientos sobre Aaron.

      Contexto sobre Aaron Swartz:
      ---
      ${context}
      ---
    `;

    // 4. Llamar al LLM con el prompt aumentado
    const result = await streamText({
      model: model,
      system: systemPrompt,
      messages: convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();

  } catch (error) {
    console.error("Error en la API de chat con RAG:", error);
    return new Response("Un error inesperado ha ocurrido.", { status: 500 });
  }
}

