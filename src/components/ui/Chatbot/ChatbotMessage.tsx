import { cn } from "@/lib/utils";
import { UIMessage } from "ai";

interface ChatMessageProps {
  message: UIMessage;
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
          isUser ? "bg-yellow-500 text-slate-900" : "bg-slate-700 text-white",
        )}
      >
        <div className="whitespace-pre-wrap leading-relaxed">
          {message.parts.map((part, index) =>
            part.type === 'text' ? <span key={index}>{part.text}</span> : null,
          )}
        </div>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          {userAvatar}
        </div>
      )}
    </div>
  );
}