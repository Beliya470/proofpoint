"use client";

import { MOCK_DASHBOARD_STATS } from "@/lib/mock-data";

export default function SkillsRadar() {
  const skills = MOCK_DASHBOARD_STATS.topSkills;
  const max = skills[0]?.count ?? 1;

  return (
    <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-sm">
      <div className="mb-4">
        <h3 className="font-semibold text-[#0F172A] text-sm">
          Top Skills Demonstrated
        </h3>
        <p className="text-[#94A3B8] text-xs mt-0.5">Based on your logged tasks</p>
      </div>
      <div className="space-y-3">
        {skills.map((s) => (
          <div key={s.skill}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-[#475569] truncate pr-2">
                {s.skill}
              </span>
              <span className="text-xs text-[#94A3B8] shrink-0">
                {s.count}x
              </span>
            </div>
            <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#2563EB] rounded-full transition-all duration-500"
                style={{ width: `${(s.count / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
