"use client";

import { CircleDot } from "lucide-react";

interface Props {
  status?: "deployed" | "staging" | "local";
}

const STATUS_LABEL: Record<NonNullable<Props["status"]>, string> = {
  deployed: "Deployed via Gradient ADK",
  staging: "Staging (Gradient ADK)",
  local: "Local mock"
};

export function StatusBadge({ status = "local" }: Props) {
  const label = STATUS_LABEL[status];
  const color =
    status === "deployed"
      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50"
      : status === "staging"
      ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
      : "bg-slate-700/40 text-slate-200 border-slate-600";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${color}`}
    >
      <CircleDot className="h-3 w-3" />
      {label}
    </span>
  );
}

