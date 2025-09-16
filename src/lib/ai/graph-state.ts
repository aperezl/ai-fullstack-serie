import { BaseMessage } from '@langchain/core/messages';
import { Annotation, messagesStateReducer, StateGraphArgs } from '@langchain/langgraph';

export type AgentState = {
  messages: BaseMessage[];
}

export const StateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: messagesStateReducer,
    default: () => [],
  }),
});