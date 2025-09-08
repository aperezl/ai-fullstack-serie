import { Chatbot } from "@/components/ui/Chatbot/Chatbot";
import { BotMessageSquare, UserIcon } from 'lucide-react';

// Avatares (podrían estar en un archivo compartido)
const AssistantAvatar = () => (
  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
    <BotMessageSquare className="text-white w-5 h-5" />
  </div>
);

const UserAvatar = () => (
  <div className="w-8 h-8 bg-slate-500 rounded-full flex items-center justify-center flex-shrink-0">
    <UserIcon className="text-white w-5 h-5" />
  </div>
);

export default function PdfChatPage() {
  return (
    <Chatbot
      apiEndpoint="/api/tools"
      assistantName="Gestión de Tickets"
      assistantDescription="Gestiona tus tickets desde este asistente."
      assistantAvatar={<AssistantAvatar />}
      userAvatar={<UserAvatar />}
      initialMessageTitle="Hola, ¿en qué puedo ayudarte?"
      initialMessageDescription="Tengo información sobre el estado de todos tus tickets."
      inputPlaceholder="Escribe tu consulta sobre los tickets..."
      fileSupport={false}
    />
  );
}