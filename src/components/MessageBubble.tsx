import type { Message } from "../types"

export default function MessageBubble({ msg }: { msg: Message }) {
  return (
    <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 ${
          msg.role === "user" ? "bg-blue-600 text-white" : "bg-neutral-800"
        }`}
      >
        <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
      </div>
    </div>
  )
}
