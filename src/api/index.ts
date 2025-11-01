import axios from "axios"
import type { ChatRequest, ChatResponse, Message, Session, UUID } from "../types"

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
  headers: { "Content-Type": "application/json" },
})

export async function createGuestSession(title = "Guest chat"): Promise<Session> {
  const { data } = await API.post("/api/sessions", { title })
  return data
}

export async function listMessagesBySession(sessionId: UUID): Promise<Message[]> {
  const { data } = await API.get(`/api/messages/by-session/${sessionId}`)
  return data
}

export async function postChat(payload: ChatRequest): Promise<ChatResponse> {
  const { data } = await API.post("/api/chat", payload)
  return data
}
