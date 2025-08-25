interface ChatbotHeaderProps {
  assistantName: string;
  assistantDescription: string;
  assistantAvatar: React.ReactNode;
}

export function ChatbotHeader({
  assistantName,
  assistantDescription,
  assistantAvatar,
}: ChatbotHeaderProps) {
  return (
    <div className="bg-slate-700 border-b border-slate-600 p-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
          {assistantAvatar}
        </div>
        <div>
          <h1 className="text-white font-semibold">{assistantName}</h1>
          <p className="text-slate-300 text-sm">{assistantDescription}</p>
        </div>
      </div>
    </div>
  );
}