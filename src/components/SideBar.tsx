import { useChat } from "../hooks/useChat"

export default function Sidebar() {
  // get variables exposed by the useChat hook
  const { sessionList, loadSession, newSession, currentSession } = useChat()

  return (
    <aside className="w-64 shrink-0 border-r border-neutral-800 p-4 flex flex-col gap-3">
      {/* button to create a new conversation */}
      <button
        onClick={newSession}
        className="w-full rounded-lg bg-neutral-200 text-neutral-900 py-2 font-medium hover:bg-white"
      >
        + New conversation
      </button>

      {/* title */}
      <div className="text-sm text-neutral-400 uppercase tracking-wide mt-2">
        Your conversations
      </div>

      {/* session list */}
      <ul className="flex-1 overflow-auto space-y-2">
        {sessionList.map((id) => (
          <li key={id}>
            <button
              onClick={() => loadSession(id)}
              className={`w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-800 transition ${
                currentSession?.id === id ? "bg-neutral-800" : ""
              }`}
            >
              {id.slice(0, 8)} • Session
            </button>
          </li>
        ))}

        {sessionList.length === 0 && (
          <li className="text-neutral-500 text-sm italic mt-2">
            No conversations available
          </li>
        )}
      </ul>
    </aside>
  )
}
