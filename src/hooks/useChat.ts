import { useEffect, useState, useCallback } from "react"
import { createGuestSession, listMessagesBySession, postChat } from "../api"
import { useChatStore } from "../store/chatStore"
import { addSessionId, getCurrentSessionId, getSessionIds, setCurrentSessionId } from "../lib/storage"
import type { Message, Session } from "../types"

export function useChat() {
  const { currentSession, setCurrentSession, messages, setMessages } = useChatStore()
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [sessionList, setSessionList] = useState<string[]>([])

  useEffect(() => {
    const init = async () => {
      const existing = getCurrentSessionId()
      if (existing) {
        await loadSession(existing)
      } else {
        const s = await createGuestSession("Guest chat")
        setCurrentSession(s)
        addSessionId(s.id)
        setCurrentSessionId(s.id)
        setMessages(await listMessagesBySession(s.id))
      }
      setSessionList(getSessionIds())
      setLoading(false)
    }
    init()
  }, [])

  const loadSession = useCallback(async (id: string) => {
    setLoading(true)
    const msgs = await listMessagesBySession(id)
    setMessages(msgs)
    setCurrentSession({ id, title: "Guest chat", user_id: null })
    setCurrentSessionId(id)
    setLoading(false)
  }, [setCurrentSession, setMessages])

  const newSession = useCallback(async () => {
    setLoading(true)
    const s = await createGuestSession("Guest chat")
    addSessionId(s.id)
    setSessionList(getSessionIds())
    setCurrentSession(s)
    setCurrentSessionId(s.id)
    setMessages(await listMessagesBySession(s.id))
    setLoading(false)
  }, [setCurrentSession, setMessages])

  const sendMessage = useCallback(async (text: string) => {
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
      const resp = await postChat({ sessionId: currentSession.id, message: text })
      const msgs = await listMessagesBySession(resp.sessionId)
      setMessages(msgs)
    } finally {
      setSending(false)
    }
  }, [currentSession, messages, setMessages])

  return { loading, sending, currentSession, messages, sessionList, loadSession, newSession, sendMessage }
}
