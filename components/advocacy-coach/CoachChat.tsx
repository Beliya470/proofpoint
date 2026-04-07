"use client";

import { useState, useRef, useEffect } from "react";
import { Send, ArrowLeft, Bot } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import type { CoachMessage, CoachScenario } from "@/lib/types";
import { getCoachResponse } from "@/lib/ai-service";
import { getMockScenarioOpener, getMockCustomScenarioOpener } from "@/lib/mock-data";
import { generateId } from "@/lib/utils";

interface CoachChatProps {
  scenario?: CoachScenario;
  customText?: string;
  onBack: () => void;
}

function MessageBubble({ message }: { message: CoachMessage }) {
  const isCoach = message.role === "coach";
  return (
    <div className={`flex ${isCoach ? "justify-start" : "justify-end"} gap-2`}>
      {isCoach && (
        <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center shrink-0 mt-auto">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
          isCoach
            ? "bg-white border border-gray-100 text-[#0F172A] rounded-bl-sm shadow-sm"
            : "bg-[#2563EB] text-white rounded-br-sm"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}

function getInitialMessage(scenario?: CoachScenario, customText?: string): string {
  if (customText) return getMockCustomScenarioOpener(customText);
  if (scenario) return getMockScenarioOpener(scenario);
  return "How can I help you today?";
}

export default function CoachChat({ scenario, customText, onBack }: CoachChatProps) {
  const [messages, setMessages] = useState<CoachMessage[]>([
    {
      id: generateId(),
      role: "coach",
      content: getInitialMessage(scenario, customText),
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: CoachMessage = {
      id: generateId(),
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));
      const scenarioId = scenario?.id ?? "custom";
      const response = await getCoachResponse(text, scenarioId, history);
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          role: "coach",
          content: response,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isCustom = !!customText;
  const title = isCustom ? "Your Situation" : (scenario?.title ?? "Coaching Session");
  const difficulty = scenario?.difficulty;

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-h-[700px] bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Chat header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-gray-50 shrink-0">
        <button
          onClick={onBack}
          className="p-1 rounded-lg hover:bg-gray-200 transition-colors text-gray-400"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#0F172A]">Advocacy Coach</p>
          <p className="text-xs text-gray-400 truncate">{title}</p>
        </div>
        {difficulty && (
          <span
            className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
              difficulty === "Beginner"
                ? "bg-green-100 text-green-700"
                : difficulty === "Intermediate"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {difficulty}
          </span>
        )}
        {isCustom && (
          <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium shrink-0 bg-[#EFF6FF] text-[#2563EB]">
            Custom
          </span>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F1F5F9]">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {loading && (
          <div className="flex justify-start gap-2">
            <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1 items-center">
                <div className="w-2 h-2 rounded-full bg-[#2563EB] animate-bounce [animation-delay:0ms]" />
                <div className="w-2 h-2 rounded-full bg-[#2563EB] animate-bounce [animation-delay:150ms]" />
                <div className="w-2 h-2 rounded-full bg-[#2563EB] animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-gray-100 bg-white shrink-0">
        <div className="flex gap-2 items-end">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your response... (Enter to send, Shift+Enter for new line)"
            className="flex-1 min-h-[44px] max-h-[120px] resize-none text-sm border-gray-200 focus:border-[#2563EB] rounded-xl"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="w-10 h-10 flex items-center justify-center bg-[#2563EB] text-white rounded-xl hover:bg-[#2563EB] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-300 mt-1.5 text-center">
          Be honest and respond naturally — the coach gives better feedback when you&apos;re authentic
        </p>
      </div>
    </div>
  );
}
