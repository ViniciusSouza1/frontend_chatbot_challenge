import { useEffect, useState, useCallback, useRef } from "react"
import {
  createSession,
  createGuestSession,
  listMessagesBySession,
  postChat,
  listSessionsByUser,
} from "../api"
import { useChatStore } from "../store/chatStore"
import {
  addSessionId,
  getCurrentSessionId,
  getSessionIds,
  setCurrentSessionId,
} from "../lib/storage"
import { useAuthStore } from "../store/authstore"
import type { Message, Session } from "../types"

export function useChat() {
  const { user } = useAuthStore()
  const { currentSession, setCurrentSession, messages, setMessages } = useChatStore()
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [sessionList, setSessionList] = useState<string[]>([])
  const didInit = useRef(false)

  useEffect(() => {
    function onSessionsUpdated() {
      // re-load session list and open the first one (or the current one, if it exists)
      void bootstrap()
    }
    window.addEventListener("eloquent:sessions-updated", onSessionsUpdated)
    return () => {
      window.removeEventListener("eloquent:sessions-updated", onSessionsUpdated)
    }
  }, [
    /* nothing else needed here; only ensures bootstrap is in scope */
  ])

  useEffect(() => {
    if (didInit.current) return
    didInit.current = true
    void bootstrap()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // re-bootstrap when user changes (login/logout)
  useEffect(() => {
    void bootstrap()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  const bootstrap = async () => {
    setLoading(true)
    try {
      const current = getCurrentSessionId()

      if (user) {
        // LOGGED-IN: fetch list from the server
        const sessions = await listSessionsByUser(user.id)
        const ids = sessions.map((s) => s.id)
        setSessionList(ids)

        if (current && ids.includes(current)) {
          await loadSession(current)
        } else if (ids.length > 0) {
          await loadSession(ids[0]) // most recent (adjust if backend orders differently)
        } else {
          // no session yet — do not create automatically
          setCurrentSession(null)
          setMessages([])
        }
      } else {
        // ANONYMOUS: get list from localStorage
        const saved = getSessionIds()
        setSessionList(saved)

        if (current && saved.includes(current)) {
          await loadSession(current)
        } else if (saved.length > 0) {
          await loadSession(saved[0])
        } else {
          setCurrentSession(null)
          setMessages([])
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const loadSession = useCallback(
    async (id: string) => {
      setLoading(true)
      try {
        const msgs = await listMessagesBySession(id)
        setMessages(msgs)
        setCurrentSession({ id, title: "Chat", user_id: user?.id ?? null })
        setCurrentSessionId(id)
      } finally {
        setLoading(false)
      }
    },
    [setCurrentSession, setMessages, user?.id]
  )

  const newSession = useCallback(async () => {
    setLoading(true)
    try {
      let s: Session
      if (user) {
        s = await createSession("Chat", user.id)
        setSessionList((prev) => [s.id, ...prev])
      } else {
        s = await createGuestSession("Guest chat")
        addSessionId(s.id)
        setSessionList(() => getSessionIds())
      }
      setCurrentSession(s)
      setCurrentSessionId(s.id)
      const msgs: Message[] = await listMessagesBySession(s.id)
      setMessages(msgs)
    } finally {
      setLoading(false)
    }
  }, [setCurrentSession, setMessages, user])

  const sendMessage = useCallback(
    async (text: string) => {
      if (!currentSession) return
      setSending(true)
      try {
        const optimistic: Message = {
          id: crypto.randomUUID(),
          session_id: currentSession.id,
          role: "user",
          content: text,
        }
        setMessages([...messages, optimistic])
        const resp = await postChat({
          sessionId: currentSession.id,
          message: text,
        })
        const msgs = await listMessagesBySession(resp.sessionId)
        setMessages(msgs)
      } finally {
        setSending(false)
      }
    },
    [currentSession, messages, setMessages]
  )

  return {
    loading,
    sending,
    currentSession,
    messages,
    sessionList,
    loadSession,
    newSession,
    sendMessage,
  }
}
