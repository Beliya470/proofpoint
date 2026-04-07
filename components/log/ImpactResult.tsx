"use client";

import { useState } from "react";
import {
  Copy,
  Check,
  PlusCircle,
  FileText,
  TrendingUp,
  Clock,
  Users,
  Shield,
  Target,
  Globe,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import type { ImpactAnalysis, ImpactMetrics } from "@/lib/types";
import ImpactBadge from "@/components/shared/ImpactBadge";

interface ImpactResultProps {
  analysis: ImpactAnalysis;
  taskDescription: string;
  onLogAnother: () => void;
}

const METRIC_CONFIG: {
  key: keyof ImpactMetrics;
  icon: React.ElementType;
  label: string;
  color: string;
}[] = [
  { key: "timeSaved", icon: Clock, label: "Time Saved", color: "#2563EB" },
  { key: "peopleUnblocked", icon: Users, label: "People Unblocked", color: "#7C3AED" },
  { key: "riskPrevented", icon: Shield, label: "Risk Prevented", color: "#EF4444" },
  { key: "scopeOfWork", icon: Target, label: "Scope of Work", color: "#F59E0B" },
  { key: "reliabilitySignal", icon: Globe, label: "Reliability", color: "#0891B2" },
  { key: "knowledgeCreated", icon: BookOpen, label: "Knowledge Created", color: "#10B981" },
];

export default function ImpactResult({
  analysis,
  taskDescription,
  onLogAnother,
}: ImpactResultProps) {
  const [copied, setCopied] = useState(false);

  const copyManagerSummary = async () => {
    await navigator.clipboard.writeText(analysis.managerSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const metrics = analysis.impactMetrics ?? {};
  const activeMetrics = METRIC_CONFIG.filter(
    (m) => metrics[m.key] != null && metrics[m.key] !== ""
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl border-2 border-[#2563EB]/30 shadow-lg overflow-hidden">
        {/* Top accent bar */}
        <div className="h-1 bg-[#2563EB]" />

        <div className="p-6 space-y-5">
          {/* Task logged */}
          <div className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
            <span className="font-medium text-gray-500">Task logged: </span>
            {taskDescription}
          </div>

          {/* Headline */}
          <h2 className="text-lg font-bold text-[#0F172A] leading-tight">
            {analysis.headline}
          </h2>

          {/* Category badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <ImpactBadge category={analysis.impactCategory} />
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-50 text-gray-400 border border-gray-100">
              {analysis.confidenceLevel} confidence
            </span>
          </div>

          {/* Impact Metrics */}
          {activeMetrics.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Impact Dimensions
              </div>
              <div className="space-y-2.5">
                {activeMetrics.map(({ key, icon: Icon, label, color }) => (
                  <div key={key} className="flex items-start gap-3">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: `${color}15` }}
                    >
                      <Icon className="w-3.5 h-3.5" style={{ color }} />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gray-500 block mb-0.5">
                        {label}
                      </span>
                      <span className="text-sm text-[#0F172A] leading-snug">
                        {metrics[key]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          <div>
            <div className="text-xs font-medium text-gray-500 mb-2">
              Skills Demonstrated
            </div>
            <div className="flex flex-wrap gap-1.5">
              {analysis.skillsDemonstrated.map((skill) => (
                <span
                  key={skill}
                  className="text-xs px-2.5 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Manager summary */}
          <div className="bg-[#F1F5F9] rounded-xl p-4 border border-[#BFDBFE]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2563EB]">
                <TrendingUp className="w-3.5 h-3.5" />
                Manager-Ready Summary
              </div>
              <button
                onClick={copyManagerSummary}
                className="flex items-center gap-1 text-xs text-[#2563EB] hover:text-[#2563EB] transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <p className="text-sm text-gray-700 italic">
              &ldquo;{analysis.managerSummary}&rdquo;
            </p>
          </div>

          {/* Estimated value footnote */}
          <p className="text-xs text-gray-400 text-center">
            Estimated financial impact: {analysis.estimatedValue}{" "}
            <span className="text-gray-300">— based on industry benchmarks</span>
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <button
          onClick={onLogAnother}
          className="flex-1 flex items-center justify-center gap-2 bg-[#2563EB] text-white font-medium py-3 rounded-xl hover:bg-[#1D4ED8] transition-colors text-sm"
        >
          <PlusCircle className="w-4 h-4" />
          Log Another Task
        </button>
        <Link
          href="/context-bridge"
          className="flex-1 flex items-center justify-center gap-2 bg-white text-[#2563EB] font-medium py-3 rounded-xl border-2 border-[#2563EB] hover:bg-[#EFF6FF] transition-colors text-sm"
        >
          <FileText className="w-4 h-4" />
          Generate Report
        </Link>
      </div>
    </div>
  );
}
