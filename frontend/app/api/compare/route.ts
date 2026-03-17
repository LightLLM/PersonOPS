import { NextResponse } from "next/server";
import type { PersonaId, RunRequest, RunResponse } from "@/lib/types";
import { runPersona } from "@/lib/api";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { prompt: string };

    if (!body.prompt) {
      return NextResponse.json(
        { error: "Missing prompt." },
        { status: 400 }
      );
    }

    const personas: PersonaId[] = ["compliance", "sales", "research"];

    const requests: RunRequest[] = personas.map((p) => ({
      prompt: body.prompt,
      persona: p
    }));

    const results: RunResponse[] = await Promise.all(
      requests.map((r) => runPersona(r))
    );

    return NextResponse.json({ results });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to compare personas." },
      { status: 500 }
    );
  }
}

