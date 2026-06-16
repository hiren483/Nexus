import Sidebar from "./components/Sidebar";
import ChatHeader from "./components/ChatHeader";
import MessageList from "./components/MessageList";
import MessageComposer from "./components/MessageComposer";

function App() {
  return (
    <main className="flex h-screen bg-black text-white">
      <Sidebar />

      <section className="flex flex-1 flex-col">
        <ChatHeader />

        <MessageList />

        <MessageComposer />
      </section>
    </main>
  );
}

export default App;