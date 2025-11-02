import { useEffect, useState, useCallback, useRef } from "react";
import { createGuestSession, listMessagesBySession, postChat } from "../api";
import { useChatStore } from "../store/chatStore";
import {
  addSessionId,
  getCurrentSessionId,
  getSessionIds,
  setCurrentSessionId,
} from "../lib/storage";
import type { Message, Session } from "../types";

export function useChat() {
  const { currentSession, setCurrentSession, messages, setMessages } =
    useChatStore();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sessionList, setSessionList] = useState<string[]>([]);
  const didInit = useRef(false); // <-- avoids running init twice in StrictMode

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    const init = async () => {
      setLoading(true);
      try {
        // 1) try action session
        const existing = getCurrentSessionId();
        const saved = getSessionIds();

        if (existing) {
          await loadSession(existing);
        } else if (saved.length > 0) {
          // 2) There are saved sessions: open the most recent one without creating new ones.
          await loadSession(saved[0]);
        } else {
          // 3) No session saved: Do NOT create now
          // Allow the screen to load and the user clicks on "+ New conversation"
          setCurrentSession(null);
          setMessages([]);
        }

        setSessionList(getSessionIds());
      } finally {
        setLoading(false);
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadSession = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const msgs = await listMessagesBySession(id);
        setMessages(msgs);
        setCurrentSession({ id, title: "Guest chat", user_id: null });
        setCurrentSessionId(id);
      } finally {
        setLoading(false);
      }
    },
    [setCurrentSession, setMessages]
  );

  const newSession = useCallback(async () => {
    setLoading(true);
    try {
      const s: Session = await createGuestSession("Guest chat");
      addSessionId(s.id);
      setSessionList(getSessionIds());
      setCurrentSession(s);
      setCurrentSessionId(s.id);
      const msgs: Message[] = await listMessagesBySession(s.id);
      setMessages(msgs);
    } finally {
      setLoading(false);
    }
  }, [setCurrentSession, setMessages]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!currentSession) return;
      setSending(true);
      try {
        const optimistic: Message = {
          id: crypto.randomUUID(),
          session_id: currentSession.id,
          role: "user",
          content: text,
        };
        setMessages([...messages, optimistic]);

        const resp = await postChat({
          sessionId: currentSession.id,
          message: text,
        });
        const msgs = await listMessagesBySession(resp.sessionId);
        setMessages(msgs);
      } finally {
        setSending(false);
      }
    },
    [currentSession, messages, setMessages]
  );

  return {
    loading,
    sending,
    currentSession,
    messages,
    sessionList,
    loadSession,
    newSession,
    sendMessage,
  };
}
