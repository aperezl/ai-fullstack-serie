import { Chatbot } from "@/components/ui/Chatbot/Chatbot";
import { BotIcon, UserIcon } from 'lucide-react';

// Avatares (podrían estar en un archivo compartido)
const AssistantAvatar = () => (
  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
    <BotIcon className="text-white w-5 h-5" />
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
      apiEndpoint="/api/pdf-chat"
      assistantName="Analizador de Documentos"
      assistantDescription="Sube un PDF y hazme preguntas sobre él."
      assistantAvatar={<AssistantAvatar />}
      userAvatar={<UserAvatar />}
      initialMessageTitle="Listo para analizar tu PDF"
      initialMessageDescription="Sube un documento para empezar nuestra conversación."
      inputPlaceholder="Adjunta un PDF o haz una pregunta sobre el documento actual..."
      fileSupport={true}
      accept='application/pdf'
    />
  );
}