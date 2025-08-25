"use client";

import { ChatBotMessage } from "./ChatbotMessage";
import { ChatbotLoading } from "./ChatbotLoading";
import { useEffect, useRef } from "react";
import { UIMessage } from "ai";

interface ChatMessagesProps {
  messages: UIMessage[];
  isLoading: boolean;
  assistantAvatar: React.ReactNode;
  userAvatar: React.ReactNode;
  initialMessageTitle: string;
  initialMessageDescription: string;
}

export function ChatbotMessages({
  messages,
  isLoading,
  assistantAvatar,
  userAvatar,
  initialMessageTitle,
  initialMessageDescription
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 ">
      {messages.length === 0 && !isLoading && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-64 h-64 rounded-full flex items-center justify-center mx-auto mb-4">
              {assistantAvatar}
            </div>
            <h2 className="text-white text-xl font-semibold mb-2">{initialMessageTitle}</h2>
            <p className="text-slate-300">{initialMessageDescription}</p>
          </div>
        </div>
      )}

      {messages.map((message) => (
        <ChatBotMessage
          key={message.id}
          message={message}
          assistantAvatar={assistantAvatar}
          userAvatar={userAvatar}
        />
      ))}

      {isLoading && <ChatbotLoading assistantAvatar={assistantAvatar} />}
      <div ref={messagesEndRef} />
    </div>
  );
}