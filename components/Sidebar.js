"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Clock,
  Mail,
  FileText,
  Upload,
  Download,
  Settings,
} from "lucide-react";

const navItems = [
  { section: "Main" },
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "All Leads", href: "/leads", icon: Users },
  { label: "Follow-Ups", href: "/followups", icon: Clock },
  { section: "Outreach" },
  { label: "Mailer Queue", href: "/mailers", icon: Mail },
  { label: "Templates", href: "/templates", icon: FileText },
  { section: "Data" },
  { label: "CSV Import", href: "/import", icon: Upload },
  { label: "Export", href: "/export", icon: Download },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-52 flex-shrink-0 bg-[#0f2d5a] flex flex-col min-h-screen">
      <div className="px-4 py-5 border-b border-white/10">
        <div className="text-white font-medium text-base tracking-tight">
          ProbateFlow
        </div>
        <div className="text-white/40 text-[10px] mt-0.5">
          Real Estate Lead CRM
        </div>
      </div>

      <nav className="flex-1 py-2">
        {navItems.map((item, i) => {
          if (item.section) {
            return (
              <div
                key={i}
                className="text-[10px] uppercase tracking-widest text-white/30 px-4 pt-4 pb-1"
              >
                {item.section}
              </div>
            );
          }
          const Icon = item.icon;
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-4 py-2 text-sm transition-all border-l-2 ${
                active
                  ? "text-white bg-white/10 border-blue-400"
                  : "text-white/60 border-transparent hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={14} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10">
        <Link
          href="/settings"
          className="flex items-center gap-2.5 px-4 py-3 text-sm text-white/50 hover:text-white transition-colors"
        >
          <Settings size={14} />
          Settings
        </Link>
      </div>
    </aside>
  );
}