import { MessagesAnnotation, StateGraph } from '@langchain/langgraph';
import { convertToModelMessages, createUIMessageStreamResponse } from 'ai';
import { callModel, callTool } from '@/lib/ai/graph-nodes';
import { shouldContinue } from '@/lib/ai/graph-router';
import { toUIMessageStream } from '@ai-sdk/langchain';

export const maxDuration = 60;

// Definir el grafo de LangGraph
const workflow = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addNode("tools", callTool);

// Definir las aristas que conectan los nodos
workflow.addEdge("__start__", "agent");
workflow.addConditionalEdges("agent", shouldContinue);
workflow.addEdge("tools", "agent");

// Compilar el grafo en un Runnable
const app = workflow.compile();

export async function POST(req: Request) {
  const { messages, id } = await req.json();
  const inputs = {
    messages: convertToModelMessages(messages)
  };

  // Invocamos el grafo compilado.
  // LangGraph se encarga de ejecutar el ciclo completo.
  const stream = app.streamEvents(inputs, { configurable: { sessionId: id }, version: 'v2' })

  return createUIMessageStreamResponse({
    stream: toUIMessageStream(stream),
  })
}

export async function GET() {
  const representation = await app.getGraphAsync();
  return new Response(await representation.drawMermaidPng());
}