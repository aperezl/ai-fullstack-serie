import { Chatbot } from "@/components/ui/Chatbot/Chatbot"
import { UserIcon } from "lucide-react";

export default function ChatbotPage() {

  const AssistantAvatar = () => <UserIcon className="text-white w-32 h-32" />

  const UserAvatar = () => (
    <div className="w-8 h-8 bg-slate-500 rounded-full flex items-center justify-center flex-shrink-0">
      <UserIcon className="text-white w-5 h-5" />
    </div>
  );

  return (
    <div className="h-full w-full">
      <Chatbot

        apiEndpoint="/api/rag"
        assistantName="Asistente AI"
        assistantDescription="Siempre listo para ayudarte."
        assistantAvatar={<AssistantAvatar />}
        userAvatar={<UserAvatar />}
        initialMessageTitle="¡Hola! Soy tu asistente AI"
        initialMessageDescription="Pregúntame lo que quieras y te ayudaré."
        inputPlaceholder="Pega cualquier código..." />
    </div>
  )
}
