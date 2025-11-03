import { useEffect, useState } from "react"
import { login, me, registerUser } from "../api/auth"
import { claimSessions } from "../api"
import {
  getToken,
  setToken,
  clearToken,
  isAuthenticated,
} from "../lib/authStorage"
import { useAuthStore } from "../store/authstore"
import { useChatStore } from "../store/chatStore"
import { getSessionIds, setCurrentSessionId } from "../lib/storage"

export function useAuth() {
  const { user, setUser } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // bootstrap: if a token exists, try /me
  useEffect(() => {
    const init = async () => {
      try {
        if (isAuthenticated()) {
          const u = await me()
          setUser(u)
        } else {
          setUser(null)
        }
      } finally {
        setLoading(false)
      }
    }
    void init()
  }, [setUser])

  // Notify other parts of the app that the session list has changed
  function notifySessionsUpdated() {
    window.dispatchEvent(new CustomEvent("eloquent:sessions-updated"))
  }

  // --- CLAIM ANONYMOUS SESSIONS ---
  async function handleClaimSessions() {
    const anonSessions = getSessionIds()
    if (anonSessions.length > 0) {
      try {
        const resp = await claimSessions(anonSessions)
        console.log("✅ Claimed sessions:", resp)
        // Clear local sessions to avoid duplicates
        localStorage.removeItem("eloquent.sessionIds")
        setCurrentSessionId("")
        // 🔔 Notify the app to reload the session list (now from the server)
        notifySessionsUpdated()
      } catch (err) {
        console.warn("⚠️ Failed to claim sessions:", err)
      }
    } else {
      // Even without claiming, after login there may be sessions on the server.
      // Dispatch the event to ensure the UI reboots properly.
      notifySessionsUpdated()
    }
  }

  // --- LOGIN ---
  async function doLogin(email: string, password: string) {
    setError(null)
    const resp = await login({ email, password })
    setToken(resp.access_token)
    setUser(resp.user)
    await handleClaimSessions() // link anonymous sessions
  }

  // --- REGISTER ---
  async function doRegister(email: string, password: string) {
    setError(null)
    await registerUser({ email, password })
    // automatically log in after signup
    await doLogin(email, password)
  }

  // --- LOGOUT ---
  function logout() {
    clearToken()
    setUser(null)
    const { setCurrentSession, setMessages } = useChatStore.getState()
    setCurrentSession(null)
    setMessages([])
    setCurrentSessionId("")
  }

  return {
    user,
    loading,
    error,
    doLogin,
    doRegister,
    logout,
    token: getToken(),
  }
}
