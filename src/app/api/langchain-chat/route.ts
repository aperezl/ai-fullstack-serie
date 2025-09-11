import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { AgentExecutor, createToolCallingAgent } from 'langchain/agents';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { AIMessage, HumanMessage } from '@langchain/core/messages';
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { ChatMessageHistory } from "langchain/memory";
import { langchainTools } from '@/lib/ai/tools-langchain';
import { toUIMessageStream } from '@ai-sdk/langchain';
import { createUIMessageStreamResponse } from 'ai'

export const maxDuration = 30;

const prompt = ChatPromptTemplate.fromMessages([
  ["system", `
    Eres un asistente de soporte técnico para una plataforma digital.
    Tu nombre es "AaronBot", un homenaje a Aaron Swartz. Eres amable, extremadamente servicial y eficiente.
    Utiliza las herramientas disponibles para responder a las preguntas del usuario y realizar tareas.
    Cuando busques información de un usuario, siempre dirígete a él por su nombre si lo encuentras.
    El correo del usuario actual es "antonio@unuko.com". Solo puedes operar sobre este usuario a menos que se te proporcione otro correo explícitamente.`
  ],
  new MessagesPlaceholder("chat_history"),
  ["human", "{input}"],
  new MessagesPlaceholder("agent_scratchpad"),
]);

const model = new ChatGoogleGenerativeAI({ model: 'gemini-2.0-flash-001', temperature: 0 });

const agent = createToolCallingAgent({
  llm: model,
  tools: langchainTools,
  prompt,
});

const agentExecutor = new AgentExecutor({
  agent,
  tools: langchainTools,
});

// Sesiones en memoria para el historial. En producción, usaríamos Redis o similar.
const sessionHistories: Record<string, ChatMessageHistory> = {};

const agentWithHistory = new RunnableWithMessageHistory({
  runnable: agentExecutor,
  getMessageHistory: async (sessionId) => {
    console.log({ sessionId });
    if (sessionHistories[sessionId] === undefined) {
      sessionHistories[sessionId] = new ChatMessageHistory();
    }
    return sessionHistories[sessionId];
  },
  inputMessagesKey: "input",
  historyMessagesKey: "chat_history",
});

export async function POST(req: Request) {
  const { messages, id } = await req.json();
  // const lastUserMessage = messages[messages.length - 1].content;
  const lastUserMessage = messages[messages.length - 1].parts.filter((part: any) => part.type === 'text').map((part: any) => part.text).join(' ');

  const stream2 = await agentWithHistory.streamEvents(
    lastUserMessage, { version: 'v2', },
  );

  console.log({ id })
  const stream = await agentWithHistory.stream({
    input: lastUserMessage,
  }, {
    configurable: {
      sessionId: 'hola',
    }
  });
  console.log('Stream creado:', stream);
  console.log('1---------------------')
  for await (const message of stream) {
    console.log(message)
  }
  console.log('2---------------------')


  return createUIMessageStreamResponse({
    stream,
  })
}