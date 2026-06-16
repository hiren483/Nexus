"use client";

import { useState } from "react";

export default function MessageComposer() {
  const [value, setValue] = useState("");

  return (
    <div className="border-t border-zinc-800 p-4">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Message an expert using @..."
        rows={1}
        className="w-full resize-none rounded-xl bg-zinc-900 p-4 text-white outline-none placeholder:text-zinc-500"
      />
    </div>
  );
}