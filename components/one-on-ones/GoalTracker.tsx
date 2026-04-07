"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Target } from "lucide-react";
import { useApp } from "@/context/AppContext";
import GoalProgressCard from "./GoalProgressCard";
import type { Goal, ProgressNote } from "@/lib/types";

export default function GoalTracker() {
  const { meetings, updateMeeting } = useApp();
  const [showCompleted, setShowCompleted] = useState(false);

  // Flatten all goals with their meeting dates
  const allGoals = meetings.flatMap((m) =>
    m.goalsSet.map((g) => ({ goal: g, meetingId: m.id, meetingDate: m.date }))
  );

  const activeGoals = allGoals.filter(
    (g) => g.goal.status !== "Completed" && g.goal.status !== "Deferred"
  );
  const completedGoals = allGoals.filter((g) => g.goal.status === "Completed");

  const handleStatusChange = (
    meetingId: string,
    goalId: string,
    status: Goal["status"]
  ) => {
    const meeting = meetings.find((m) => m.id === meetingId);
    if (!meeting) return;
    updateMeeting({
      ...meeting,
      goalsSet: meeting.goalsSet.map((g) =>
        g.id === goalId
          ? {
              ...g,
              status,
              completedDate:
                status === "Completed"
                  ? new Date().toISOString().split("T")[0]
                  : g.completedDate,
            }
          : g
      ),
    });
  };

  const handleProgressChange = (
    meetingId: string,
    goalId: string,
    pct: number
  ) => {
    const meeting = meetings.find((m) => m.id === meetingId);
    if (!meeting) return;
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

  const handleAddNote = (
    meetingId: string,
    goalId: string,
    note: string,
    pct: number
  ) => {
    const meeting = meetings.find((m) => m.id === meetingId);
    if (!meeting) return;
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

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
        <Target className="w-4 h-4 text-[#2563EB]" />
        <h3 className="text-sm font-semibold text-[#0F172A]">Active Goals</h3>
        <span className="ml-auto text-xs text-gray-400">{activeGoals.length} active</span>
      </div>

      <div className="p-3 space-y-3 max-h-[500px] overflow-y-auto">
        {activeGoals.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">
            No active goals yet. Log a 1:1 to set some.
          </p>
        ) : (
          activeGoals.map(({ goal, meetingId, meetingDate }) => (
            <GoalProgressCard
              key={goal.id}
              goal={goal}
              meetingDate={meetingDate}
              onStatusChange={(goalId, status) =>
                handleStatusChange(meetingId, goalId, status)
              }
              onProgressChange={(goalId, pct) =>
                handleProgressChange(meetingId, goalId, pct)
              }
              onAddNote={(goalId, note, pct) =>
                handleAddNote(meetingId, goalId, note, pct)
              }
            />
          ))
        )}
      </div>

      {completedGoals.length > 0 && (
        <>
          <div className="border-t border-gray-100">
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-xs text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium">
                {completedGoals.length} completed goal{completedGoals.length !== 1 ? "s" : ""}
              </span>
              {showCompleted ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {showCompleted && (
            <div className="p-3 space-y-3 bg-gray-50/50">
              {completedGoals.map(({ goal, meetingId, meetingDate }) => (
                <GoalProgressCard
                  key={goal.id}
                  goal={goal}
                  meetingDate={meetingDate}
                  onStatusChange={(goalId, status) =>
                    handleStatusChange(meetingId, goalId, status)
                  }
                  onProgressChange={(goalId, pct) =>
                    handleProgressChange(meetingId, goalId, pct)
                  }
                  onAddNote={(goalId, note, pct) =>
                    handleAddNote(meetingId, goalId, note, pct)
                  }
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
