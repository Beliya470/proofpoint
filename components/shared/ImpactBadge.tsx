import { cn } from "@/lib/utils";
import { IMPACT_CATEGORY_BG } from "@/lib/constants";
import type { ImpactCategory } from "@/lib/types";

interface ImpactBadgeProps {
  category: ImpactCategory | string;
  size?: "sm" | "md";
  className?: string;
}

export default function ImpactBadge({
  category,
  size = "md",
  className,
}: ImpactBadgeProps) {
  const bg = IMPACT_CATEGORY_BG[category] ?? "#475569";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium text-white",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs",
        className
      )}
      style={{ backgroundColor: bg }}
    >
      {category}
    </span>
  );
}
