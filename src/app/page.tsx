import Sidebar from "@/components/Sidebar";
import ChatHeader from "@/components/ChatHeader";
import MessageList from "@/components/MessageList";

export default function HomePage() {
  return (
    <main className="flex h-screen bg-black">
      <Sidebar />

      <section className="flex flex-1 flex-col">
        <ChatHeader />

        <MessageList />
      </section>
    </main>
  );
}