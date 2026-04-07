import Anthropic from "@anthropic-ai/sdk";
import { ONE_ON_ONE_SUMMARY_PROMPT } from "@/lib/prompts";
import type { OneOnOneMeeting } from "@/lib/types";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const {
      meeting,
      previousMeetings,
    }: {
      meeting: Omit<OneOnOneMeeting, "aiSummary" | "aiInsights" | "aiPrepForNext">;
      previousMeetings: OneOnOneMeeting[];
    } = await request.json();

    const prevSummaries = previousMeetings
      .slice(0, 3)
      .map(
        (m) =>
          `Meeting on ${m.date}: "${m.aiSummary}". Feedback themes: ${m.feedbackReceived.map((f) => f.area).join(", ")}.`
      )
      .join("\n");

    const prompt = `New meeting to analyze:

Team Lead: ${meeting.teamLead} (${meeting.teamLeadRole})
Date: ${meeting.date}
Duration: ${meeting.duration} minutes
Type: ${meeting.meetingType}
Mood: ${meeting.mood}

Topics: ${meeting.topicsDiscussed.join(", ")}

Notes: ${meeting.notes}

Wins: ${meeting.wins.join(", ") || "None recorded"}

Feedback received:
${meeting.feedbackReceived.map((f) => `- ${f.type} on ${f.area}: "${f.content}"`).join("\n") || "None"}

Goals set:
${meeting.goalsSet.map((g) => `- "${g.title}" (${g.category}, ${g.priority} priority, due ${g.targetDate})`).join("\n") || "None"}

Action items:
${meeting.actionItems.map((a) => `- ${a.owner}: "${a.description}" by ${a.dueDate}`).join("\n") || "None"}

Previous meeting context:
${prevSummaries || "No previous meetings recorded"}`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: ONE_ON_ONE_SUMMARY_PROMPT,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      return Response.json({ error: "Unexpected response" }, { status: 500 });
    }

    const cleaned = content.text.replace(/```json|```/g, "").trim();
    return Response.json(JSON.parse(cleaned));
  } catch (error) {
    console.error("1:1 Summary API error:", error);
    return Response.json({ error: "Summary generation failed" }, { status: 500 });
  }
}
