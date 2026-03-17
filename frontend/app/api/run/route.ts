import { NextResponse } from "next/server";
import { runPersona } from "@/lib/api";
import type { RunRequest } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RunRequest;

    if (!body.prompt || !body.persona) {
      return NextResponse.json(
        { error: "Missing prompt or persona." },
        { status: 400 }
      );
    }

    const result = await runPersona(body);
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to run persona." },
      { status: 500 }
    );
  }
}

