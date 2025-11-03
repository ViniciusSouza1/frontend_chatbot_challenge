import { useState } from "react"
import Modal from "./Modal"
import { useAuth } from "../hooks/useAuth"

type Props = { open: boolean; onClose: () => void }

export default function AuthModal({ open, onClose }: Props) {
  const { user, doLogin, doRegister, logout } = useAuth()
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setErr(null)
    setLoading(true)
    try {
      if (mode === "login") await doLogin(email, password)
      else await doRegister(email, password)
      onClose() // close modal on success
      setEmail("")
      setPassword("")
    } catch (e: any) {
      setErr(e?.response?.data?.detail ?? "Authentication failed")
    } finally {
      setLoading(false)
    }
  }

  // if already logged in, show quick account info
  if (user) {
    return (
      <Modal open={open} onClose={onClose} title="Account">
        <div className="space-y-4">
          <p className="text-sm text-neutral-300">
            Logged in as <span className="font-medium">{user.email}</span>
          </p>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-3 py-2 rounded bg-neutral-800">Close</button>
            <button onClick={logout} className="px-3 py-2 rounded bg-red-600">Logout</button>
          </div>
        </div>
      </Modal>
    )
  }

  return (
    <Modal open={open} onClose={onClose} title={mode === "login" ? "Sign in" : "Sign up"}>
      <form onSubmit={submit} className="space-y-4">
        <div className="flex gap-2 text-sm">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`px-3 py-1 rounded ${
              mode === "login" ? "bg-neutral-800" : "bg-transparent hover:bg-neutral-800/60"
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`px-3 py-1 rounded ${
              mode === "signup" ? "bg-neutral-800" : "bg-transparent hover:bg-neutral-800/60"
            }`}
          >
            Sign up
          </button>
        </div>

        <input
          className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <input
          className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
        />

        {err && <div className="text-sm text-red-400">{err}</div>}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 rounded bg-neutral-800"
          >
            Cancel
          </button>
          <button
            disabled={loading || !email || !password}
            className="px-4 py-2 rounded bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Sending..." : mode === "login" ? "Sign in" : "Sign up"}
          </button>
        </div>
      </form>
    </Modal>
  )
}
