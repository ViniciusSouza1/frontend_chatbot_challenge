import axios from "axios"
import { getToken, clearToken } from "../lib/authStorage"
import type { User } from "../types"

import { useAuthStore } from "../store/authstore"
import { useChatStore } from "../store/chatStore"
import { setCurrentSessionId } from "../lib/storage"

export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
  headers: { "Content-Type": "application/json" },
})

// JWT when existe
API.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

API.interceptors.response.use(
    (res) => res,
    (error) => {
      const status = error?.response?.status
      if (status === 401 || status === 403) {
        clearToken()
        // clean state auth
        const { setUser } = useAuthStore.getState()
        setUser(null)
        // clean chat state
        const { setCurrentSession, setMessages } = useChatStore.getState()
        setCurrentSession(null)
        setMessages([])
        setCurrentSessionId("") // tira “última sessão” ativa
      }
      return Promise.reject(error)
    }
  )

// ----- AUTH
export async function registerUser(payload: { email: string; password: string }) {
  const { data } = await API.post("/api/users", payload) // retorna {id,email}
  return data as User
}

export async function login(payload: { email: string; password: string }) {
  const { data } = await API.post("/api/auth/login", payload)
  // esperado: { access_token: string, user: {id,email} }
  return data as { access_token: string; user: User }
}

export async function me() {
  try {
    const { data } = await API.get("/api/auth/me")
    return data as User
  } catch {
    clearToken()
    return null
  }
}
