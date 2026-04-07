"use client";

import { useState } from "react";
import { Sparkles, Calendar } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface TaskInputProps {
  onSubmit: (description: string, date: string) => void;
  loading: boolean;
}

export default function TaskInput({ onSubmit, loading }: TaskInputProps) {
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim().length < 5) return;
    onSubmit(description.trim(), date);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe what you worked on today. Be specific — mention the client, the feature, the problem you solved, or the task you completed.

Example: 'Fixed authentication bug on ExxonMobil account that was preventing users from logging in during month-end processing'"
        className="min-h-[160px] text-sm resize-none border-[#E2E8F0] focus:border-[#2563EB] focus:ring-[#2563EB]/10 focus:ring-2 rounded-xl placeholder:text-[#94A3B8] bg-[#F8FAFC] transition-all"
        disabled={loading}
      />

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-[#94A3B8]">
          <Calendar className="w-4 h-4" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="text-sm border border-[#E2E8F0] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#2563EB] text-[#475569] bg-[#F8FAFC]"
            disabled={loading}
          />
        </div>
        <div className="flex-1" />
        <span className="text-xs text-[#94A3B8]">
          {description.length > 0 ? `${description.length} chars` : ""}
        </span>
      </div>

      <button
        type="submit"
        disabled={loading || description.trim().length < 5}
        className="w-full flex items-center justify-center gap-2.5 bg-[#2563EB] text-white font-semibold py-3.5 rounded-xl hover:bg-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-[0_2px_8px_rgba(37,99,235,0.4)] text-sm"
      >
        <Sparkles className="w-4 h-4" />
        Analyze My Impact
      </button>
    </form>
  );
}
