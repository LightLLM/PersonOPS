"use client";

import type { PersonaId } from "@/lib/types";
import { mockEvalScores } from "@/lib/mock";

interface Props {
  activePersona: PersonaId;
}

export function EvalScorecard({ activePersona }: Props) {
  const scores = mockEvalScores(activePersona);

  return (
    <div className="space-y-2">
      {scores.map((s) => (
        <div
          key={s.metric}
          className="flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2"
        >
          <div>
            <p className="text-xs font-medium">{s.metric}</p>
            {s.description && (
              <p className="text-[11px] text-slate-400">{s.description}</p>
            )}
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-semibold text-sky-300">
              {s.score}
            </span>
            <span className="text-[11px] text-slate-500">/ 100</span>
          </div>
        </div>
      ))}
      <p className="mt-1 text-[11px] text-slate-500">
        Run <code>gradient agent evaluate</code> with{" "}
        <code>agent/evaluations/persona_eval.csv</code> to generate live scores.
      </p>
    </div>
  );
}

