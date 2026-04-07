"use client";

import { Sparkles, Copy, Check } from "lucide-react";
import { useState } from "react";

interface PrepSheetProps {
  prepText: string;
  meetingDate?: string;
}

export default function PrepSheet({ prepText, meetingDate }: PrepSheetProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(prepText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fromDate = meetingDate
    ? new Date(meetingDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : null;

  return (
    <div className="bg-[#2563EB] rounded-xl p-5 text-white">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <h4 className="text-sm font-semibold">Prep for Your Next 1:1</h4>
        </div>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 text-xs bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-lg transition-colors"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      {fromDate && (
        <p className="text-blue-200/70 text-xs mb-3">
          Based on your {fromDate} meeting
        </p>
      )}
      <p className="text-sm text-blue-100 leading-relaxed whitespace-pre-line">
        {prepText}
      </p>
    </div>
  );
}
