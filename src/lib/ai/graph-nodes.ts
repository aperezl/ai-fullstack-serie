import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { AIMessage } from '@langchain/core/messages';
import { AgentState } from './graph-state';
import { langchainTools } from './tools-langchain';
import { ToolNode } from '@langchain/langgraph/prebuilt';

const model = new ChatGoogleGenerativeAI({ model: 'gemini-2.5-flash', temperature: 0 });

const prompt = ChatPromptTemplate.fromMessages([
  ["system", `
    Eres un asistente de soporte técnico llamado "ChipiBot". Eres amable y eficiente.
    Utiliza las herramientas disponibles para ayudar al usuario.
    El correo del usuario actual es "antonio@unuko.com".`
  ],
  new MessagesPlaceholder("messages"),
]);

// Vinculamos las herramientas al modelo.
const modelWithTools = model.bindTools(langchainTools);

// 1. Nodo Agente: Llama al LLM
export async function callModel(state: AgentState): Promise<{ messages: AIMessage[] }> {
  console.log('[Graph Node]: Call Model');
  const { messages } = state;
  const chain = prompt.pipe(modelWithTools);
  const response = await chain.invoke({ messages });
  // Devolvemos la respuesta del LLM para añadirla al estado.
  return { messages: [response] };
}

// 2. Nodo de Acción: Ejecuta las herramientas
// Usaremos el ToolNode pre-construido de LangGraph, que simplifica la ejecución de herramientas.
export const callTool = new ToolNode(langchainTools);