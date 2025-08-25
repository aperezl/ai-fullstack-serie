"use client"

import type React from "react"

import { type FormEvent, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"

interface ChatInputProps {
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void
  isLoading: boolean
  inputPlaceholder: string
}

export function ChatbotInput({ input, handleInputChange, handleSubmit, isLoading, inputPlaceholder }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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
      handleSubmit(e)
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
      <form onSubmit={onSubmit} className="flex gap-2 items-center">
        <div className="flex-1">
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
