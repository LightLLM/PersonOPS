"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { PromptBox } from "@/components/prompt-box";
import { ResponsePanel } from "@/components/response-panel";
import { TracePanel } from "@/components/trace-panel";
import { LogsPanel } from "@/components/logs-panel";
import { EvalScorecard } from "@/components/eval-scorecard";
import type { PersonaId, RunResponse } from "@/lib/types";

export default function Page() {
  const [activePersona, setActivePersona] = useState<PersonaId>("research");
  const [responses, setResponses] = useState<RunResponse[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (prompt: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = (await res.json()) as { results: RunResponse[] };
      setResponses(data.results);
    } catch (e) {
      console.error(e);
      setError("Failed to run personas. Check console and backend configuration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 overflow-hidden">
        <Sidebar selected={activePersona} onSelect={setActivePersona} />
        <div className="flex flex-1 flex-col gap-3 overflow-hidden px-5 py-4">
          <PromptBox loading={loading} onSubmit={handleSubmit} />
          {error && (
            <p className="text-xs text-rose-400">
              {error}
            </p>
          )}
          <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)]">
            <ResponsePanel responses={responses} loading={loading} />
            <div className="flex flex-col gap-2 rounded-2xl border border-border bg-muted/60 p-3">
              <div className="flex items-center gap-3 border-b border-border pb-2 text-xs">
                <button
                  type="button"
                  className="rounded-full bg-slate-800 px-2.5 py-1 font-medium text-slate-100"
                >
                  Observability
                </button>
                <span className="rounded-full bg-slate-900 px-2 py-1 text-[10px] text-slate-400">
                  Persona: {activePersona}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-3 overflow-y-auto text-xs">
                <section>
                  <p className="mb-1 text-[11px] font-medium text-slate-300">
                    Trace summary
                  </p>
                  <TracePanel activePersona={activePersona} />
                </section>
                <section>
                  <p className="mb-1 text-[11px] font-medium text-slate-300">
                    Logs
                  </p>
                  <LogsPanel activePersona={activePersona} />
                </section>
                <section>
                  <p className="mb-1 text-[11px] font-medium text-slate-300">
                    Evaluation scorecard
                  </p>
                  <EvalScorecard activePersona={activePersona} />
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

