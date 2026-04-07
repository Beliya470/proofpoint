import Link from "next/link";
import { PlusCircle, MessageSquare } from "lucide-react";
import MeetingStats from "@/components/one-on-ones/MeetingStats";
import MeetingTimeline from "@/components/one-on-ones/MeetingTimeline";
import GoalTracker from "@/components/one-on-ones/GoalTracker";
import InsightsSummary from "@/components/one-on-ones/InsightsSummary";

export default function OneOnOnesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] flex items-center justify-center shrink-0">
            <MessageSquare className="w-6 h-6 text-[#2563EB]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#0F172A]">1:1 Tracker</h2>
            <p className="text-gray-400 text-sm mt-1">
              Turn every conversation with your team lead into career growth evidence.
            </p>
          </div>
        </div>
        <Link
          href="/one-on-ones/new"
          className="flex items-center gap-2 bg-[#2563EB] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#1D4ED8] transition-colors shrink-0 shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Log a 1:1</span>
          <span className="sm:hidden">Log</span>
        </Link>
      </div>

      {/* Stats */}
      <MeetingStats />

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 space-y-4">
          <MeetingTimeline />
        </div>
        <div className="lg:col-span-2">
          <GoalTracker />
        </div>
      </div>

      {/* AI Insights */}
      <InsightsSummary />
    </div>
  );
}
