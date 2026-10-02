"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { closeSidebar } from "@/store/slices/uiSlice";
import { cn } from "@/lib/utils";
import {
  HiOutlineHome,
  HiOutlineCheckBadge,
  HiOutlineClipboardDocumentList,
  HiOutlineTrophy,
  HiOutlineUserCircle,
} from "react-icons/hi2";

const nav = [
  { href: "/employee/dashboard", label: "Home", icon: HiOutlineHome },
  { href: "/employee/votes", label: "My Votes", icon: HiOutlineClipboardDocumentList },
  { href: "/employee/winners", label: "Past Winners", icon: HiOutlineTrophy },
  { href: "/employee/profile", label: "Profile", icon: HiOutlineUserCircle },
];

export default function EmployeeSidebar() {
  const pathname = usePathname();
  const sidebarOpen = useSelector((s) => s.ui.sidebarOpen);
  const dispatch = useDispatch();

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-900 text-sm font-bold text-bronze-300">
          V
        </div>
        <span className="text-[15px] font-semibold tracking-tight text-ink-900">
          VoteDesk
        </span>
      </div>

      <nav className="flex-1 space-y-0.5 px-3">
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => dispatch(closeSidebar())}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150",
                active
                  ? "bg-ink-900 text-white"
                  : "text-ink-600 hover:bg-surface-100 hover:text-ink-900"
              )}
            >
              <Icon className="h-[18px] w-[18px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-5">
        <div className="rounded-xl bg-surface-100 p-3.5 flex items-center gap-2">
          <HiOutlineCheckBadge className="h-5 w-5 text-bronze-500 shrink-0" />
          <p className="text-xs text-ink-600">
            Your vote is always private within the team view.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-line-100 lg:bg-white">
        {content}
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-ink-950/40"
            onClick={() => dispatch(closeSidebar())}
          />
          <aside className="absolute left-0 top-0 h-full w-64 bg-white shadow-pop animate-fade-in">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
