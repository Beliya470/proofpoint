"use client";

import { useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, Trophy } from "lucide-react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import FeedbackLog from "@/components/one-on-ones/FeedbackLog";
import ActionItems from "@/components/one-on-ones/ActionItems";
import GoalProgressCard from "@/components/one-on-ones/GoalProgressCard";
import PrepSheet from "@/components/one-on-ones/PrepSheet";
import type { Goal, ActionItem, ProgressNote } from "@/lib/types";

const MOOD_COLORS: Record<string, string> = {
  Positive: "#10B981", Neutral: "#2563EB", Challenging: "#F59E0B", Mixed: "#7C3AED",
};
const MEETING_TYPE_STYLES: Record<string, string> = {
  Scheduled: "bg-blue-100 text-blue-700",
  "Ad-hoc": "bg-gray-100 text-gray-600",
  "Performance Review": "bg-purple-100 text-purple-700",
  "Career Chat": "bg-green-100 text-green-700",
};

export default function MeetingDetailPage() {
  const params = useParams();
  const { meetings, updateMeeting } = useApp();

  const id = params.id as string;
  const idx = meetings.findIndex((m) => m.id === id);
  const meeting = idx !== -1 ? meetings[idx] : null;

  const sortedMeetings = [...meetings].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const sortedIdx = sortedMeetings.findIndex((m) => m.id === id);
  const prevMeeting = sortedIdx < sortedMeetings.length - 1 ? sortedMeetings[sortedIdx + 1] : null;
  const nextMeeting = sortedIdx > 0 ? sortedMeetings[sortedIdx - 1] : null;

  if (!meeting) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <p className="text-gray-400">Meeting not found.</p>
        <Link href="/one-on-ones" className="text-[#2563EB] text-sm mt-2 inline-block">
          ← Back to 1:1s
        </Link>
      </div>
    );
  }

  const date = new Date(meeting.date);
  const dateStr = date.toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
  const timeStr = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const handleGoalStatusChange = (goalId: string, status: Goal["status"]) => {
    updateMeeting({
      ...meeting,
      goalsSet: meeting.goalsSet.map((g) =>
        g.id === goalId
          ? { ...g, status, completedDate: status === "Completed" ? new Date().toISOString().split("T")[0] : g.completedDate }
          : g
      ),
    });
  };

  const handleGoalProgressChange = (goalId: string, pct: number) => {
    updateMeeting({
      ...meeting,
      goalsSet: meeting.goalsSet.map((g) => {
        if (g.id !== goalId) return g;
        const notes = [...g.progressNotes];
        if (notes.length > 0) {
          notes[notes.length - 1] = { ...notes[notes.length - 1], percentComplete: pct };
        } else {
          notes.push({
            id: `pn-${Date.now()}`,
            date: new Date().toISOString().split("T")[0],
            note: "Progress updated",
            percentComplete: pct,
          });
        }
        return { ...g, progressNotes: notes };
      }),
    });
  };

  const handleGoalAddNote = (goalId: string, note: string, pct: number) => {
    const newNote: ProgressNote = {
      id: `pn-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      note,
      percentComplete: pct,
    };
    updateMeeting({
      ...meeting,
      goalsSet: meeting.goalsSet.map((g) =>
        g.id === goalId
          ? { ...g, progressNotes: [...g.progressNotes, newNote] }
          : g
      ),
    });
  };

  const handleActionToggle = (actionId: string) => {
    updateMeeting({
      ...meeting,
      actionItems: meeting.actionItems.map((a) =>
        a.id === actionId
          ? { ...a, status: a.status === "Done" ? "Pending" : "Done" as ActionItem["status"] }
          : a
      ),
    });
  };

  const initials = meeting.teamLead.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Back nav */}
      <Link
        href="/one-on-ones"
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#1B2237] transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to 1:1s
      </Link>

      {/* Meeting header */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-[#1B2237] flex items-center justify-center text-white font-bold shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                  MEETING_TYPE_STYLES[meeting.meetingType] ?? "bg-gray-100 text-gray-600"
                }`}
              >
                {meeting.meetingType}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: MOOD_COLORS[meeting.mood] }}
                />
                {meeting.mood}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                {meeting.duration} min
              </span>
            </div>
            <h2 className="text-lg font-bold text-[#0F172A]">
              1:1 with {meeting.teamLead}
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">
              {meeting.teamLeadRole} · {meeting.teamLeadTimezone}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {dateStr} at {timeStr}
            </p>
          </div>
        </div>
      </div>

      {/* AI Summary */}
      <div className="bg-[#EFF6FF] rounded-xl p-5 border border-[#BFDBFE]">
        <h3 className="text-xs font-bold text-[#1B2237] uppercase tracking-wide mb-2">
          AI Meeting Summary
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed">{meeting.aiSummary}</p>
      </div>

      {/* Topics & Notes */}
      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
        <h3 className="text-xs font-bold text-[#1B2237] uppercase tracking-wide mb-3">
          Topics & Notes
        </h3>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {meeting.topicsDiscussed.map((t) => (
            <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-[#EFF6FF] text-[#1B2237] font-medium">
              {t}
            </span>
          ))}
        </div>
        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
          {meeting.notes}
        </p>
      </div>

      {/* Wins */}
      {meeting.wins.length > 0 && (
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-4 h-4 text-[#F59E0B]" />
            <h3 className="text-xs font-bold text-[#1B2237] uppercase tracking-wide">
              Wins Acknowledged
            </h3>
          </div>
          <div className="space-y-2">
            {meeting.wins.map((win, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-green-500 mt-0.5">✓</span>
                {win}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feedback */}
      {meeting.feedbackReceived.length > 0 && (
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-xs font-bold text-[#1B2237] uppercase tracking-wide mb-3">
            Feedback Received
          </h3>
          <FeedbackLog items={meeting.feedbackReceived} />
        </div>
      )}

      {/* Goals */}
      {meeting.goalsSet.length > 0 && (
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-xs font-bold text-[#1B2237] uppercase tracking-wide mb-3">
            Goals Set
          </h3>
          <div className="space-y-3">
            {meeting.goalsSet.map((goal) => (
              <GoalProgressCard
                key={goal.id}
                goal={goal}
                onStatusChange={(goalId, status) => handleGoalStatusChange(goalId, status)}
                onProgressChange={(goalId, pct) => handleGoalProgressChange(goalId, pct)}
                onAddNote={(goalId, note, pct) => handleGoalAddNote(goalId, note, pct)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Action Items */}
      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
        <h3 className="text-xs font-bold text-[#1B2237] uppercase tracking-wide mb-3">
          Action Items
        </h3>
        <ActionItems items={meeting.actionItems} onToggle={handleActionToggle} />
      </div>

      {/* Questions */}
      {meeting.questionsRaised.length > 0 && (
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-xs font-bold text-[#1B2237] uppercase tracking-wide mb-3">
            Questions for Next Time
          </h3>
          <div className="space-y-2">
            {meeting.questionsRaised.map((q, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-[#2563EB] font-bold mt-0.5">?</span>
                {q}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Insights */}
      {meeting.aiInsights.length > 0 && (
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-xs font-bold text-[#1B2237] uppercase tracking-wide mb-3">
            AI Insights
          </h3>
          <div className="space-y-3">
            {meeting.aiInsights.map((insight, i) => (
              <div key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                <span className="w-5 h-5 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {insight}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prep for next */}
      <PrepSheet prepText={meeting.aiPrepForNext} meetingDate={meeting.date} />

      {/* Quick Coach shortcut */}
      <div className="text-center">
        <Link
          href={`/advocacy-coach?scenario=${encodeURIComponent(
            `I have a bi-weekly 1:1 with ${meeting.teamLead} (${meeting.teamLeadRole}) coming up. I want to discuss my progress on active goals and ask about next steps in my development. How do I make this conversation count?`
          )}`}
          className="text-sm text-[#2563EB] hover:underline"
        >
          Practice this conversation → Advocacy Coach
        </Link>
      </div>

      {/* Previous / Next nav */}
      <div className="flex items-center justify-between pt-2">
        {prevMeeting ? (
          <Link
            href={`/one-on-ones/${prevMeeting.id}`}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#1B2237] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>
              {new Date(prevMeeting.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          </Link>
        ) : <div />}
        {nextMeeting ? (
          <Link
            href={`/one-on-ones/${nextMeeting.id}`}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#1B2237] transition-colors"
          >
            <span>
              {new Date(nextMeeting.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
