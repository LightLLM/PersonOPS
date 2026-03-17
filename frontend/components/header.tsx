"use client";

import { BrainCircuit } from "lucide-react";
import { StatusBadge } from "./status-badge";

export function Header() {
  const hasDeployed = Boolean(process.env.DEPLOYED_AGENT_URL);

  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 text-black">
          <BrainCircuit className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-sm font-semibold tracking-tight">
            PersonaOps
          </h1>
          <p className="text-xs text-slate-400">
            Control plane for production AI personas on DigitalOcean Gradient AI.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 text-xs">
        <StatusBadge status={hasDeployed ? "deployed" : "local"} />
        <span className="rounded-full border border-sky-500/40 bg-sky-500/10 px-3 py-1 text-sky-200">
          Powered by DigitalOcean Gradient AI ADK
        </span>
      </div>
    </header>
  );
}

