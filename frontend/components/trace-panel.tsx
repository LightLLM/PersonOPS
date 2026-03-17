"use client";

import type { PersonaId } from "@/lib/types";
import { mockTrace } from "@/lib/mock";

interface Props {
  activePersona: PersonaId;
}

export function TracePanel({ activePersona }: Props) {
  const trace = mockTrace(activePersona);

  return (
    <div className="space-y-2 text-xs">
      {trace.map((step, idx) => (
        <div
          key={step.id}
          className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2"
        >
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-[10px] text-slate-300">
              {idx + 1}
            </span>
            <span>{step.label}</span>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-slate-500">
            {typeof step.durationMs === "number" && (
              <span>{step.durationMs} ms</span>
            )}
            <span
              className={`rounded-full px-2 py-0.5 ${
                step.status === "ok"
                  ? "bg-emerald-500/20 text-emerald-300"
                  : step.status === "pending"
                  ? "bg-amber-500/20 text-amber-300"
                  : "bg-rose-500/20 text-rose-300"
              }`}
            >
              {step.status}
            </span>
          </div>
        </div>
      ))}
      <p className="mt-1 text-[11px] text-slate-500">
        In a real deployment, these steps map to Gradient trace spans from the LangGraph workflow.
      </p>
    </div>
  );
}

