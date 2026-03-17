"use client";

import type { RunResponse } from "@/lib/types";
import { PERSONAS } from "@/lib/personas";

interface Props {
  responses: RunResponse[] | null;
  loading: boolean;
}

export function ResponsePanel({ responses, loading }: Props) {
  const byPersona = new Map(responses?.map((r) => [r.persona, r]) ?? []);

  return (
    <section className="grid h-full grid-cols-1 gap-3 lg:grid-cols-3">
      {PERSONAS.map((p) => {
        const data = byPersona.get(p.id);
        const isLoading = loading && !data;
        return (
          <div
            key={p.id}
            className="flex flex-col rounded-2xl border border-border bg-card/80 p-3"
          >
            <header className="mb-2 flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-semibold">{p.name}</p>
                <p className="text-[11px] text-slate-400">
                  {p.description}
                </p>
              </div>
              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                {p.id}
              </span>
            </header>
            <div className="flex-1 rounded-xl bg-slate-950/40 p-2 text-xs text-slate-200">
              {isLoading && <p className="text-slate-500">Generating...</p>}
              {!isLoading && data && (
                <pre className="whitespace-pre-wrap text-[11px] leading-relaxed">
                  {data.response}
                </pre>
              )}
              {!isLoading && !data && (
                <p className="text-slate-500">
                  Run a prompt to see this persona in action.
                </p>
              )}
            </div>
            <footer className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
              <span>
                Latency:{" "}
                {data?.meta.latency_ms
                  ? `${data.meta.latency_ms} ms`
                  : "–"}
              </span>
              <span>
                Model:{" "}
                {data?.meta.model ? data.meta.model : "Gradient ADK (env)"}
              </span>
            </footer>
          </div>
        );
      })}
    </section>
  );
}

