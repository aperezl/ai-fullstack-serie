"use client"

import { ChatBotMessage } from "./ChatbotMessage"
import { ChatbotLoading } from "./ChatbotLoading"
import { useEffect, useRef } from "react"
import { UIMessage } from "ai"

interface ChatMessagesProps {
  messages: UIMessage[]
  isLoading: boolean
}

export function ChatbotMessages({ messages, isLoading }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.length === 0 && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-slate-900 font-bold text-xl">AI</span>
            </div>
            <h2 className="text-white text-xl font-semibold mb-2">¡Hola! Soy tu asistente AI</h2>
            <p className="text-slate-300">Pregúntame lo que quieras y te ayudaré</p>
          </div>
        </div>
      )}

      {messages.map((message) => (
        <ChatBotMessage key={message.id} message={message} />
      ))}

      {isLoading && <ChatbotLoading />}
      <div ref={messagesEndRef} />
    </div>
  )
}
