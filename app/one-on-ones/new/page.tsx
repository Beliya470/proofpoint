"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bot, Edit3, Save, Sparkles, ClipboardList } from "lucide-react";
import MeetingForm from "@/components/one-on-ones/MeetingForm";
import SmartImport from "@/components/one-on-ones/SmartImport";
import PrepSheet from "@/components/one-on-ones/PrepSheet";
import LoadingState from "@/components/shared/LoadingState";
import { generateMeetingSummary } from "@/lib/ai-service";
import { useApp } from "@/context/AppContext";
import { generateId } from "@/lib/utils";
import type { OneOnOneMeeting, FeedbackItem, Goal, ActionItem } from "@/lib/types";

type PageState = "form" | "loading" | "review";
type InputTab = "smart" | "manual";

interface FormData {
  teamLead: string;
  teamLeadRole: string;
  date: string;
  duration: number;
  meetingType: OneOnOneMeeting["meetingType"];
  mood: OneOnOneMeeting["mood"];
  topicsDiscussed: string[];
  notes: string;
  wins: string[];
  feedbackReceived: Omit<FeedbackItem, "id" | "meetingId">[];
  goalsSet: Omit<Goal, "id" | "meetingId" | "progressNotes" | "linkedTaskIds" | "completedDate">[];
  actionItems: Omit<ActionItem, "id" | "meetingId" | "completedDate">[];
  questionsRaised: string[];
}

export default function NewOneOnOnePage() {
  const router = useRouter();
  const { meetings, addMeeting } = useApp();
  const [activeTab, setActiveTab] = useState<InputTab>("smart");
  const [pageState, setPageState] = useState<PageState>("form");
  const [pendingMeeting, setPendingMeeting] = useState<OneOnOneMeeting | null>(null);

  const handleFormSubmit = async (data: FormData) => {
    const meetingId = generateId();
    setPageState("loading");

    const partial = {
      id: meetingId,
      date: new Date(data.date).toISOString(),
      teamLead: data.teamLead,
      teamLeadRole: data.teamLeadRole,
      teamLeadTimezone: "PST (UTC-8)",
      duration: data.duration,
      meetingType: data.meetingType,
      mood: data.mood,
      topicsDiscussed: data.topicsDiscussed,
      notes: data.notes,
      wins: data.wins,
      questionsRaised: data.questionsRaised,
      feedbackReceived: data.feedbackReceived.map((f) => ({
        ...f,
        id: generateId(),
        meetingId,
      })) as FeedbackItem[],
      goalsSet: data.goalsSet.map((g) => ({
        ...g,
        id: generateId(),
        meetingId,
        progressNotes: [],
        linkedTaskIds: [],
      })) as Goal[],
      actionItems: data.actionItems.map((a) => ({
        ...a,
        id: generateId(),
        meetingId,
      })) as ActionItem[],
    };

    try {
      const { summary, insights, prepForNext } = await generateMeetingSummary(partial, meetings);
      const fullMeeting: OneOnOneMeeting = {
        ...partial,
        aiSummary: summary,
        aiInsights: insights,
        aiPrepForNext: prepForNext,
      };
      setPendingMeeting(fullMeeting);
      setPageState("review");
    } catch {
      setPageState("form");
    }
  };

  const handleSave = () => {
    if (!pendingMeeting) return;
    addMeeting(pendingMeeting);
    router.push(`/one-on-ones/${pendingMeeting.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#0F172A]">Log a 1:1 Meeting</h2>
        <p className="text-gray-400 text-sm mt-1">
          Capture what was discussed, what was promised, and what you&apos;re working toward.
        </p>
      </div>

      {/* Tabs */}
      {pageState === "form" && (
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
          <button
            onClick={() => setActiveTab("smart")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "smart"
                ? "bg-white text-[#2563EB] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Smart Import
          </button>
          <button
            onClick={() => setActiveTab("manual")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "manual"
                ? "bg-white text-[#2563EB] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            Manual Entry
          </button>
        </div>
      )}

      {/* Smart Import tab */}
      {pageState === "form" && activeTab === "smart" && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <SmartImport />
        </div>
      )}

      {/* Manual Entry tab — form phase */}
      {pageState === "form" && activeTab === "manual" && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <MeetingForm onSubmit={handleFormSubmit} loading={false} />
        </div>
      )}

      {/* Loading phase */}
      {pageState === "loading" && (
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
          <LoadingState message="Processing your 1:1..." />
          <p className="text-center text-xs text-gray-300 mt-2">
            Generating summary, insights, and prep for next meeting...
          </p>
        </div>
      )}

      {/* Review phase */}
      {pageState === "review" && pendingMeeting && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-[#2563EB] flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-[#0F172A]">Meeting Summary</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{pendingMeeting.aiSummary}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="text-sm font-semibold text-[#0F172A] mb-3">AI Insights</h3>
            <div className="space-y-2">
              {pendingMeeting.aiInsights.map((insight, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <div className="w-5 h-5 rounded-full bg-[#EFF6FF] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[#2563EB] text-xs font-bold">{i + 1}</span>
                  </div>
                  {insight}
                </div>
              ))}
            </div>
          </div>

          <PrepSheet prepText={pendingMeeting.aiPrepForNext} meetingDate={pendingMeeting.date} />

          <div className="flex gap-3">
            <button
              onClick={() => setPageState("form")}
              className="flex items-center gap-2 border-2 border-gray-200 text-gray-600 text-sm font-medium px-4 py-2.5 rounded-xl hover:border-gray-300 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 bg-[#2563EB] text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-[#1D4ED8] transition-colors"
            >
              <Save className="w-4 h-4" />
              Save 1:1 Record
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
