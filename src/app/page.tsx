import Link from "next/link"
import { BookOpen, MessageCircle, LucideIcon, BookUser, BookImage, FileText, WrenchIcon } from "lucide-react"

type Card = {
  title: string
  Icon: LucideIcon
  path: string
}

const items: Card[] = [
  {
    title: 'Fundamentos modernos y primera interacción con IA.',
    Icon: BookOpen,
    path: '/fundamental'
  },
  {
    title: 'Construyendo interfaces conversacionales (Chatbots)',
    Icon: MessageCircle,
    path: '/chatbot'
  },
  {
    title: 'RAG - Dotando de memoria a tu agente.',
    Icon: BookUser,
    path: '/rag'
  },
  {
    title: 'RAG Vision - Añade capacidad para leer imágenes.',
    Icon: BookImage,
    path: '/rag-images'
  },
  {
    title: 'RAG PDF - Hablando con tus PDFs.',
    Icon: FileText,
    path: '/pdf-chat'
  },
  {
    title: 'Function Calling y Herramientas (Tools)',
    Icon: WrenchIcon,
    path: '/tools'
  }
]

const ItemComponent = ({ title, Icon, path }: Card) => (
  <Link href={path} className="block">

    <div className="flex items-center space-x-3 mb-4">
      <div className="p-2 bg-yellow-500/20 rounded-lg">
        <Icon className="h-6 w-6 text-yellow-400" />
      </div>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
    </div>

  </Link>
)

export default function Home() {
  return (
    <div className="p-8 bg-slate-800 min-h-screen">
      <div className="flex flex-col mb-8 w-full items-center">
        <h1 className="text-3xl font-bold text-white mb-2">Serie: Aplicación FullStack</h1>
        <p className="text-slate-300">Explora las diferentes secciones de la aplicación</p>
      </div>
      <div className="flex flex-col p-6 w-full items-center">
        <div className="p-6">
          {items.map((item, index) => <ItemComponent key={index} {...item} />)}
        </div>
      </div>

    </div>
  )
}
