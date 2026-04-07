"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  MessageSquare,
  History,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/log", label: "Log a Task", icon: PlusCircle },
  { href: "/context-bridge", label: "Context Bridge", icon: FileText },
  { href: "/advocacy-coach", label: "Advocacy Coach", icon: MessageSquare },
  { href: "/one-on-ones", label: "1:1 Tracker", icon: Users },
  { href: "/history", label: "History", icon: History },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-[232px] bg-[#1B2237] min-h-screen sticky top-0">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <Link href="/dashboard" className="flex items-center gap-2">
          <img src="/logo-mark.svg" alt="ProofPoint logo" className="w-8 h-8 shrink-0" />
          <span className="text-white font-bold text-lg tracking-tight">
            ProofPoint
          </span>
        </Link>
        <p className="text-[#A8B4C8] text-xs mt-1 ml-10">
          Your work matters
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                active
                  ? "bg-[#2563EB] text-white shadow-sm"
                  : "text-[#A8B4C8] hover:bg-[#243049] hover:text-white"
              )}
            >
              <Icon className="w-4.5 h-4.5 shrink-0" size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-sm font-bold shrink-0">
            AA
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-medium truncate">
              Anne Anziya
            </p>
            <p className="text-[#A8B4C8] text-xs truncate">
              Junior QA Engineer
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
