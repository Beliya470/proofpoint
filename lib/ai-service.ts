import { getMockImpactAnalysis, getMockCoachFeedback, MOCK_CONTEXT_REPORT, getMockMeetingSummary } from "./mock-data";
import type { ImpactAnalysis, ContextReport, LoggedTaskEntry, OneOnOneMeeting } from "./types";

const USE_REAL_API = process.env.NEXT_PUBLIC_USE_REAL_API === "true";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

// ─── Impact Analysis ──────────────────────────────────────────────────────────

export async function analyzeImpact(
  taskDescription: string,
  taskId: string
): Promise<ImpactAnalysis> {
  if (USE_REAL_API) {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task: taskDescription, taskId }),
    });
    if (!response.ok) throw new Error("Failed to analyze impact");
    return response.json();
  }

  await delay(1600);
  const mock = getMockImpactAnalysis(taskDescription);
  return { ...mock, taskId };
}

// ─── Context Bridge ───────────────────────────────────────────────────────────

export async function generateContextReport(
  tasks: LoggedTaskEntry[],
  period: string
): Promise<ContextReport> {
  if (USE_REAL_API) {
    const response = await fetch("/api/context-bridge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tasks, period }),
    });
    if (!response.ok) throw new Error("Failed to generate report");
    return response.json();
  }

  await delay(2000);
  const totalValue = tasks.reduce(
    (sum, t) => sum + t.analysis.estimatedValueNumeric,
    0
  );
  return {
    id: generateId(),
    taskIds: tasks.map((t) => t.task.id),
    period,
    ...MOCK_CONTEXT_REPORT,
    totalEstimatedValue: `$${totalValue.toLocaleString()}`,
    generatedAt: new Date().toISOString(),
  };
}

// ─── Advocacy Coach ───────────────────────────────────────────────────────────

export async function getCoachResponse(
  userMessage: string,
  scenarioId: string,
  conversationHistory: { role: string; content: string }[]
): Promise<string> {
  if (USE_REAL_API) {
    const response = await fetch("/api/advocacy-coach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userMessage, scenarioId, conversationHistory }),
    });
    if (!response.ok) throw new Error("Failed to get coach response");
    const data = await response.json();
    return data.message;
  }

  await delay(1500);
  return getMockCoachFeedback(userMessage, scenarioId);
}

// ─── 1:1 Meeting Summary ──────────────────────────────────────────────────────

export async function generateMeetingSummary(
  meeting: Omit<OneOnOneMeeting, "aiSummary" | "aiInsights" | "aiPrepForNext">,
  previousMeetings: OneOnOneMeeting[]
): Promise<{ summary: string; insights: string[]; prepForNext: string }> {
  if (USE_REAL_API) {
    const response = await fetch("/api/one-on-one-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ meeting, previousMeetings }),
    });
    if (!response.ok) throw new Error("Failed to generate meeting summary");
    return response.json();
  }

  await delay(2000);
  return getMockMeetingSummary();
}
