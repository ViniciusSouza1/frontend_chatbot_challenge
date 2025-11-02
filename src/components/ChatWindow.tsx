import { useRef, useEffect, useState } from "react"
import { useChat } from "../hooks/useChat"
import MessageBubble from "./MessageBubble"

export default function ChatWindow() {
  const { messages, sendMessage, sending, currentSession, loading } = useChat()
  const [input, setInput] = useState("")
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !currentSession) return
    await sendMessage(input.trim())
    setInput("")
  }

  if (loading) return <div className="flex-1 grid place-items-center">Carregando…</div>

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-auto p-6 space-y-4">
        {messages.map((m) => <MessageBubble key={m.id} msg={m} />)}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSubmit} className="border-t border-neutral-800 p-4 flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your question..."
          disabled={!currentSession || sending}
          className="flex-1 rounded-xl bg-neutral-900 border border-neutral-800 px-4 py-3 outline-none focus:border-neutral-600"
        />
        <button
          type="submit"
          disabled={!input.trim() || sending}
          className="rounded-xl bg-blue-600 px-5 py-3 font-medium disabled:opacity-50"
        >
          {sending ? "..." : "Send"}
        </button>
      </form>
    </div>
  )
}
