"use client";

import { ChatbotMessages } from "./ChatbotMessages";
import { ChatbotInput } from "./ChatbotInput";
import { ChatbotHeader } from "./ChatbotHeader";
import { useCustomChat } from "@/hooks/useCustomChat";

// Definimos las propiedades que nuestro Chatbot parametrizable aceptará
interface ChatbotProps {
  apiEndpoint: string;
  assistantName: string;
  assistantDescription: string;
  assistantAvatar: React.ReactNode;
  userAvatar: React.ReactNode;
  initialMessageTitle: string;
  initialMessageDescription: string;
  inputPlaceholder: string;
  fileSupport?: boolean;
}

export function Chatbot({
  apiEndpoint,
  assistantName,
  assistantDescription,
  assistantAvatar,
  userAvatar,
  initialMessageTitle,
  initialMessageDescription,
  inputPlaceholder,
  fileSupport = false,
}: ChatbotProps) {
  const {
    input,
    messages,
    status,
    handleInputChange,
    handleSubmit,
  } = useCustomChat({ api: apiEndpoint });

  return (
    <div className="flex flex-col h-full bg-slate-800 rounded-lg shadow-2xl">
      <ChatbotHeader
        assistantName={assistantName}
        assistantDescription={assistantDescription}
        assistantAvatar={assistantAvatar}
      />
      <div className="flex-1 flex flex-col min-h-0">
        <ChatbotMessages
          messages={messages}
          isLoading={status !== 'ready'}
          assistantAvatar={assistantAvatar}
          userAvatar={userAvatar}
          initialMessageTitle={initialMessageTitle}
          initialMessageDescription={initialMessageDescription}
        />
        <ChatbotInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={status !== 'ready'}
          inputPlaceholder={inputPlaceholder}
          fileSupport={fileSupport}
        />
      </div>
    </div>
  );
}