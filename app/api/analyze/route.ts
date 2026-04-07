import Anthropic from "@anthropic-ai/sdk";
import { IMPACT_ANALYSIS_PROMPT } from "@/lib/prompts";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { task, taskId } = await request.json();

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: IMPACT_ANALYSIS_PROMPT,
      messages: [
        {
          role: "user",
          content: `Analyze the business impact of this task completed by a junior professional:\n\n"${task}"`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      return Response.json({ error: "Unexpected response" }, { status: 500 });
    }

    const cleaned = content.text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return Response.json({
      ...parsed,
      taskId,
      currency: "USD",
      impactCategory: parsed.businessMetric,
    });
  } catch (error) {
    console.error("Analyze API error:", error);
    return Response.json({ error: "Analysis failed" }, { status: 500 });
  }
}
