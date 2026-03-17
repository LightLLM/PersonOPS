import type { RunRequest, RunResponse } from "./types";
import { mockRun } from "./mock";

const DEPLOYED_AGENT_URL = process.env.DEPLOYED_AGENT_URL;

export async function runPersona(req: RunRequest): Promise<RunResponse> {
  if (!DEPLOYED_AGENT_URL) {
    return mockRun(req);
  }

  const token = process.env.DIGITALOCEAN_API_TOKEN;

  const res = await fetch(DEPLOYED_AGENT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({
      prompt: req.prompt,
      persona: req.persona
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Deployed agent error: ${res.status} ${text}`);
  }

  const data = (await res.json()) as RunResponse;
  return data;
}

