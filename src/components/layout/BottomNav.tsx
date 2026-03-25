"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/home", label: "Discover", icon: Home },
  { href: "/requests", label: "Requests", icon: FileText },
  { href: "/profile", label: "Profile", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass-strong border-t border-white/5"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="max-w-lg mx-auto flex items-center justify-around h-[62px]">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 px-6 py-2 relative group"
            >
              {/* Active indicator */}
              {active && (
                <span
                  className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-neon-cyan"
                  style={{ boxShadow: "0 0 8px #00f5ff" }}
                />
              )}

              <Icon
                size={22}
                className={cn(
                  "transition-all duration-200",
                  active
                    ? "text-neon-cyan drop-shadow-[0_0_8px_#00f5ff]"
                    : "text-white/40 group-hover:text-white/70"
                )}
                strokeWidth={active ? 2.5 : 2}
              />
              <span
                className={cn(
                  "text-[10px] font-mono tracking-wider uppercase transition-colors",
                  active ? "text-neon-cyan" : "text-white/30 group-hover:text-white/50"
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
