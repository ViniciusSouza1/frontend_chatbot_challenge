
# Eloquent RAG Chat — Frontend (React + TypeScript + Vite)

A clean chat UI for the **Eloquent RAG Chat API** built with **React + TypeScript + Vite**, **Zustand** state, **Axios**, and **Tailwind CSS v4**.  
Supports **anonymous** and **authenticated** users, **chat history**, and **session claiming** (migrates local anonymous sessions to the logged-in account).

---

## ✨ Features

- React + TypeScript (Vite)
- TailwindCSS **v4** (via `@tailwindcss/vite` plugin)
- Chat UI with internal scroll (header/footer fixed)
- Anonymous **guest** sessions + **JWT** login/signup
- Session list (localStorage for guests, API for authenticated users)
- **Claim sessions**: sends local anonymous sessions to `/api/sessions/claim` after login
- Clean architecture: `hooks/`, `store/` (Zustand), `api/`, `components/`

---

## 📁 Folder Structure (excerpt)

```
src/
  api/
    auth.ts              # axios instance + /auth/login, /auth/me, signup
    index.ts             # chat/sessions/messages API + claimSessions
  components/
    AuthModal.tsx        # login/signup modal
    ChatWindow.tsx       # message list + composer (with internal scroll)
    MessageBubble.tsx    # chat bubble
    Modal.tsx            # generic modal
    SideBar.tsx          # session list + new chat button
  hooks/
    useAuth.ts           # auth flow + claim sessions + dispatch "sessions-updated"
    useChat.ts           # chat bootstrap (guest vs user), sendMessage, etc.
  lib/
    authStorage.ts       # token storage (localStorage)
    storage.ts           # local session list (guest mode)
  store/
    authStore.ts         # Zustand user store
    chatStore.ts         # Zustand chat store
  App.tsx
  main.tsx
  index.css              # Tailwind v4 single import
```

---

## 🧰 Requirements

- Node.js **>= 18** (recommended **20+**)
- npm **>= 9**

> If you are on Windows and using PowerShell, ensure execution policy allows running scripts (`Get-ExecutionPolicy`).

---

## 🚀 Getting Started (Development)

1) **Install dependencies**
```bash
npm install
```

2) **Configure environment**
Create a `.env` file in project root:
```env
# Frontend will call your FastAPI backend here:
VITE_API_URL=http://127.0.0.1:8000
```

3) **TailwindCSS v4 setup**
This project uses Tailwind v4 through the official Vite plugin.  
You should already have this in `vite.config.ts`:
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```
And in `src/index.css`:
```css
@import "tailwindcss";

html, body, #root { height: 100%; }
:root { color-scheme: dark; }
body { background-color: #0a0a0a; color: #f5f5f5; }
```

4) **Run dev server**
```bash
npm run dev
```
Open **http://localhost:5173**

---

## 🔒 Auth & Sessions (How it works)

- **Anonymous user**:  
  - Clicking **+ New conversation** creates a guest session via `/api/sessions` **without** `user_id`.  
  - The list of sessions is stored in `localStorage` (`eloquent.sessionIds`); messages are fetched with `/api/messages/by-session/:id` (public if session is anonymous).

- **Login / Sign up**:
  - `POST /api/auth/login` stores the `access_token` in `localStorage`.  
  - On bootstrap, frontend calls `GET /api/auth/me` to restore the user.  
  - When authenticated, the sidebar loads sessions from `/api/sessions/by-user/:user_id`.

- **Claim anonymous sessions** (after login/signup):
  - Frontend collects local anonymous `sessionIds` and calls:
    ```http
    POST /api/sessions/claim
    Authorization: Bearer <token>
    {
      "sessionIds": ["sess-1", "sess-2", "sess-3"]
    }
    ```
  - If claim succeeds, local session list is cleared and the UI emits `eloquent:sessions-updated` to reload the sidebar from the server.

- **Sending messages**:
  - `POST /api/chat` with `{ sessionId, message }`.  
  - Then reloads history from `/api/messages/by-session/:session_id`.

> The frontend **does not** call admin endpoints. It respects authorization rules:
> - Public: `/api/auth/login`, `/api/users` (signup), `/api/chat`, `/api/sessions` (anonymous create), `/api/messages/by-session/:id` (anonymous ownership)
> - Protected: `/api/auth/me`, `/api/sessions/by-user/:user_id`, `/api/messages/by-session/:id` (owned), `/api/sessions` (create with user_id for self)

---

## 🧪 Useful Scripts

- **Dev**: `npm run dev`
- **Build**: `npm run build`
- **Preview** (serves production build locally): `npm run preview`

Ensure your `package.json` contains:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview --port 4173"
  }
}
```

---

## 🐳 Docker (Production)

### 1) Build & Run

```bash
# Build the image (replace the API URL as needed)
docker build \
  --build-arg VITE_API_URL=https://your-backend.example.com \
  -t eloquent-chat-frontend .

# Run it
docker run -p 8080:80 --name chat-frontend eloquent-chat-frontend

# Now open http://localhost:8080
```

> **Note on environment variables**: Vite embeds `VITE_*` values at build time.  
> If you need **runtime** environment configuration, consider using a small `/config.json` fetched at app startup instead of `VITE_` vars.

---

## 🐳 Docker Compose (optional)

```yaml
version: "3.9"
services:
  frontend:
    build:
      context: .
      args:
        VITE_API_URL: "https://your-backend.example.com"
    image: eloquent-chat-frontend:latest
    container_name: chat-frontend
    ports:
      - "8080:80"
    restart: unless-stopped
```

---

## 🧩 Troubleshooting

- **Blank screen in production**  
  Ensure Nginx has the SPA fallback: `try_files $uri /index.html;`

- **404 on deep links**  
  Same as above. Without fallback, refreshing on `/chat/123` will 404.

- **API URL incorrect**  
  Vite uses build-time env. Rebuild the image with `--build-arg VITE_API_URL=...`

- **Tailwind classes missing**  
  Confirm the plugin is added in `vite.config.ts` and `@import "tailwindcss";` exists in `index.css`.

- **StrictMode double effects in dev**  
  We guard initial effects with refs (`didInit`) and avoid auto-creating sessions.

---

## 📄 License

MIT — For technical evaluation under the **Eloquent AI Technical Assignment** context.
