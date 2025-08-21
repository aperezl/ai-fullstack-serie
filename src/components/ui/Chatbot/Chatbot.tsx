"use client"

import { ChatbotMessages } from "./ChatbotMessages"
import { ChatbotInput } from "./ChatbotInput"
import { ChatbotHeader } from "./ChatbotHeader"
import { useCustomChat } from "@/hooks/useCustomChat";

export function Chatbot() {
  const {
    input,
    messages,
    status,
    handleInputChange,
    handleSubmit
  } = useCustomChat({ api: `/api/chat` });

  return (
    <div className="flex flex-col h-full bg-slate-600">
      <ChatbotHeader />
      <div className="flex-1 flex flex-col min-h-0">
        <ChatbotMessages messages={messages} isLoading={status !== 'ready'} />
        <ChatbotInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={status !== 'ready'}
        />
      </div>
    </div>
  )
}


