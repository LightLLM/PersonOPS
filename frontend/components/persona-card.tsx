"use client";

import type { PersonaMeta } from "@/lib/types";

interface Props {
  persona: PersonaMeta;
  active: boolean;
  hovered: boolean;
}

export function PersonaCard({ persona, active, hovered }: Props) {
  const border = active ? "border-sky-500" : "border-slate-800";
  const bg = active
    ? "bg-slate-900/80"
    : hovered
    ? "bg-slate-900/60"
    : "bg-slate-950/40";

  return (
    <div
      className={`group rounded-2xl border ${border} ${bg} px-3 py-3 transition-colors`}
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold">{persona.name}</p>
          <p className="mt-0.5 text-[11px] text-slate-400">
            {persona.tone}
          </p>
        </div>
        <div
          className={`h-7 w-7 rounded-full bg-gradient-to-tr ${persona.badgeColor} opacity-90`}
        />
      </div>
      <p className="mt-2 text-[11px] text-slate-300">
        {persona.description}
      </p>
    </div>
  );
}

