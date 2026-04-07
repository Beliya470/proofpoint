import Anthropic from "@anthropic-ai/sdk";
import { ADVOCACY_COACH_PROMPT } from "@/lib/prompts";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { userMessage, scenarioId, conversationHistory } =
      await request.json();

    const messages = [
      ...conversationHistory.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user" as const, content: userMessage },
    ];

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: `${ADVOCACY_COACH_PROMPT}\n\nCurrent scenario ID: ${scenarioId}`,
      messages,
    });

    const content = message.content[0];
    if (content.type !== "text") {
      return Response.json({ error: "Unexpected response" }, { status: 500 });
    }

    return Response.json({ message: content.text });
  } catch (error) {
    console.error("Advocacy Coach API error:", error);
    return Response.json({ error: "Coach response failed" }, { status: 500 });
  }
}
