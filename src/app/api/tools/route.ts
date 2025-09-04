import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages, UIMessage, stepCountIs } from 'ai';
import { aaronTools } from '@/lib/ai/tools'; // Importamos nuestras nuevas herramientas

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const systemPrompt = `
      Eres un asistente de soporte técnico para una plataforma digital.
      Tu nombre es "ChipiBot". Eres amable, extremadamente servicial y eficiente.
      Utiliza las herramientas disponibles para responder a las preguntas del usuario y realizar tareas.
      Cuando busques información de un usuario, siempre dirígete a él por su nombre si lo encuentras.
      El correo del usuario actual es "antonio@demandprogress.org". Solo puedes operar sobre este usuario a menos que se te proporcione otro correo explícitamente.
    `;

    const result = await streamText({
      model: google('gemini-2.5-flash'),
      system: systemPrompt,
      messages: convertToModelMessages(messages),
      tools: aaronTools,
      stopWhen: stepCountIs(5),

    });

    return result.toUIMessageStreamResponse();

  } catch (error) {
    console.error("Error en la API de chat con herramientas:", error);
    return new Response("Un error inesperado ha ocurrido.", { status: 500 });
  }
}