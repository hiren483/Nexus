import { useState } from "react";

import Sidebar from "./components/Sidebar";
import ChatHeader from "./components/ChatHeader";
import MessageList from "./components/MessageList";
import MessageComposer from "./components/MessageComposer";
import DeveloperPanel from "./components/DeveloperPanel";

function App() {
  const [showMemory, setShowMemory] = useState(false);

  return (
    <main className="flex h-screen bg-black text-white">
      <Sidebar />

      <section className="flex flex-1 flex-col">
        <div className="flex items-center border-b border-zinc-800">
          <div className="min-w-0 flex-1">
            <ChatHeader />
          </div>

          <div className="border-l border-zinc-800 px-4">
            <button
              type="button"
              onClick={() =>
                setShowMemory((currentValue) => !currentValue)
              }
              className="rounded-md border border-zinc-700 px-3 py-2 text-sm text-zinc-200 transition hover:bg-zinc-900"
            >
              {showMemory ? "Hide Memory" : "Show Memory"}
            </button>
          </div>
        </div>
        <MessageList />

        <MessageComposer />
      </section>

      {showMemory && <DeveloperPanel />}
    </main>
  );
}

export default App;
