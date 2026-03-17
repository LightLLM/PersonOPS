"use client";

import type { PersonaId } from "@/lib/types";
import { mockLogs } from "@/lib/mock";

interface Props {
  activePersona: PersonaId;
}

export function LogsPanel({ activePersona }: Props) {
  const logs = mockLogs(activePersona);

  return (
    <div className="space-y-1 rounded-xl border border-slate-800 bg-slate-950/60 p-2 text-[11px] font-mono">
      {logs.map((log, idx) => (
        <div key={idx} className="flex gap-2">
          <span className="text-slate-500">{log.timestamp}</span>
          <span
            className={
              log.level === "ERROR"
                ? "text-rose-400"
                : log.level === "WARN"
                ? "text-amber-300"
                : "text-emerald-300"
            }
          >
            {log.level}
          </span>
          <span className="text-slate-100">{log.message}</span>
        </div>
      ))}
      <p className="mt-1 text-[11px] text-slate-500">
        Use <code>gradient agent logs</code> in the agent workspace or the DigitalOcean control panel for live logs.
      </p>
    </div>
  );
}

