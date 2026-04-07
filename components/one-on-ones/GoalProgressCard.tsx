"use client";

import { useState, useEffect } from "react";
import { Calendar, AlertCircle } from "lucide-react";
import type { Goal } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  "Not Started": { bg: "#F3F4F6", text: "#6B7280", border: "#E5E7EB" },
  "In Progress": { bg: "#DBEAFE", text: "#2563EB", border: "#BFDBFE" },
  Completed: { bg: "#DCFCE7", text: "#10B981", border: "#BBF7D0" },
  Blocked: { bg: "#FEE2E2", text: "#EF4444", border: "#FECACA" },
  Deferred: { bg: "#FEF3C7", text: "#F59E0B", border: "#FDE68A" },
};

const ALL_STATUSES: Goal["status"][] = [
  "Not Started",
  "In Progress",
  "Completed",
  "Blocked",
  "Deferred",
];

const BAR_COLORS: Record<string, string> = {
  "Not Started": "#9CA3AF",
  "In Progress": "#2563EB",
  Completed: "#10B981",
  Blocked: "#EF4444",
  Deferred: "#F59E0B",
};

const PRIORITY_COLORS: Record<string, string> = {
  High: "#EF4444",
  Medium: "#F59E0B",
  Low: "#6B7280",
};

const CATEGORY_BG: Record<string, string> = {
  "Technical Skill": "#EDE9FE",
  "Soft Skill": "#FCE7F3",
  Certification: "#DBEAFE",
  "Project Milestone": "#DCFCE7",
  "Career Development": "#FEF3C7",
  "Process Improvement": "#CFFAFE",
  "Client Relationship": "#FEE2E2",
  Leadership: "#EDE9FE",
};

const CATEGORY_TEXT: Record<string, string> = {
  "Technical Skill": "#7C3AED",
  "Soft Skill": "#DB2777",
  Certification: "#2563EB",
  "Project Milestone": "#10B981",
  "Career Development": "#F59E0B",
  "Process Improvement": "#0891B2",
  "Client Relationship": "#EF4444",
  Leadership: "#7C3AED",
};

interface GoalProgressCardProps {
  goal: Goal;
  onStatusChange?: (goalId: string, status: Goal["status"]) => void;
  onProgressChange?: (goalId: string, pct: number) => void;
  onAddNote?: (goalId: string, note: string, pct: number) => void;
  meetingDate?: string;
}

export default function GoalProgressCard({
  goal,
  onStatusChange,
  onProgressChange,
  onAddNote,
  meetingDate,
}: GoalProgressCardProps) {
  const latestProgress = goal.progressNotes[goal.progressNotes.length - 1];

  const [localPct, setLocalPct] = useState(latestProgress?.percentComplete ?? 0);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText] = useState("");

  // Sync when a note is added externally (parent updates goal)
  useEffect(() => {
    const latest = goal.progressNotes[goal.progressNotes.length - 1];
    setLocalPct(latest?.percentComplete ?? 0);
  }, [goal.progressNotes]);

  const targetDate = new Date(goal.targetDate);
  const isOverdue =
    targetDate < new Date() && goal.status !== "Completed";
  const targetStr = targetDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const styles = STATUS_STYLES[goal.status] ?? STATUS_STYLES["Not Started"];
  const barColor = BAR_COLORS[goal.status] ?? "#2563EB";

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setLocalPct(val);
    onProgressChange?.(goal.id, val);
  };

  const handleSaveNote = () => {
    if (!noteText.trim()) return;
    onAddNote?.(goal.id, noteText.trim(), localPct);
    setNoteText("");
    setShowNoteInput(false);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-start gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#0F172A] leading-tight mb-1">
            {goal.title}
          </p>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{
                backgroundColor: CATEGORY_BG[goal.category] ?? "#F3F4F6",
                color: CATEGORY_TEXT[goal.category] ?? "#6B7280",
              }}
            >
              {goal.category}
            </span>
            <span className="text-xs font-medium" style={{ color: PRIORITY_COLORS[goal.priority] }}>
              {goal.priority}
            </span>
            {goal.setBy === "Team Lead" && (
              <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                Set by team lead
              </span>
            )}
          </div>
        </div>

        {/* Status — dropdown when editable, pill when read-only */}
        {onStatusChange ? (
          <select
            value={goal.status}
            onChange={(e) => onStatusChange(goal.id, e.target.value as Goal["status"])}
            className="text-xs px-2 py-1 rounded-full font-medium border cursor-pointer shrink-0 focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            style={{
              backgroundColor: styles.bg,
              color: styles.text,
              borderColor: styles.border,
            }}
          >
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        ) : (
          <span
            className="text-xs px-2.5 py-1 rounded-full font-medium border shrink-0"
            style={{
              backgroundColor: styles.bg,
              color: styles.text,
              borderColor: styles.border,
            }}
          >
            {goal.status}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-400">Progress</span>
          <span className="text-xs font-medium text-gray-600">{localPct}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${localPct}%`, backgroundColor: barColor }}
          />
        </div>
      </div>

      {/* Slider */}
      {onProgressChange && (
        <div className="mb-2">
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={localPct}
            onChange={handleSliderChange}
            className="w-full cursor-pointer accent-[#2563EB]"
          />
        </div>
      )}

      {/* Add Progress Note */}
      {onAddNote && (
        <div className="mb-2">
          {!showNoteInput ? (
            <button
              onClick={() => setShowNoteInput(true)}
              className="text-xs text-[#2563EB] hover:underline"
            >
              + Add Progress Note
            </button>
          ) : (
            <div className="space-y-1.5 mt-1">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="e.g. Completed Module 2 of SAP Basics"
                className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-[#2563EB] text-gray-700"
                rows={2}
                autoFocus
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveNote}
                  disabled={!noteText.trim()}
                  className="text-xs px-3 py-1 rounded-lg bg-[#2563EB] text-white font-medium hover:bg-[#1D4ED8] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Save Note
                </button>
                <button
                  onClick={() => {
                    setShowNoteInput(false);
                    setNoteText("");
                  }}
                  className="text-xs px-3 py-1 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span className={cn("flex items-center gap-1", isOverdue && "text-red-500")}>
          {isOverdue && <AlertCircle className="w-3 h-3" />}
          <Calendar className="w-3 h-3" />
          {isOverdue ? "Overdue · " : "Due "}
          {targetStr}
        </span>
        {meetingDate && (
          <span>
            From{" "}
            {new Date(meetingDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        )}
      </div>

      {/* Latest progress note */}
      {latestProgress && goal.status !== "Not Started" && (
        <p className="mt-2 text-xs text-gray-400 italic border-t border-gray-50 pt-2">
          {latestProgress.note}
        </p>
      )}
    </div>
  );
}
