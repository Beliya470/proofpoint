import Anthropic from "@anthropic-ai/sdk";
import { CONTEXT_BRIDGE_PROMPT } from "@/lib/prompts";
import { generateId } from "@/lib/utils";
import type { LoggedTaskEntry } from "@/lib/types";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { tasks, period }: { tasks: LoggedTaskEntry[]; period: string } =
      await request.json();

    const tasksSummary = tasks
      .map((t, i) => {
        const m = t.analysis.impactMetrics ?? {};
        const metricLines = [
          m.timeSaved ? `   Time saved: ${m.timeSaved}` : null,
          m.peopleUnblocked ? `   People unblocked: ${m.peopleUnblocked}` : null,
          m.riskPrevented ? `   Risk prevented: ${m.riskPrevented}` : null,
          m.scopeOfWork ? `   Scope: ${m.scopeOfWork}` : null,
          m.reliabilitySignal ? `   Reliability: ${m.reliabilitySignal}` : null,
          m.knowledgeCreated ? `   Knowledge created: ${m.knowledgeCreated}` : null,
        ].filter(Boolean).join("\n");
        return `${i + 1}. Task: "${t.task.description}"\n   Headline: ${t.analysis.headline}\n   Skills: ${t.analysis.skillsDemonstrated.join(", ")}${metricLines ? "\n" + metricLines : ""}`;
      })
      .join("\n\n");

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      system: CONTEXT_BRIDGE_PROMPT,
      messages: [
        {
          role: "user",
          content: `Generate a professional impact report for ${period}.\n\nUser: Anne Anziya, Junior QA Engineer at Redwood Software\nTimezone: EAT (UTC+3)\nManager timezone: PST (UTC-8)\n\nCompleted tasks:\n${tasksSummary}`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      return Response.json({ error: "Unexpected response" }, { status: 500 });
    }

    const cleaned = content.text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    const totalValue = tasks.reduce(
      (sum, t) => sum + t.analysis.estimatedValueNumeric,
      0
    );

    return Response.json({
      id: generateId(),
      taskIds: tasks.map((t) => t.task.id),
      period,
      ...parsed,
      totalEstimatedValue: `$${totalValue.toLocaleString()}`,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Context Bridge API error:", error);
    return Response.json({ error: "Report generation failed" }, { status: 500 });
  }
}
