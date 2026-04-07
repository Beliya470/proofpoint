"use client";

import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

interface CustomScenarioContext {
  whoInvolved: string;
  commType: string;
  timing: string;
}

interface CustomScenarioCardProps {
  prefillText?: string;
  onStart: (text: string, context: CustomScenarioContext) => void;
}

const WHO_OPTIONS = [
  "Manager",
  "Team Lead",
  "Senior Engineer",
  "Client",
  "Skip-level",
  "Peer",
  "Cross-functional team",
  "Other",
];

const COMM_OPTIONS = [
  "Live meeting",
  "Slack/async message",
  "Email",
  "1:1 conversation",
  "Group presentation",
  "Performance review",
  "Other",
];

const TIMING_OPTIONS = ["Right now", "Today", "This week", "Next week", "No rush"];

export default function CustomScenarioCard({
  prefillText,
  onStart,
}: CustomScenarioCardProps) {
  const [text, setText] = useState(prefillText ?? "");
  const [whoInvolved, setWhoInvolved] = useState("");
  const [commType, setCommType] = useState("");
  const [timing, setTiming] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (prefillText) setText(prefillText);
  }, [prefillText]);

  const handleStart = async () => {
    if (!text.trim() || isLoading) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsLoading(false);
    onStart(text.trim(), { whoInvolved, commType, timing });
  };

  return (
    <div
      className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
      style={{ borderLeft: "4px solid #2563EB" }}
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-[#2563EB]" />
        </div>
        <div>
          <h3 className="text-base font-bold text-[#0F172A]">
            What are you facing right now?
          </h3>
          <p className="text-sm text-gray-400 mt-0.5">
            Describe any workplace situation and the AI coach will help you prepare.
          </p>
        </div>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Describe your situation. For example: 'My team lead wants me to present our testing results to the US engineering director next week. I've never presented to someone this senior. What should I say and how should I prepare?'"
        className="w-full text-sm border border-gray-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent text-[#0F172A] placeholder:text-gray-300"
        rows={5}
        disabled={isLoading}
      />

      {/* Optional context dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
        <select
          value={whoInvolved}
          onChange={(e) => setWhoInvolved(e.target.value)}
          className="text-xs border border-gray-200 rounded-lg px-3 py-2 text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#2563EB] bg-gray-50 cursor-pointer"
          disabled={isLoading}
        >
          <option value="">Who&apos;s involved?</option>
          {WHO_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <select
          value={commType}
          onChange={(e) => setCommType(e.target.value)}
          className="text-xs border border-gray-200 rounded-lg px-3 py-2 text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#2563EB] bg-gray-50 cursor-pointer"
          disabled={isLoading}
        >
          <option value="">Communication type?</option>
          {COMM_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <select
          value={timing}
          onChange={(e) => setTiming(e.target.value)}
          className="text-xs border border-gray-200 rounded-lg px-3 py-2 text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#2563EB] bg-gray-50 cursor-pointer"
          disabled={isLoading}
        >
          <option value="">How soon?</option>
          {TIMING_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleStart}
        disabled={!text.trim() || isLoading}
        className="mt-3 w-full py-2.5 rounded-xl bg-[#2563EB] text-white text-sm font-semibold hover:bg-[#1D4ED8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Preparing your coaching session...
          </>
        ) : (
          "Get Coaching"
        )}
      </button>
    </div>
  );
}
