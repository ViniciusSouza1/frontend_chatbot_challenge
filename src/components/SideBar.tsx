import { useChat } from "../hooks/useChat"

export default function Sidebar() {
  const { sessionList, loadSession, newSession, currentSession } = useChat()

  return (
    <aside className="w-64 border-r border-neutral-800 p-4 flex flex-col gap-3">
      <button
        onClick={newSession}
        className="w-full rounded-lg bg-neutral-200 text-neutral-900 py-2 font-medium hover:bg-white"
      >
        + New chat
      </button>
      <div className="text-sm text-neutral-400 uppercase tracking-wide">Your chats</div>
      <ul className="flex-1 overflow-auto space-y-2">
        {sessionList.map((id) => (
          <li key={id}>
            <button
              onClick={() => loadSession(id)}
              className={`w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-800 ${
                currentSession?.id === id ? "bg-neutral-800" : ""
              }`}
            >
              {id.slice(0, 8)} • Guest
            </button>
          </li>
        ))}
        {sessionList.length === 0 && (
          <li className="text-neutral-500 text-sm">No chats saved.</li>
        )}
      </ul>
    </aside>
  )
}
