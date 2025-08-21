export function ChatbotHeader() {
  return (
    <div className="bg-slate-700 border-b border-slate-600 p-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
          <span className="text-slate-900 font-bold text-sm">AI</span>
        </div>
        <div>
          <h1 className="text-white font-semibold">Asistente AI</h1>
          <p className="text-slate-300 text-sm">Siempre listo para ayudarte</p>
        </div>
      </div>
    </div>
  )
}
