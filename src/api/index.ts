import type { ChatRequest, ChatResponse, Message, Session, UUID } from "../types"
import { API } from "./auth" // usa o mesmo axios com interceptor

export async function createSession(title = "Guest chat", user_id?: UUID): Promise<Session> {
  const payload: any = { title }
  if (user_id) payload.user_id = user_id
  const { data } = await API.post("/api/sessions", payload)
  return data
}

export async function createGuestSession(title = "Guest chat") {
  return createSession(title) // compatível com código já existente
}

export async function listMessagesBySession(sessionId: UUID): Promise<Message[]> {
  const { data } = await API.get(`/api/messages/by-session/${sessionId}`)
  return data
}

export async function postChat(payload: ChatRequest): Promise<ChatResponse> {
  const { data } = await API.post("/api/chat", payload)
  return data
}

export async function listSessionsByUser(userId: UUID): Promise<Session[]> {
  const { data } = await API.get(`/api/sessions/by-user/${userId}`)
  return data
}

export async function claimSessions(sessionIds: string[]): Promise<{ claimed: Session[] }> {
  const { data } = await API.post("/api/sessions/claim", { sessionIds })
  return data
}