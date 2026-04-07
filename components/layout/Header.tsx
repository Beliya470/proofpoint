"use client";

import { usePathname } from "next/navigation";
import MobileNav from "./MobileNav";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": {
    title: "Dashboard",
    subtitle: "Your impact at a glance",
  },
  "/log": {
    title: "Log a Task",
    subtitle: "Reveal the business impact of your work",
  },
  "/context-bridge": {
    title: "Context Bridge",
    subtitle: "Generate reports your manager will actually read",
  },
  "/advocacy-coach": {
    title: "Advocacy Coach",
    subtitle: "Practice communicating your impact",
  },
  "/one-on-ones": {
    title: "1:1 Tracker",
    subtitle: "Turn conversations into career growth evidence",
  },
  "/one-on-ones/new": {
    title: "Log a 1:1",
    subtitle: "Capture what was discussed and what you're working toward",
  },
  "/history": {
    title: "History",
    subtitle: "Every task you've logged and its impact",
  },
};

export default function Header() {
  const pathname = usePathname();
  const page = pageTitles[pathname] ?? {
    title: "ProofPoint",
    subtitle: "Your work matters more than you think",
  };

  return (
    <header className="sticky top-0 z-30 bg-[#1B2237] border-b border-[#243049] px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <MobileNav />
        <div>
          <h1 className="text-white font-bold text-lg leading-tight">
            {page.title}
          </h1>
          <p className="text-[#A8B4C8] text-xs hidden sm:block">{page.subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-[#A8B4C8] hidden sm:block">EAT (UTC+3)</span>
        <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-xs font-bold">
          AA
        </div>
      </div>
    </header>
  );
}
