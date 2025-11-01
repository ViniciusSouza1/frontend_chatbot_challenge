const KEYS = {
    current: "eloquent.currentSessionId",
    sessions: "eloquent.sessionIds",
  }
  
  export function getCurrentSessionId(): string | null {
    return localStorage.getItem(KEYS.current)
  }
  
  export function setCurrentSessionId(id: string) {
    localStorage.setItem(KEYS.current, id)
  }
  
  export function getSessionIds(): string[] {
    try {
      const raw = localStorage.getItem(KEYS.sessions)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }
  
  export function addSessionId(id: string) {
    const list = getSessionIds()
    if (!list.includes(id)) {
      list.unshift(id)
      localStorage.setItem(KEYS.sessions, JSON.stringify(list.slice(0, 50)))
    }
  }  