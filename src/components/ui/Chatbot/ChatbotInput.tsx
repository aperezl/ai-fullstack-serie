"use client"

import type React from "react"

import { type FormEvent, useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Paperclip, Send, X } from "lucide-react"
import Image from "next/image"

interface ChatInputProps {
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: FormEvent<HTMLFormElement>, files?: File[]) => void // Modificamos la firma
  isLoading: boolean
  inputPlaceholder: string
  fileSupport?: boolean
}

export function ChatbotInput({ input, handleInputChange, handleSubmit, isLoading, inputPlaceholder, fileSupport }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<File[]>([])

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
    }
  }, [input])

  useEffect(() => {
    if (!isLoading) {
      textareaRef.current?.focus()
    }
  }, [isLoading])

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      handleSubmit(e, files)
      setFiles([])
      if (fileInputRef.current) {
        fileInputRef.current.value = "" // Resetear el input de archivo
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
      textareaRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (input.trim() && !isLoading) {
        e.currentTarget.form?.requestSubmit()
      }
    }
  }

  return (
    <div className="border-t border-slate-600 bg-slate-700 p-4">
      <form onSubmit={onSubmit} className="flex gap-2 items-start">
        {fileSupport && (
          <>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-white flex-shrink-0"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              <Paperclip className="w-5 h-5" />
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              multiple={false} // Permitimos solo una imagen por ahora
              className="hidden"
            />
          </>
        )}
        <div className="flex-1 flex flex-col gap-2">
          {files.length > 0 && (
            <div className="bg-slate-600 p-2 rounded-md flex items-center gap-2">
              <Image className="w-10 h-10 object-cover rounded" src={URL.createObjectURL(files[0])} alt={files[0].name} width={40} height={40} />
              <span className="text-sm text-white truncate">{files[0].name}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="ml-auto text-slate-400 hover:text-white"
                onClick={() => setFiles([])}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={inputPlaceholder}
            className="w-full bg-slate-600 text-white placeholder-slate-400 border border-slate-500 rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent min-h-[48px] max-h-[120px] no-scrollbar"
            disabled={isLoading}
            rows={1}
          />
        </div>
        <Button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  )
}
