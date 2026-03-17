import OpenAI from "openai";
import type { RunRequest, RunResponse } from "./types";
import { PERSONA_SYSTEM_PROMPTS } from "./persona-prompts";

export async function runPersonaWithOpenAI(req: RunRequest): Promise<RunResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  // GPT-5.3 Instant (ChatGPT default chat model) — alias per OpenAI API docs
  const model = process.env.OPENAI_MODEL || "gpt-5.3-chat-latest";
  const client = new OpenAI({ apiKey });

  const start = Date.now();
  const completion = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: PERSONA_SYSTEM_PROMPTS[req.persona] },
      { role: "user", content: req.prompt }
    ],
    temperature: 0.7,
    max_tokens: 2048
  });

  const text = completion.choices[0]?.message?.content ?? "";
  const latency_ms = Date.now() - start;

  return {
    persona: req.persona,
    response: text,
    meta: {
      latency_ms,
      model,
      trace_hint: "OpenAI (server-side); Gradient ADK optional via DEPLOYED_AGENT_URL."
    }
  };
}
