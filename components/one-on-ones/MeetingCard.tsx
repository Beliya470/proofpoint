"use client";

import Link from "next/link";
import { Clock, Target, CheckSquare, ChevronRight } from "lucide-react";
import type { OneOnOneMeeting } from "@/lib/types";

const MOOD_COLORS: Record<string, string> = {
  Positive: "#27AE60",
  Neutral: "#2563EB",
  Challenging: "#E67E22",
  Mixed: "#8E44AD",
};

const MEETING_TYPE_STYLES: Record<string, string> = {
  Scheduled: "bg-blue-100 text-blue-700",
  "Ad-hoc": "bg-gray-100 text-gray-600",
  "Performance Review": "bg-purple-100 text-purple-700",
  "Career Chat": "bg-green-100 text-green-700",
};

interface MeetingCardProps {
  meeting: OneOnOneMeeting;
}

export default function MeetingCard({ meeting }: MeetingCardProps) {
  const date = new Date(meeting.date);
  const dateStr = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const activeGoals = meeting.goalsSet.filter(
    (g) => g.status !== "Completed"
  ).length;
  const pendingActions = meeting.actionItems.filter(
    (a) => a.status === "Pending" || a.status === "Overdue"
  ).length;

  const initials = meeting.teamLead
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Link
      href={`/one-on-ones/${meeting.id}`}
      className="block bg-white rounded-xl border border-gray-100 shadow-sm hover:border-[#2563EB] hover:shadow-md transition-all p-4 group"
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-sm font-bold shrink-0">
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs text-gray-400">{dateStr}</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                MEETING_TYPE_STYLES[meeting.meetingType] ?? "bg-gray-100 text-gray-600"
              }`}
            >
              {meeting.meetingType}
            </span>
            {/* Mood dot */}
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: MOOD_COLORS[meeting.mood] }}
              />
              {meeting.mood}
            </span>
            <span className="text-xs text-gray-300 flex items-center gap-1 ml-auto">
              <Clock className="w-3 h-3" />
              {meeting.duration}m
            </span>
          </div>

          {/* Name + role */}
          <p className="text-sm font-semibold text-[#0F172A] mb-1">
            {meeting.teamLead}{" "}
            <span className="text-gray-400 font-normal">· {meeting.teamLeadRole}</span>
          </p>

          {/* AI summary snippet */}
          <p className="text-xs text-gray-500 line-clamp-2 mb-2 leading-relaxed">
            {meeting.aiSummary}
          </p>

          {/* Topics */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {meeting.topicsDiscussed.slice(0, 4).map((topic) => (
              <span
                key={topic}
                className="text-xs px-2 py-0.5 rounded-full bg-[#F1F5F9] text-gray-500 border border-gray-100"
              >
                {topic}
              </span>
            ))}
            {meeting.topicsDiscussed.length > 4 && (
              <span className="text-xs text-gray-400">
                +{meeting.topicsDiscussed.length - 4} more
              </span>
            )}
          </div>

          {/* Footer counts */}
          <div className="flex items-center gap-4 text-xs text-gray-400">
            {meeting.goalsSet.length > 0 && (
              <span className="flex items-center gap-1">
                <Target className="w-3 h-3" />
                {meeting.goalsSet.length} goal{meeting.goalsSet.length !== 1 ? "s" : ""} set
                {activeGoals > 0 && (
                  <span className="text-[#2563EB]">({activeGoals} active)</span>
                )}
              </span>
            )}
            {meeting.actionItems.length > 0 && (
              <span className="flex items-center gap-1">
                <CheckSquare className="w-3 h-3" />
                {pendingActions} action{pendingActions !== 1 ? "s" : ""} pending
              </span>
            )}
          </div>
        </div>

        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#2563EB] transition-colors shrink-0 mt-1" />
      </div>
    </Link>
  );
}
