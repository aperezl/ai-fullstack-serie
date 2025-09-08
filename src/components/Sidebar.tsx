"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BookOpen, MessageCircle, BookUser, BookImage, FileText, WrenchIcon } from "lucide-react"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Fundamental", href: "/fundamental", icon: BookOpen },
  { name: "Chatbot", href: "/chatbot", icon: MessageCircle },
  { name: 'RAG', href: '/rag', icon: BookUser },
  { name: 'RAG Vision', href: '/rag-images', icon: BookImage },
  { name: 'RAG PDF', href: '/pdf-chat', icon: FileText },
  { name: 'Tools', href: '/tools', icon: WrenchIcon },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-slate-700 text-white flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold text-yellow-500">AI Fullstack Serie</h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive ? "bg-yellow-500 text-slate-900" : "text-slate-300 hover:bg-slate-600 hover:text-white"
                }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
