import { cn } from "@/lib/utils";
import { UIMessage, UIMessagePart, UIDataTypes, UITools } from "ai";
import { File, WrenchIcon } from "lucide-react";
import Image from "next/image";
import { Streamdown } from 'streamdown';

interface ChatMessageProps {
  message: UIMessage<unknown, UIDataTypes, UITools>;
  assistantAvatar: React.ReactNode;
  userAvatar: React.ReactNode;
}

export function ChatBotMessage({ message, assistantAvatar, userAvatar }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3 mb-4", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          {assistantAvatar}
        </div>
      )}

      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-2 break-words",
          isUser ? "bg-slate-600 text-slate-200" : "bg-slate-700 text-salte-300",
        )}
      >
        <div className="whitespace-pre-wrap leading-relaxed">

          {message.parts.map((part, index) => {
            if (part.type.startsWith('tool')) {
              return (
                <div className="mb-2 italic text-sm text-slate-400" key={index}>
                  <WrenchIcon className="inline w-4 h-4 mr-2" />
                  Ejecutando herramienta: {part.type.replace('tool-', '')}
                </div>
              )
            }

            if (part.type === 'text') {
              return <div
                key={index}
              >
                {part.text}
              </div>;
            }
            if (part.type === 'file') {
              if (part.mediaType.startsWith('image/')) {
                const imagePart = part as UIMessagePart<UIDataTypes, UITools> & { type: 'file', url: string };
                return (
                  <Image
                    key={index}
                    src={imagePart.url}
                    alt="Imagen adjunta por el usuario"
                    width={200}
                    height={200}
                    className="rounded-md object-cover"
                  />
                );
              }
              return (
                <div key={index}>
                  <File className="inline w-4 h-4 mr-2" />
                  <span>{part.filename}</span>
                </div>
              )
            }
            return null;
          })}

        </div >
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          {userAvatar}
        </div>
      )}
    </div>
  );
}