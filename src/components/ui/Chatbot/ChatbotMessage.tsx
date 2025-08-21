import { cn } from "@/lib/utils"
import { UIMessage } from "@ai-sdk/react"
interface ChatMessageProps {
  message: UIMessage
}

export function ChatBotMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <span className="text-slate-900 font-bold text-xs">AI</span>
        </div>
      )}

      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-2 break-words",
          isUser ? "bg-yellow-500 text-slate-900" : "bg-slate-700 text-white",
        )}
      >
        <p className="whitespace-pre-wrap leading-relaxed">

          {message.parts.map((part, index) =>
            part.type === 'text' ? <span key={index}>{part.text}</span> : null,
          )}
        </p>
      </div>

      {isUser && (
        <div className="w-8 h-8 bg-slate-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <span className="text-white font-bold text-xs">TÚ</span>
        </div>
      )}
    </div>
  )
}
