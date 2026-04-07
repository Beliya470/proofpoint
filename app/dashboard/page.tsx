import Link from "next/link";
import { PlusCircle, FileText, MessageSquare, Flame, Users } from "lucide-react";
import QuickStats from "@/components/dashboard/QuickStats";
import WeeklyTrend from "@/components/dashboard/WeeklyTrend";
import ImpactSummaryCard from "@/components/dashboard/ImpactSummaryCard";
import RecentTasks from "@/components/dashboard/RecentTasks";
import SkillsRadar from "@/components/dashboard/SkillsRadar";
import OneOnOneWidget from "@/components/dashboard/OneOnOneWidget";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-[#1B2237] rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold mb-1">Good morning, Anne</h2>
            <p className="text-[#A8B4C8] text-sm">
              Your work is making a real difference. Here&apos;s the proof.
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-[#243049] rounded-lg px-3 py-1.5">
            <Flame className="w-4 h-4 text-orange-300" />
            <span className="text-sm font-semibold text-white">5 day streak</span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <QuickStats />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <WeeklyTrend />
        <ImpactSummaryCard />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RecentTasks />
        </div>
        <SkillsRadar />
      </div>

      {/* 1:1 widget */}
      <OneOnOneWidget />

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          href="/log"
          className="flex items-center gap-3 bg-[#2563EB] text-white p-4 rounded-xl hover:bg-[#1D4ED8] transition-colors group shadow-sm"
        >
          <div className="w-9 h-9 bg-white/15 rounded-lg flex items-center justify-center group-hover:bg-white/25 transition-colors">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-sm">Log a Task</p>
            <p className="text-blue-200/80 text-xs">Reveal your impact</p>
          </div>
        </Link>
        <Link
          href="/context-bridge"
          className="flex items-center gap-3 bg-white text-[#0F172A] p-4 rounded-xl border border-[#E2E8F0] hover:border-[#2563EB] hover:shadow-sm transition-all group"
        >
          <div className="w-9 h-9 bg-[#EFF6FF] rounded-lg flex items-center justify-center group-hover:bg-[#DBEAFE] transition-colors">
            <FileText className="w-5 h-5 text-[#2563EB]" />
          </div>
          <div>
            <p className="font-semibold text-sm">Generate Report</p>
            <p className="text-[#94A3B8] text-xs">For your manager</p>
          </div>
        </Link>
        <Link
          href="/advocacy-coach"
          className="flex items-center gap-3 bg-white text-[#0F172A] p-4 rounded-xl border border-[#E2E8F0] hover:border-[#2563EB] hover:shadow-sm transition-all group"
        >
          <div className="w-9 h-9 bg-[#EFF6FF] rounded-lg flex items-center justify-center group-hover:bg-[#DBEAFE] transition-colors">
            <MessageSquare className="w-5 h-5 text-[#2563EB]" />
          </div>
          <div>
            <p className="font-semibold text-sm">Coach</p>
            <p className="text-[#94A3B8] text-xs">Communicate better</p>
          </div>
        </Link>
        <Link
          href="/one-on-ones"
          className="flex items-center gap-3 bg-white text-[#0F172A] p-4 rounded-xl border border-[#E2E8F0] hover:border-[#2563EB] hover:shadow-sm transition-all group"
        >
          <div className="w-9 h-9 bg-[#EFF6FF] rounded-lg flex items-center justify-center group-hover:bg-[#DBEAFE] transition-colors">
            <Users className="w-5 h-5 text-[#2563EB]" />
          </div>
          <div>
            <p className="font-semibold text-sm">1:1 Tracker</p>
            <p className="text-[#94A3B8] text-xs">Track growth</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
