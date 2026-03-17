"use client";

import { FormEvent, useState } from "react";
import { SendHorizonal, Sparkles } from "lucide-react";

interface Props {
  loading: boolean;
  onSubmit: (prompt: string) => void;
}

export function PromptBox({ loading, onSubmit }: Props) {
  const [value, setValue] = useState(
    "Give me a launch strategy for PersonaOps and highlight potential risks."
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim() || loading) return;
    onSubmit(value.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 rounded-2xl border border-border bg-muted/60 px-4 py-3"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Sparkles className="h-3.5 w-3.5 text-sky-400" />
          <span>One prompt, three personas.</span>
        </div>
        <button
          type="submit"
          className="inline-flex items-center gap-1 rounded-full bg-sky-500 px-3 py-1 text-xs font-medium text-black shadow-sm hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-300"
          disabled={loading}
        >
          <SendHorizonal className="h-3 w-3" />
          {loading ? "Running..." : "Run prompt"}
        </button>
      </div>
      <textarea
        rows={3}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="mt-1 w-full resize-none bg-transparent text-sm outline-none placeholder:text-slate-500"
        placeholder="Ask about compliance risk, sales messaging, or research tradeoffs..."
      />
    </form>
  );
}

