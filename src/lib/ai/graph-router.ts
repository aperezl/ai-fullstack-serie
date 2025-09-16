import { AgentState } from './graph-state';
import { AIMessage } from '@langchain/core/messages';

// La función de enrutamiento que decide el siguiente paso.
export function shouldContinue(state: AgentState): "tools" | "__end__" {
  console.log('[Graph Router]: Evaluating state...');
  const { messages } = state;
  const lastMessage = messages[messages.length - 1] as AIMessage;

  // Si la última respuesta de la IA contiene llamadas a herramientas, vamos al nodo 'tools'.
  if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
    console.log('[Graph Router]: Decision -> Call Tools');
    return "tools";
  }

  // De lo contrario, hemos terminado.
  console.log('[Graph Router]: Decision -> End');
  return "__end__";
}
