"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import ReportGenerator from "@/components/context-bridge/ReportGenerator";
import ReportPreview from "@/components/context-bridge/ReportPreview";
import LoadingState from "@/components/shared/LoadingState";
import EmptyState from "@/components/shared/EmptyState";
import Link from "next/link";
import { generateContextReport } from "@/lib/ai-service";
import { useApp } from "@/context/AppContext";
import type { ContextReport, LoggedTaskEntry } from "@/lib/types";

type PageState = "configure" | "loading" | "result";

export default function ContextBridgePage() {
  const { tasks } = useApp();
  const [pageState, setPageState] = useState<PageState>("configure");
  const [report, setReport] = useState<ContextReport | null>(null);
  const [lastParams, setLastParams] = useState<{
    tasks: LoggedTaskEntry[];
    period: string;
  } | null>(null);

  const handleGenerate = async (
    selectedTasks: LoggedTaskEntry[],
    period: string
  ) => {
    setLastParams({ tasks: selectedTasks, period });
    setPageState("loading");
    try {
      const result = await generateContextReport(selectedTasks, period);
      setReport(result);
      setPageState("result");
    } catch {
      setPageState("configure");
    }
  };

  const handleRegenerate = async () => {
    if (!lastParams) return;
    setPageState("loading");
    try {
      const result = await generateContextReport(
        lastParams.tasks,
        lastParams.period
      );
      setReport(result);
      setPageState("result");
    } catch {
      setPageState("configure");
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <EmptyState
          title="No tasks logged yet"
          description="Log some tasks first, then come back to generate a report for your manager."
          actionLabel="Log Your First Task"
          actionHref="/log"
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] flex items-center justify-center shrink-0">
          <FileText className="w-6 h-6 text-[#2563EB]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#0F172A]">
            Generate a Professional Impact Report
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Select your tasks and ProofPoint will generate a report your
            international manager will understand and value.
          </p>
        </div>
      </div>

      {/* Configure phase */}
      {pageState === "configure" && (
        <ReportGenerator onGenerate={handleGenerate} loading={false} />
      )}

      {/* Loading phase */}
      {pageState === "loading" && (
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
          <LoadingState message="Translating your impact for your manager..." />
        </div>
      )}

      {/* Result phase */}
      {pageState === "result" && report && (
        <>
          <ReportPreview report={report} onRegenerate={handleRegenerate} />
          <div className="text-center">
            <Link
              href={`/advocacy-coach?scenario=${encodeURIComponent(
                `I've generated an impact report showing ${report.period} of work with ${report.totalEstimatedValue} in total estimated value. I need to present these highlights to my international manager. How do I walk through this in a way that lands — without sounding like I'm just listing tasks or inflating numbers?`
              )}`}
              className="text-sm text-[#2563EB] hover:underline"
            >
              Practice presenting this report → Advocacy Coach
            </Link>
          </div>
          <button
            onClick={() => setPageState("configure")}
            className="w-full text-center text-sm text-gray-400 hover:text-[#2563EB] transition-colors py-2"
          >
            ← Configure a new report
          </button>
        </>
      )}
    </div>
  );
}
