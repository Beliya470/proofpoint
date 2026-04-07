"use client";

import { useState } from "react";
import { Lightbulb } from "lucide-react";
import TaskInput from "@/components/log/TaskInput";
import ImpactResult from "@/components/log/ImpactResult";
import LoadingState from "@/components/shared/LoadingState";
import { analyzeImpact } from "@/lib/ai-service";
import { useApp } from "@/context/AppContext";
import { generateId } from "@/lib/utils";
import type { ImpactAnalysis, Task } from "@/lib/types";

type PageState = "input" | "loading" | "result";

const EXAMPLE_TASKS = [
  "Fixed authentication bug on ExxonMobil account",
  "Completed regression testing on Azure connector update",
  "Resolved SAP error blocking end-of-month processing",
  "Wrote documentation for new developer onboarding",
  "Covered weekend shift for client migration support",
];

export default function LogPage() {
  const { addTask } = useApp();
  const [pageState, setPageState] = useState<PageState>("input");
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [analysis, setAnalysis] = useState<ImpactAnalysis | null>(null);

  const handleSubmit = async (description: string, date: string) => {
    const taskId = generateId();
    const task: Task = {
      id: taskId,
      description,
      date,
      timestamp: Date.now(),
    };

    setCurrentTask(task);
    setPageState("loading");

    try {
      const result = await analyzeImpact(description, taskId);
      setAnalysis(result);
      addTask({ task, analysis: result });
      setPageState("result");
    } catch {
      setPageState("input");
    }
  };

  const handleLogAnother = () => {
    setPageState("input");
    setCurrentTask(null);
    setAnalysis(null);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Page header */}
      <div>
        <h2 className="text-2xl font-bold text-[#0F172A]">
          What did you accomplish today?
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Describe your task and we&apos;ll reveal its real business impact.
        </p>
      </div>

      {/* Input phase */}
      {pageState === "input" && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <TaskInput onSubmit={handleSubmit} loading={false} />
          </div>

          {/* Example prompts */}
          <div className="bg-[#F1F5F9] rounded-xl p-4 border border-[#BFDBFE]">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#2563EB] mb-3">
              <Lightbulb className="w-3.5 h-3.5" />
              Try one of these examples
            </div>
            <div className="space-y-2">
              {EXAMPLE_TASKS.map((example) => (
                <button
                  key={example}
                  onClick={() => handleSubmit(example, new Date().toISOString().split("T")[0])}
                  className="w-full text-left text-xs text-gray-500 hover:text-[#2563EB] hover:bg-[#EFF6FF] px-3 py-2 rounded-lg transition-colors"
                >
                  → {example}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Loading phase */}
      {pageState === "loading" && (
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
          <LoadingState message="Analyzing your impact..." />
          <div className="text-center mt-4">
            <p className="text-xs text-gray-300">
              &ldquo;{currentTask?.description}&rdquo;
            </p>
          </div>
        </div>
      )}

      {/* Result phase */}
      {pageState === "result" && analysis && currentTask && (
        <ImpactResult
          analysis={analysis}
          taskDescription={currentTask.description}
          onLogAnother={handleLogAnother}
        />
      )}
    </div>
  );
}
