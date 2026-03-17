import type { PersonaMeta } from "./types";

export const PERSONAS: PersonaMeta[] = [
  {
    id: "compliance",
    name: "Compliance Copilot",
    description: "Cautious, structured, and policy-focused answers.",
    tone: "Risk-aware • Structured • Concise",
    badgeColor: "from-amber-500 to-yellow-400"
  },
  {
    id: "sales",
    name: "Sales Closer",
    description: "Persuasive, objection-handling, and outcome-driven.",
    tone: "Energetic • Benefits-first • Actionable",
    badgeColor: "from-pink-500 to-rose-500"
  },
  {
    id: "research",
    name: "Research Analyst",
    description: "Neutral, evidence-first, and summary-driven.",
    tone: "Analytical • Organized • Balanced",
    badgeColor: "from-sky-500 to-cyan-400"
  }
];

export const findPersona = (id: string | null | undefined): PersonaMeta | undefined =>
  PERSONAS.find((p) => p.id === id);

