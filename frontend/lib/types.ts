export type PersonaId = "compliance" | "sales" | "research";

export interface PersonaMeta {
  id: PersonaId;
  name: string;
  description: string;
  tone: string;
  badgeColor: string;
}

export interface RunRequest {
  prompt: string;
  persona: PersonaId;
}

export interface RunResponseMeta {
  latency_ms: number;
  model?: string;
  trace_hint?: string;
  error?: string;
}

export interface RunResponse {
  persona: PersonaId;
  response: string;
  meta: RunResponseMeta;
}

export interface TraceStep {
  id: string;
  label: string;
  durationMs?: number;
  status: "ok" | "pending" | "error";
}

export interface LogEntry {
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR";
  message: string;
  meta?: Record<string, unknown>;
}

export interface EvalScore {
  metric: string;
  score: number;
  description?: string;
}

