import { useState } from "react"
import Sidebar from "./components/SideBar"
import ChatWindow from "./components/ChatWindow"
import AuthModal from "./components/AuthModal"
import { useAuth } from "./hooks/useAuth"

export default function App() {
  const [authOpen, setAuthOpen] = useState(false)
  const { user, logout } = useAuth()

  return (
    <main className="h-screen flex">
      <Sidebar />
      {/* note the min-h-0 here to allow the child (ChatWindow) to handle its own scroll */}
      <section className="flex-1 flex flex-col min-h-0">
        <header className="border-b border-neutral-800 px-6 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Eloquent RAG Chat</h1>
            <p className="text-sm text-neutral-400">
              Guest + Login with sessions stored on the server
            </p>
          </div>

          {/* right-side buttons */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <span className="text-sm text-neutral-400 hidden sm:inline">
                  {user.email}
                </span>
                <button
                  onClick={() => setAuthOpen(true)}
                  className="px-3 py-2 rounded bg-neutral-800 text-sm"
                >
                  Account
                </button>
                <button
                  onClick={logout}
                  className="px-3 py-2 rounded bg-red-600 text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                className="px-3 py-2 rounded bg-blue-600 text-sm"
              >
                Login / Sign up
              </button>
            )}
          </div>
        </header>

        <ChatWindow />
      </section>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </main>
  )
}
