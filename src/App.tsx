import Sidebar from "./components/SideBar"
import ChatWindow from "./components/ChatWindow"

export default function App() {
  return (
    <main className="h-screen flex">
      <Sidebar />
      <ChatWindow />
    </main>
  )
}
