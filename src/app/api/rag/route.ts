import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages, UIMessage } from 'ai';
import { z } from 'zod';
import { findRelevantChunks } from '@/lib/ai/rag'; // Importamos nuestra nueva función

export const maxDuration = 30;

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
    const lastUserMessageText = lastUserMessage.parts.map(part => part.type === 'text' ? part.text : '').join('');

    // Instanciar el modelo de IA
    const model = google('gemini-2.0-flash-001');


    const relevantChunks = await findRelevantChunks(lastUserMessageText);

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

