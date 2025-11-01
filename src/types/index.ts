export type UUID = string

export interface User {
  id: UUID
  email: string
}

export interface Session {
  id: UUID
  user_id?: UUID | null
  title: string
}

export interface Message {
  id: UUID
  session_id: UUID
  role: "user" | "assistant"
  content: string
  created_at?: string
}

export interface ChatRequest {
  sessionId: UUID
  message: string
}

export interface ChatResponse {
  sessionId: UUID
  messages: { role: "user" | "assistant"; content: string }[]
}