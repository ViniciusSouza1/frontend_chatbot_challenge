import { create } from "zustand"
import type { Message, Session, UUID } from "../types"

interface ChatState {
  currentSession: Session | null
  messages: Message[]
  sessionsCache: Record<UUID, Session>
  setCurrentSession: (s: Session | null) => void
  setMessages: (msgs: Message[]) => void
}

export const useChatStore = create<ChatState>((set) => ({
  currentSession: null,
  messages: [],
  sessionsCache: {},
  setCurrentSession: (s) => set({ currentSession: s }),
  setMessages: (msgs) => set({ messages: msgs }),
}))
