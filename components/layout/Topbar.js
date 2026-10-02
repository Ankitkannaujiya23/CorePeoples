"use client";

import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "@/store/slices/uiSlice";
import { logout } from "@/store/slices/authSlice";
import { showToast } from "@/store/slices/uiSlice";
import Avatar from "@/components/ui/Avatar";
import Dropdown from "@/components/ui/Dropdown";
import { HiOutlineBars3, HiOutlineMagnifyingGlass, HiOutlineBell } from "react-icons/hi2";

export default function Topbar({ title }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((s) => s.auth.user);
  const organization = useSelector((s) => s.organization.organization);

  function handleLogout() {
    dispatch(logout());
    dispatch(showToast({ message: "Signed out. See you next month.", type: "info" }));
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-line-100 bg-white/90 px-4 py-3.5 backdrop-blur sm:px-6">
      <button
        onClick={() => dispatch(toggleSidebar())}
        className="rounded-lg p-1.5 text-ink-600 hover:bg-surface-100 focus-ring lg:hidden"
        aria-label="Open menu"
      >
        <HiOutlineBars3 className="h-5 w-5" />
      </button>

      <div className="min-w-0">
        <p className="truncate text-[15px] font-semibold text-ink-900">{title}</p>
        <p className="truncate text-xs text-ink-500">{organization?.name}</p>
      </div>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-3">
        <div className="relative hidden md:block">
          <HiOutlineMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
          <input
            placeholder="Search"
            className="w-56 rounded-lg border border-line-200 bg-surface-50 py-2 pl-9 pr-3 text-sm text-ink-800 placeholder:text-ink-500 focus-ring focus:border-ink-700"
          />
        </div>

        <button
          className="relative rounded-lg p-2 text-ink-600 hover:bg-surface-100 focus-ring"
          aria-label="Notifications"
        >
          <HiOutlineBell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-bronze-500" />
        </button>

        <Dropdown
          trigger={<Avatar name={user?.name} color={user?.avatarColor} size="sm" />}
          items={[
            { label: user?.name || "Account", onClick: () => {} },
            { divider: true },
            { label: "Sign out", onClick: handleLogout, danger: true },
          ]}
        />
      </div>
    </header>
  );
}
