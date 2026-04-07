"use client";

import { useState } from "react";
import { Copy, Check, RefreshCw, Globe, Award, FileText } from "lucide-react";
import type { ContextReport } from "@/lib/types";

interface ReportPreviewProps {
  report: ContextReport;
  onRegenerate: () => void;
}

export default function ReportPreview({ report, onRegenerate }: ReportPreviewProps) {
  const [copiedFull, setCopiedFull] = useState(false);
  const [copiedHighlights, setCopiedHighlights] = useState(false);

  const fullReportText = `${report.professionalSummary}\n\nKEY HIGHLIGHTS:\n${report.keyHighlights.map((h) => `• ${h}`).join("\n")}\n\nTIMEZONE CONTEXT:\n${report.timezoneContext}\n\nGROWTH INDICATORS:\n${report.growthIndicators.map((g) => `• ${g}`).join("\n")}`;

  const highlightsText = report.keyHighlights.map((h) => `• ${h}`).join("\n");

  const copyFull = async () => {
    await navigator.clipboard.writeText(fullReportText);
    setCopiedFull(true);
    setTimeout(() => setCopiedFull(false), 2000);
  };

  const copyHighlights = async () => {
    await navigator.clipboard.writeText(highlightsText);
    setCopiedHighlights(true);
    setTimeout(() => setCopiedHighlights(false), 2000);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-[#0F172A]">Impact Report Generated</h3>
          <p className="text-xs text-gray-400 mt-0.5">{report.period}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={copyHighlights}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:border-[#2563EB] transition-colors text-gray-600"
          >
            {copiedHighlights ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copiedHighlights ? "Copied!" : "Copy Highlights"}
          </button>
          <button
            onClick={copyFull}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-[#1B2237] text-white rounded-lg hover:bg-[#1D4ED8] transition-colors"
          >
            {copiedFull ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copiedFull ? "Copied!" : "Copy Full Report"}
          </button>
          <button
            onClick={onRegenerate}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-gray-500"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Key highlights banner — observable metrics, not dollar amount */}
      <div className="bg-[#1B2237] rounded-xl p-4 text-white flex items-center justify-between">
        <div>
          <p className="text-blue-200/80 text-xs mb-1">What you demonstrated this period</p>
          <p className="text-sm font-semibold leading-snug">
            {report.keyHighlights[0] ?? "Multiple high-impact contributions logged"}
          </p>
        </div>
        <FileText className="w-9 h-9 text-white/20 shrink-0 ml-3" />
      </div>

      {/* Professional Summary */}
      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
        <h4 className="text-xs font-bold text-[#1B2237] uppercase tracking-wide mb-3">
          Professional Summary
        </h4>
        <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
          {report.professionalSummary}
        </div>
        {/* Estimated value footnote */}
        <p className="text-xs text-gray-400 mt-4 pt-3 border-t border-gray-100">
          Conservative estimated financial impact: {report.totalEstimatedValue} — based on industry benchmarks for senior engineer time, SLA impact, and support cost avoidance.
        </p>
      </div>

      {/* Key Highlights */}
      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
        <h4 className="text-xs font-bold text-[#1B2237] uppercase tracking-wide mb-3">
          Key Highlights
        </h4>
        <ul className="space-y-2">
          {report.keyHighlights.map((h, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
              <div className="w-5 h-5 rounded-full bg-[#EFF6FF] flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[#2563EB] text-xs font-bold">{i + 1}</span>
              </div>
              {h}
            </li>
          ))}
        </ul>
      </div>

      {/* Timezone Context */}
      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="w-4 h-4 text-[#2563EB]" />
          <h4 className="text-xs font-bold text-[#1B2237] uppercase tracking-wide">
            Timezone & Async Work
          </h4>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          {report.timezoneContext}
        </p>
      </div>

      {/* Growth Indicators */}
      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-4 h-4 text-[#2563EB]" />
          <h4 className="text-xs font-bold text-[#1B2237] uppercase tracking-wide">
            Growth Indicators
          </h4>
        </div>
        <div className="space-y-2">
          {report.growthIndicators.map((g, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB] shrink-0" />
              <p className="text-sm text-gray-600">{g}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
