import { Star, MessageCircle, Eye, Lightbulb } from "lucide-react";
import type { FeedbackItem } from "@/lib/types";

const TYPE_CONFIG: Record<FeedbackItem["type"], { icon: React.ElementType; bg: string; text: string; border: string }> = {
  Praise: { icon: Star, bg: "#FFF9C4", text: "#B45309", border: "#FDE68A" },
  Constructive: { icon: MessageCircle, bg: "#FEF3C7", text: "#F59E0B", border: "#FDE68A" },
  Observation: { icon: Eye, bg: "#DBEAFE", text: "#2563EB", border: "#BFDBFE" },
  Suggestion: { icon: Lightbulb, bg: "#EDE9FE", text: "#7C3AED", border: "#DDD6FE" },
};

interface FeedbackLogProps {
  items: FeedbackItem[];
}

export default function FeedbackLog({ items }: FeedbackLogProps) {
  if (items.length === 0) {
    return <p className="text-xs text-gray-400 italic">No feedback recorded for this meeting.</p>;
  }

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const config = TYPE_CONFIG[item.type];
        const Icon = config.icon;

        return (
          <div
            key={item.id}
            className="rounded-xl border p-4"
            style={{ backgroundColor: config.bg, borderColor: config.border }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ backgroundColor: config.border }}
              >
                <Icon className="w-4 h-4" style={{ color: config.text }} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-xs font-semibold"
                    style={{ color: config.text }}
                  >
                    {item.type}
                  </span>
                  {item.area && (
                    <span className="text-xs text-gray-500 bg-white/60 px-2 py-0.5 rounded-full">
                      {item.area}
                    </span>
                  )}
                  {item.actionable && (
                    <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">
                      Actionable
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{item.content}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
