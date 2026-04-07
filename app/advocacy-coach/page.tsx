"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MessageSquare } from "lucide-react";
import ScenarioSelector from "@/components/advocacy-coach/ScenarioSelector";
import CoachChat from "@/components/advocacy-coach/CoachChat";
import CustomScenarioCard from "@/components/advocacy-coach/CustomScenarioCard";
import { COACH_SCENARIOS } from "@/lib/mock-data";
import type { CoachScenario } from "@/lib/types";

function AdvocacyCoachContent() {
  const searchParams = useSearchParams();
  const prefillText = searchParams.get("scenario") ?? "";

  const [selectedScenario, setSelectedScenario] = useState<CoachScenario | null>(null);
  const [customText, setCustomText] = useState<string | null>(null);

  const handleBack = () => {
    setSelectedScenario(null);
    setCustomText(null);
  };

  // Show chat when either a preset scenario or custom text is active
  if (selectedScenario || customText) {
    return (
      <div className="max-w-3xl mx-auto">
        <CoachChat
          scenario={selectedScenario ?? undefined}
          customText={customText ?? undefined}
          onBack={handleBack}
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] flex items-center justify-center shrink-0">
          <MessageSquare className="w-6 h-6 text-[#2563EB]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#0F172A]">
            Practice Communicating Your Impact
          </h2>
          <p className="text-[#94A3B8] text-sm mt-1">
            Describe your own situation or choose a common scenario. The AI coach
            gives specific, actionable feedback — not vague encouragement.
          </p>
        </div>
      </div>

      {/* Tip banner */}
      <div className="bg-[#1B2237] rounded-xl p-4 text-white">
        <p className="text-sm font-semibold mb-1">The Magic Four Framework</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
          {[
            { label: "Progress", desc: "What you accomplished" },
            { label: "Risk", desc: "What you prevented" },
            { label: "Blocker", desc: "What's in your way" },
            { label: "Ask", desc: "What you need" },
          ].map((item) => (
            <div key={item.label} className="bg-white/10 rounded-lg p-2.5">
              <p className="text-xs font-bold">{item.label}</p>
              <p className="text-[#A8B4C8] text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Custom scenario card — always first */}
      <CustomScenarioCard
        prefillText={prefillText}
        onStart={(text) => setCustomText(text)}
      />

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
          Or choose a common scenario
        </span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <ScenarioSelector
        scenarios={COACH_SCENARIOS}
        onSelect={setSelectedScenario}
      />
    </div>
  );
}

export default function AdvocacyCoachPage() {
  return (
    <Suspense fallback={null}>
      <AdvocacyCoachContent />
    </Suspense>
  );
}
