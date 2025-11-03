const KEY = "eloquent.auth.token"

export function getToken(): string | null {
  return localStorage.getItem(KEY)
}
export function setToken(t: string) {
  localStorage.setItem(KEY, t)
}
export function clearToken() {
  localStorage.removeItem(KEY)
}
export function isAuthenticated() {
  return !!getToken()
}
