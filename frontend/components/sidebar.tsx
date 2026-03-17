"use client";

import { useState } from "react";
import { PERSONAS } from "@/lib/personas";
import type { PersonaId } from "@/lib/types";
import { PersonaCard } from "./persona-card";

interface Props {
  selected: PersonaId;
  onSelect: (id: PersonaId) => void;
}

export function Sidebar({ selected, onSelect }: Props) {
  const [hovered, setHovered] = useState<PersonaId | null>(null);

  return (
    <aside className="flex h-full w-72 flex-col border-r border-border bg-gradient-to-b from-[#020617] via-[#020617] to-[#020817]">
      <div className="px-4 py-4">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
          Personas
        </p>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto px-3 pb-4">
        {PERSONAS.map((persona) => (
          <button
            key={persona.id}
            type="button"
            onClick={() => onSelect(persona.id)}
            onMouseEnter={() => setHovered(persona.id)}
            onMouseLeave={() => setHovered((prev) => (prev === persona.id ? null : prev))}
            className="w-full text-left"
          >
            <PersonaCard
              persona={persona}
              active={selected === persona.id}
              hovered={hovered === persona.id}
            />
          </button>
        ))}
      </div>
    </aside>
  );
}

