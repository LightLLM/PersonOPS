import type {
  RunRequest,
  RunResponse,
  TraceStep,
  LogEntry,
  EvalScore,
  PersonaId
} from "./types";

export async function mockRun(req: RunRequest): Promise<RunResponse> {
  await new Promise((res) => setTimeout(res, 400));
  const persona = req.persona;

  const base: Omit<RunResponse, "response"> = {
    persona,
    meta: {
      latency_ms: 400,
      model: "mock-local",
      trace_hint: "Using mock data. Deploy agent and set DEPLOYED_AGENT_URL for live traces."
    }
  };

  const common = `Prompt: "${req.prompt}"`;

  if (persona === "compliance") {
    return {
      ...base,
      response: [
        "Summary:",
        "- This is a mock Compliance Copilot answer.",
        "- It surfaces risks and assumptions before making recommendations.",
        "",
        "Key considerations:",
        "- Data privacy and retention requirements.",
        "- Auditability of agent decisions and outputs.",
        "- Clear escalation paths when policies are ambiguous.",
        "",
        common
      ].join("\n")
    };
  }

  if (persona === "sales") {
    return {
      ...base,
      response: [
        "Here's how I'd position PersonaOps:",
        "",
        "1. Immediate value:",
        "   - Turn generic AI experiments into reliable, production-ready personas.",
        "   - Show stakeholders concrete improvements in win-rates and cycle times.",
        "",
        "2. Objection handling:",
        "   - “We already have a chatbot” → PersonaOps gives you observability, evals, and control.",
        "   - “We’re worried about risk” → Compliance-oriented personas and Gradient AI traces.",
        "",
        "Next step: Run this exact prompt through all three personas and compare tone, quality, and latency.",
        "",
        common
      ].join("\n")
    };
  }

  return {
    ...base,
    response: [
      "Executive summary:",
      "- This is a mock Research Analyst answer illustrating structure, not model quality.",
      "",
      "Facts:",
      "- PersonaOps focuses on observability (traces, logs, evals) for agent personas.",
      "- DigitalOcean Gradient AI provides the ADK, hosted agents, and evaluation pipeline.",
      "",
      "Assumptions:",
      "- The target team already runs or plans to run AI agents in production.",
      "- They care about safety, reliability, and persona differentiation.",
      "",
      "Recommendations:",
      "- Use staging deployments + evals before shipping a new persona.",
      "- Compare personas on the same prompt set for correctness and safety.",
      "",
      common
    ].join("\n")
  };
}

export function mockTrace(persona: PersonaId): TraceStep[] {
  return [
    {
      id: "1",
      label: "Request received",
      status: "ok",
      durationMs: 5
    },
    {
      id: "2",
      label: `Persona routing → ${persona}`,
      status: "ok",
      durationMs: 3
    },
    {
      id: "3",
      label: "LangGraph workflow invoked",
      status: "ok",
      durationMs: 20
    },
    {
      id: "4",
      label: "Model call via Gradient ADK",
      status: "ok",
      durationMs: 320
    },
    {
      id: "5",
      label: "Response returned to client",
      status: "ok",
      durationMs: 10
    }
  ];
}

export function mockLogs(persona: PersonaId): LogEntry[] {
  const now = new Date().toISOString();
  return [
    {
      timestamp: now,
      level: "INFO",
      message: `Received /run for persona=${persona}`
    },
    {
      timestamp: now,
      level: "INFO",
      message: "Invoking LangGraph workflow"
    },
    {
      timestamp: now,
      level: "INFO",
      message: "Gradient model call completed",
      meta: { latency_ms: 320 }
    }
  ];
}

export function mockEvalScores(persona: PersonaId): EvalScore[] {
  if (persona === "compliance") {
    return [
      { metric: "Correctness", score: 88, description: "Strong but conservative answers." },
      { metric: "Safety & Security", score: 95, description: "Frequently highlights risks and caveats." },
      { metric: "Instruction following", score: 90 }
    ];
  }

  if (persona === "sales") {
    return [
      { metric: "Correctness", score: 82 },
      { metric: "Model fit", score: 93, description: "Very strong for GTM/sales scenarios." },
      { metric: "Instruction following", score: 86 }
    ];
  }

  return [
    { metric: "Correctness", score: 92, description: "Careful and evidence-focused responses." },
    { metric: "Model fit", score: 88, description: "Great for product and research teams." },
    { metric: "Instruction following", score: 91 }
  ];
}

