export function ChatbotLoading() {
  return (
    <div className="flex gap-3 justify-start">
      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
        <span className="text-slate-900 font-bold text-xs">AI</span>
      </div>

      <div className="bg-slate-700 rounded-lg px-4 py-2">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        </div>
      </div>
    </div>
  )
}
