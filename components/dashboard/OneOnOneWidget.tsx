"use client";

import Link from "next/link";
import { Users, Target, CheckSquare, Calendar, ArrowRight, PlusCircle } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { MOCK_ONE_ON_ONE_STATS } from "@/lib/mock-data";

export default function OneOnOneWidget() {
  const { meetings } = useApp();
  const s = MOCK_ONE_ON_ONE_STATS;

  const allGoals = meetings.flatMap((m) => m.goalsSet);
  const activeGoals = allGoals.filter(
    (g) => g.status === "In Progress" || g.status === "Not Started"
  );
  const completedGoals = allGoals.filter((g) => g.status === "Completed").length;
  const totalGoals = allGoals.length;
  const pct = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  const allActions = meetings.flatMap((m) => m.actionItems);
  const overdueActions = allActions.filter((a) => a.status === "Overdue");
  const pendingActions = allActions.filter((a) => a.status === "Pending");

  const nextMeeting = s.nextScheduledMeeting ? new Date(s.nextScheduledMeeting) : null;
  const daysUntil = nextMeeting
    ? Math.ceil((nextMeeting.getTime() - Date.now()) / 86400000)
    : null;

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
            <Users className="w-4 h-4 text-[#2563EB]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#0F172A]">1:1 Progress</h3>
            <p className="text-xs text-gray-400">{meetings.length} meetings logged</p>
          </div>
        </div>
        <Link
          href="/one-on-ones"
          className="text-xs text-[#2563EB] hover:text-[#2563EB] flex items-center gap-1 font-medium transition-colors"
        >
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {/* Goals */}
        <div className="bg-[#F1F5F9] rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Target className="w-3.5 h-3.5 text-[#2563EB]" />
            <span className="text-xs font-medium text-gray-500">Goals</span>
          </div>
          <p className="text-xl font-bold text-[#2563EB]">{pct}%</p>
          <p className="text-xs text-gray-400">{completedGoals}/{totalGoals} complete</p>
          <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2563EB] rounded-full"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Action items */}
        <div className={`rounded-xl p-3 ${overdueActions.length > 0 ? "bg-red-50" : "bg-[#F1F5F9]"}`}>
          <div className="flex items-center gap-1.5 mb-2">
            <CheckSquare className={`w-3.5 h-3.5 ${overdueActions.length > 0 ? "text-red-500" : "text-[#2563EB]"}`} />
            <span className="text-xs font-medium text-gray-500">Actions</span>
          </div>
          <p className={`text-xl font-bold ${overdueActions.length > 0 ? "text-red-500" : "text-[#2563EB]"}`}>
            {pendingActions.length + overdueActions.length}
          </p>
          <p className="text-xs text-gray-400">
            pending{overdueActions.length > 0 && `, ${overdueActions.length} overdue`}
          </p>
        </div>

        {/* Next 1:1 */}
        <div className="bg-[#F1F5F9] rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
            <span className="text-xs font-medium text-gray-500">Next 1:1</span>
          </div>
          <p className="text-xl font-bold text-[#2563EB]">
            {daysUntil !== null ? (daysUntil === 0 ? "Today" : `${daysUntil}d`) : "—"}
          </p>
          <p className="text-xs text-gray-400">
            {nextMeeting
              ? nextMeeting.toLocaleDateString("en-US", { month: "short", day: "numeric" })
              : "Not scheduled"}
          </p>
        </div>
      </div>

      {/* Active goals preview */}
      {activeGoals.length > 0 && (
        <div className="border-t border-gray-100 pt-3">
          <p className="text-xs text-gray-400 mb-2">{activeGoals.length} active goal{activeGoals.length !== 1 ? "s" : ""}</p>
          <div className="space-y-1.5">
            {activeGoals.slice(0, 3).map((g) => {
              const latest = g.progressNotes[g.progressNotes.length - 1];
              const pctDone = latest?.percentComplete ?? 0;
              return (
                <div key={g.id} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 truncate">{g.title}</p>
                    <div className="h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-[#2563EB] rounded-full"
                        style={{ width: `${pctDone}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">{pctDone}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
        <Link
          href="/one-on-ones/new"
          className="flex-1 flex items-center justify-center gap-1.5 bg-[#2563EB] text-white text-xs font-medium py-2 rounded-lg hover:bg-[#1D4ED8] transition-colors"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          Log a 1:1
        </Link>
        <Link
          href="/one-on-ones"
          className="flex-1 flex items-center justify-center gap-1.5 bg-[#EFF6FF] text-[#2563EB] text-xs font-medium py-2 rounded-lg hover:bg-[#DBEAFE] transition-colors"
        >
          <Users className="w-3.5 h-3.5" />
          View Tracker
        </Link>
      </div>
    </div>
  );
}
