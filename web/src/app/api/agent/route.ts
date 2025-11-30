import { NextResponse } from "next/server";
import {
  buildAgentResponse,
  fetchTrendingTopics,
} from "@/lib/agent";

export const revalidate = 0;

export async function GET() {
  try {
    const topics = await fetchTrendingTopics();
    if (!topics.length) {
      return NextResponse.json(
        { error: "No topics available. Try again shortly." },
        { status: 503 }
      );
    }

    const payload = buildAgentResponse(topics);
    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    console.error("Agent generation failed", error);
    return NextResponse.json(
      { error: "Agent generation failed. Please retry later." },
      { status: 500 }
    );
  }
}

