"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, ClipboardList, Repeat, History } from "lucide-react";

const tabs = [
  { href: "/home", label: "케어보드", Icon: Home },
  { href: "/family", label: "가족", Icon: Users },
  { href: "/cards", label: "케어카드", Icon: ClipboardList },
  { href: "/routines", label: "루틴", Icon: Repeat },
  { href: "/logs", label: "기록", Icon: History },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-ivory-deep"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <ul className="flex h-16 items-stretch">
        {tabs.map(({ href, label, Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={`flex h-full flex-col items-center justify-center gap-0.5 ${
                  active ? "text-forest" : "text-ink-muted"
                }`}
              >
                <Icon size={22} strokeWidth={active ? 2.4 : 2} />
                <span className="text-[13px] font-medium">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
