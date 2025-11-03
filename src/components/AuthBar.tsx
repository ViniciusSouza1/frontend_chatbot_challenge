import { useState } from "react"
import { useAuth } from "../hooks/useAuth"

export default function AuthBar() {
  const { user, loading, doLogin, doRegister, logout } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mode, setMode] = useState<"login" | "signup">("login")

  if (loading) return null

  if (user) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <span className="text-neutral-400">Logged in as</span>
        <span className="font-medium">{user.email}</span>
        <button onClick={logout} className="rounded bg-neutral-800 px-3 py-1">
          Logout
        </button>
      </div>
    )
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (mode === "login") await doLogin(email, password)
    else await doRegister(email, password)
    setEmail("")
    setPassword("")
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-2">
      <input
        className="bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-sm w-56"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-sm w-40"
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="rounded bg-blue-600 px-3 py-2 text-sm">
        {mode === "login" ? "Sign in" : "Sign up"}
      </button>
      <button
        type="button"
        onClick={() => setMode(mode === "login" ? "signup" : "login")}
        className="text-xs underline"
      >
        {mode === "login" ? "Create account" : "Already have an account"}
      </button>
    </form>
  )
}
