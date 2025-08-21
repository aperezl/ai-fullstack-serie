import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages, UIMessage } from 'ai';
import { z } from 'zod';

// Permite que las respuestas en streaming se ejecuten por hasta 30 segundos
export const maxDuration = 30;

// Definimos un schema de Zod para validar el cuerpo de la petición
const PostBodySchema = z.object({
  messages: z.array(z.any()), // Por ahora, aceptamos cualquier objeto de mensaje
});

export async function POST(req: Request) {
  try {
    // Extraer y validar el cuerpo de la petición
    const body = await req.json();
    const validation = PostBodySchema.safeParse(body);

    if (!validation.success) {
      return new Response(JSON.stringify(validation.error.flatten()), { status: 400 });
    }

    const { messages }: { messages: UIMessage[] } = validation.data;

    // Instanciar el modelo de IA
    const model = google('gemini-2.0-flash-001');

    // Preparar el prompt con un mensaje de sistema para guiar al LLM
    const systemPrompt = `Eres un asistente de código experto llamado "CodeGenius".
    Tu especialidad es analizar fragmentos de código y explicar su funcionamiento de forma clara, concisa y pedagógica.
    Cuando un usuario te envíe un snippet, tu tarea es:
    1. Identificar el lenguaje de programación.
    2. Explicar el propósito general del código.
    3. Describir la función de cada línea o bloque de código importante.
    4. Mantén tus explicaciones orientadas a un desarrollador que busca entender rápidamente el código.
    5. No generes código nuevo a menos que se te pida explícitamente. Céntrate en la explicación.`;

    // Llamar a streamText del Vercel AI SDK
    const result = await streamText({
      model: model,
      system: systemPrompt,
      messages: convertToModelMessages(messages),
    });

    // Devolver la respuesta como un stream que el hook `useChat` puede consumir
    return result.toUIMessageStreamResponse()

  } catch (error) {
    // Manejo de errores en el servidor
    console.error("Error en la API de chat:", error);
    const errorMessage = error instanceof Error ? error.message : "Un error inesperado ha ocurrido.";
    return new Response(errorMessage, { status: 500 });
  }
}