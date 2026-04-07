"use client";

import { useState } from "react";
import { Plus, X, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import type {
  OneOnOneMeeting,
  FeedbackItem,
  Goal,
  ActionItem,
  GoalCategory,
} from "@/lib/types";

const GOAL_CATEGORIES: GoalCategory[] = [
  "Technical Skill", "Soft Skill", "Certification", "Project Milestone",
  "Career Development", "Process Improvement", "Client Relationship", "Leadership",
];

const MOOD_OPTIONS: OneOnOneMeeting["mood"][] = ["Positive", "Neutral", "Challenging", "Mixed"];
const MOOD_EMOJIS: Record<string, string> = {
  Positive: "😊", Neutral: "😐", Challenging: "😤", Mixed: "🤔",
};
const MOOD_COLORS: Record<string, string> = {
  Positive: "#27AE60", Neutral: "#2563EB", Challenging: "#E67E22", Mixed: "#8E44AD",
};

interface MeetingFormData {
  teamLead: string;
  teamLeadRole: string;
  date: string;
  duration: number;
  meetingType: OneOnOneMeeting["meetingType"];
  mood: OneOnOneMeeting["mood"];
  topicsDiscussed: string[];
  notes: string;
  wins: string[];
  feedbackReceived: Omit<FeedbackItem, "id" | "meetingId">[];
  goalsSet: Omit<Goal, "id" | "meetingId" | "progressNotes" | "linkedTaskIds" | "completedDate">[];
  actionItems: Omit<ActionItem, "id" | "meetingId" | "completedDate">[];
  questionsRaised: string[];
}

interface MeetingFormProps {
  onSubmit: (data: MeetingFormData) => void;
  loading: boolean;
}

const STEPS = [
  "Meeting Basics",
  "What Was Discussed",
  "Wins & Feedback",
  "Goals & Actions",
];

export default function MeetingForm({ onSubmit, loading }: MeetingFormProps) {
  const [step, setStep] = useState(0);
  const [topicInput, setTopicInput] = useState("");
  const [questionInput, setQuestionInput] = useState("");
  const [winInput, setWinInput] = useState("");

  const [form, setForm] = useState<MeetingFormData>({
    teamLead: "Stefan",
    teamLeadRole: "Engineering Team Lead",
    date: new Date().toISOString().split("T")[0],
    duration: 30,
    meetingType: "Scheduled",
    mood: "Positive",
    topicsDiscussed: [],
    notes: "",
    wins: [],
    feedbackReceived: [],
    goalsSet: [],
    actionItems: [],
    questionsRaised: [],
  });

  const set = <K extends keyof MeetingFormData>(k: K, v: MeetingFormData[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  // Topics
  const addTopic = () => {
    if (!topicInput.trim()) return;
    set("topicsDiscussed", [...form.topicsDiscussed, topicInput.trim()]);
    setTopicInput("");
  };
  const removeTopic = (i: number) =>
    set("topicsDiscussed", form.topicsDiscussed.filter((_, idx) => idx !== i));

  // Wins
  const addWin = () => {
    if (!winInput.trim()) return;
    set("wins", [...form.wins, winInput.trim()]);
    setWinInput("");
  };
  const removeWin = (i: number) => set("wins", form.wins.filter((_, idx) => idx !== i));

  // Questions
  const addQuestion = () => {
    if (!questionInput.trim()) return;
    set("questionsRaised", [...form.questionsRaised, questionInput.trim()]);
    setQuestionInput("");
  };
  const removeQuestion = (i: number) =>
    set("questionsRaised", form.questionsRaised.filter((_, idx) => idx !== i));

  // Feedback
  const addFeedback = () =>
    set("feedbackReceived", [
      ...form.feedbackReceived,
      { type: "Praise", content: "", area: "", actionable: false, followUpNeeded: false },
    ]);
  const updateFeedback = (i: number, field: string, value: unknown) =>
    set("feedbackReceived", form.feedbackReceived.map((f, idx) =>
      idx === i ? { ...f, [field]: value } : f
    ));
  const removeFeedback = (i: number) =>
    set("feedbackReceived", form.feedbackReceived.filter((_, idx) => idx !== i));

  // Goals
  const addGoal = () =>
    set("goalsSet", [
      ...form.goalsSet,
      {
        title: "",
        description: "",
        category: "Technical Skill" as GoalCategory,
        priority: "Medium" as const,
        status: "Not Started" as const,
        targetDate: "",
        setBy: "Both" as const,
      },
    ]);
  const updateGoal = (i: number, field: string, value: unknown) =>
    set("goalsSet", form.goalsSet.map((g, idx) =>
      idx === i ? { ...g, [field]: value } : g
    ));
  const removeGoal = (i: number) =>
    set("goalsSet", form.goalsSet.filter((_, idx) => idx !== i));

  // Actions
  const addAction = () =>
    set("actionItems", [
      ...form.actionItems,
      { description: "", owner: "Self" as const, dueDate: "", status: "Pending" as const },
    ]);
  const updateAction = (i: number, field: string, value: unknown) =>
    set("actionItems", form.actionItems.map((a, idx) =>
      idx === i ? { ...a, [field]: value } : a
    ));
  const removeAction = (i: number) =>
    set("actionItems", form.actionItems.filter((_, idx) => idx !== i));

  const handleSubmit = () => onSubmit(form);

  const inputCls =
    "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB] bg-white";
  const labelCls = "text-xs font-medium text-gray-500 block mb-1";

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-colors ${
                i === step
                  ? "bg-[#2563EB] text-white"
                  : i < step
                  ? "bg-[#10B981] text-white"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {i < step ? "✓" : i + 1}
            </div>
            <span
              className={`text-xs hidden sm:block ${
                i === step ? "font-semibold text-[#2563EB]" : "text-gray-400"
              }`}
            >
              {s}
            </span>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px w-4 ${i < step ? "bg-[#10B981]" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Basics */}
      {step === 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Team Lead Name</label>
              <input
                className={inputCls}
                value={form.teamLead}
                onChange={(e) => set("teamLead", e.target.value)}
                placeholder="Stefan"
              />
            </div>
            <div>
              <label className={labelCls}>Their Role</label>
              <input
                className={inputCls}
                value={form.teamLeadRole}
                onChange={(e) => set("teamLeadRole", e.target.value)}
                placeholder="Engineering Team Lead"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Date</label>
              <input
                type="date"
                className={inputCls}
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>Duration</label>
              <select
                className={inputCls}
                value={form.duration}
                onChange={(e) => set("duration", Number(e.target.value))}
              >
                {[15, 30, 45, 60, 90].map((d) => (
                  <option key={d} value={d}>
                    {d < 60 ? `${d} min` : `${d / 60} hour`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Meeting Type</label>
              <select
                className={inputCls}
                value={form.meetingType}
                onChange={(e) => set("meetingType", e.target.value as OneOnOneMeeting["meetingType"])}
              >
                {["Scheduled", "Ad-hoc", "Performance Review", "Career Chat"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>How did it go?</label>
            <div className="flex gap-3">
              {MOOD_OPTIONS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => set("mood", m)}
                  className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border-2 transition-all text-xs font-medium ${
                    form.mood === m
                      ? "border-current bg-opacity-10"
                      : "border-gray-100 hover:border-gray-200"
                  }`}
                  style={form.mood === m ? { borderColor: MOOD_COLORS[m], color: MOOD_COLORS[m], backgroundColor: MOOD_COLORS[m] + "15" } : {}}
                >
                  <span className="text-xl">{MOOD_EMOJIS[m]}</span>
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Discussion */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Topics Discussed</label>
            <div className="flex gap-2 mb-2">
              <input
                className={inputCls}
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTopic())}
                placeholder="Type a topic and press Enter..."
              />
              <button
                type="button"
                onClick={addTopic}
                className="px-3 py-2 bg-[#EFF6FF] text-[#2563EB] rounded-lg text-sm font-medium hover:bg-[#DBEAFE] transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {form.topicsDiscussed.map((t, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB]"
                >
                  {t}
                  <button onClick={() => removeTopic(i)} className="hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className={labelCls}>Meeting Notes</label>
            <Textarea
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Write freely about what was discussed. Don't worry about structure — ProofPoint will help organize this."
              className="min-h-[160px] resize-none text-sm border-gray-200 focus:border-[#2563EB] rounded-xl"
            />
          </div>

          <div>
            <label className={labelCls}>Questions for next time</label>
            <div className="flex gap-2 mb-2">
              <input
                className={inputCls}
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addQuestion())}
                placeholder="Anything you wanted to ask but didn't get to..."
              />
              <button
                type="button"
                onClick={addQuestion}
                className="px-3 py-2 bg-[#EFF6FF] text-[#2563EB] rounded-lg text-sm font-medium hover:bg-[#DBEAFE] transition-colors"
              >
                Add
              </button>
            </div>
            <div className="space-y-1">
              {form.questionsRaised.map((q, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                  <span className="flex-1">{q}</span>
                  <button onClick={() => removeQuestion(i)} className="text-gray-300 hover:text-red-400">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Wins & Feedback */}
      {step === 2 && (
        <div className="space-y-5">
          <div>
            <label className={labelCls}>Wins Acknowledged</label>
            <div className="flex gap-2 mb-2">
              <input
                className={inputCls}
                value={winInput}
                onChange={(e) => setWinInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addWin())}
                placeholder="Any achievements your team lead recognized..."
              />
              <button
                type="button"
                onClick={addWin}
                className="px-3 py-2 bg-[#DCFCE7] text-[#10B981] rounded-lg text-sm font-medium hover:opacity-80 transition-opacity"
              >
                Add
              </button>
            </div>
            <div className="space-y-1">
              {form.wins.map((w, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-600 bg-[#F0FDF4] rounded-lg px-3 py-2 border border-green-100">
                  <span className="text-green-500">✓</span>
                  <span className="flex-1">{w}</span>
                  <button onClick={() => removeWin(i)} className="text-gray-300 hover:text-red-400">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={labelCls + " mb-0"}>Feedback Received</label>
              <button
                type="button"
                onClick={addFeedback}
                className="flex items-center gap-1 text-xs text-[#2563EB] hover:text-[#2563EB] font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                Add feedback
              </button>
            </div>
            <div className="space-y-3">
              {form.feedbackReceived.map((fb, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-3 border border-gray-100 space-y-2">
                  <div className="flex items-center gap-2">
                    <select
                      className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#2563EB] bg-white"
                      value={fb.type}
                      onChange={(e) => updateFeedback(i, "type", e.target.value)}
                    >
                      {["Praise", "Constructive", "Observation", "Suggestion"].map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                    <input
                      className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#2563EB]"
                      placeholder="Area (e.g. Written Communication)"
                      value={fb.area}
                      onChange={(e) => updateFeedback(i, "area", e.target.value)}
                    />
                    <button onClick={() => removeFeedback(i)} className="text-gray-300 hover:text-red-400">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    className={inputCls}
                    placeholder="What was said..."
                    value={fb.content}
                    onChange={(e) => updateFeedback(i, "content", e.target.value)}
                  />
                  <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={fb.actionable}
                      onChange={(e) => updateFeedback(i, "actionable", e.target.checked)}
                      className="rounded"
                    />
                    Actionable (requires a response or change)
                  </label>
                </div>
              ))}
              {form.feedbackReceived.length === 0 && (
                <p className="text-xs text-gray-300 text-center py-3">
                  No feedback added yet. Click &quot;Add feedback&quot; to record something.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Goals & Actions */}
      {step === 3 && (
        <div className="space-y-5">
          {/* Goals */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={labelCls + " mb-0"}>New Goals Set</label>
              <button
                type="button"
                onClick={addGoal}
                className="flex items-center gap-1 text-xs text-[#2563EB] hover:text-[#2563EB] font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                Add goal
              </button>
            </div>
            <div className="space-y-3">
              {form.goalsSet.map((g, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-3 border border-gray-100 space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-[#2563EB]"
                      placeholder="Goal title..."
                      value={g.title}
                      onChange={(e) => updateGoal(i, "title", e.target.value)}
                    />
                    <button onClick={() => removeGoal(i)} className="text-gray-300 hover:text-red-400">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#2563EB] bg-white"
                      value={g.category}
                      onChange={(e) => updateGoal(i, "category", e.target.value)}
                    >
                      {GOAL_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                    <div className="flex gap-2">
                      <select
                        className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#2563EB] bg-white"
                        value={g.priority}
                        onChange={(e) => updateGoal(i, "priority", e.target.value)}
                      >
                        {["High", "Medium", "Low"].map((p) => <option key={p}>{p}</option>)}
                      </select>
                      <select
                        className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#2563EB] bg-white"
                        value={g.setBy}
                        onChange={(e) => updateGoal(i, "setBy", e.target.value)}
                      >
                        {["Self", "Team Lead", "Both"].map((b) => <option key={b}>{b}</option>)}
                      </select>
                    </div>
                  </div>
                  <input
                    type="date"
                    className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#2563EB] w-full"
                    value={g.targetDate}
                    onChange={(e) => updateGoal(i, "targetDate", e.target.value)}
                    placeholder="Target date"
                  />
                </div>
              ))}
              {form.goalsSet.length === 0 && (
                <p className="text-xs text-gray-300 text-center py-3">
                  No goals yet. Click &quot;Add goal&quot; to record what was set.
                </p>
              )}
            </div>
          </div>

          {/* Action items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={labelCls + " mb-0"}>Action Items</label>
              <button
                type="button"
                onClick={addAction}
                className="flex items-center gap-1 text-xs text-[#2563EB] hover:text-[#2563EB] font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                Add action
              </button>
            </div>
            <div className="space-y-2">
              {form.actionItems.map((a, i) => (
                <div key={i} className="flex items-center gap-2">
                  <select
                    className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#2563EB] bg-white shrink-0"
                    value={a.owner}
                    onChange={(e) => updateAction(i, "owner", e.target.value)}
                  >
                    <option value="Self">Me</option>
                    <option value="Team Lead">Team Lead</option>
                  </select>
                  <input
                    className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-[#2563EB]"
                    placeholder="What needs to happen..."
                    value={a.description}
                    onChange={(e) => updateAction(i, "description", e.target.value)}
                  />
                  <input
                    type="date"
                    className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#2563EB] shrink-0"
                    value={a.dueDate}
                    onChange={(e) => updateAction(i, "dueDate", e.target.value)}
                  />
                  <button onClick={() => removeAction(i)} className="text-gray-300 hover:text-red-400 shrink-0">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {form.actionItems.length === 0 && (
                <p className="text-xs text-gray-300 text-center py-3">
                  No action items yet. Click &quot;Add action&quot; to track commitments.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#2563EB] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        ) : (
          <div />
        )}

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            className="flex items-center gap-2 bg-[#2563EB] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#1D4ED8] transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !form.teamLead.trim() || !form.notes.trim()}
            className="flex items-center gap-2 bg-[#2563EB] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Save & Analyze Meeting
          </button>
        )}
      </div>
    </div>
  );
}
