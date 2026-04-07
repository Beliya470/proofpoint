"use client";

import {
  Users,
  Mail,
  Lightbulb,
  Clock,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  ShieldAlert,
  MessageSquare,
  Rocket,
} from "lucide-react";
import type { CoachScenario } from "@/lib/types";

const ICON_MAP: Record<string, React.ElementType> = {
  Users,
  Mail,
  Lightbulb,
  Clock,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  ShieldAlert,
  MessageSquare,
  Rocket,
};

const DIFFICULTY_STYLES = {
  Beginner: "bg-[#10B981] text-white",
  Intermediate: "bg-[#F59E0B] text-white",
  Advanced: "bg-[#EF4444] text-white",
};

interface ScenarioSelectorProps {
  scenarios: CoachScenario[];
  onSelect: (scenario: CoachScenario) => void;
}

export default function ScenarioSelector({
  scenarios,
  onSelect,
}: ScenarioSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {scenarios.map((scenario) => {
        const Icon = ICON_MAP[scenario.icon] ?? HelpCircle;
        return (
          <button
            key={scenario.id}
            onClick={() => onSelect(scenario)}
            className="flex items-start gap-3 p-4 bg-white rounded-xl border border-[#E2E8F0] hover:border-[#2563EB] hover:shadow-sm hover:bg-[#EFF6FF] text-left transition-all group"
          >
            <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] flex items-center justify-center shrink-0 group-hover:bg-[#DBEAFE] transition-colors mt-0.5">
              <Icon className="w-5 h-5 text-[#2563EB]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-sm font-semibold text-[#0F172A] leading-tight">
                  {scenario.title}
                </p>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${DIFFICULTY_STYLES[scenario.difficulty]}`}
                >
                  {scenario.difficulty}
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] line-clamp-2 leading-relaxed">
                {scenario.description}
              </p>
              <p className="text-xs text-[#2563EB] font-medium mt-1.5">
                {scenario.category}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
