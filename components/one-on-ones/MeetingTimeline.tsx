"use client";

import { useApp } from "@/context/AppContext";
import MeetingCard from "./MeetingCard";
import EmptyState from "@/components/shared/EmptyState";

export default function MeetingTimeline() {
  const { meetings } = useApp();

  const sorted = [...meetings].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (sorted.length === 0) {
    return (
      <EmptyState
        title="No 1:1s logged yet"
        description="Log your first 1:1 meeting to start building your career growth record."
        actionLabel="Log a 1:1"
        actionHref="/one-on-ones/new"
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#0F172A]">Meeting History</h3>
        <span className="text-xs text-gray-400">{sorted.length} meetings</span>
      </div>
      {sorted.map((meeting) => (
        <MeetingCard key={meeting.id} meeting={meeting} />
      ))}
    </div>
  );
}
