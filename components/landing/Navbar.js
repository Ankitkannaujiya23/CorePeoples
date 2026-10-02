"use client";

import Link from "next/link";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { HiOutlineBars3, HiOutlineXMark } from "react-icons/hi2";

const links = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it Works" },
  { href: "#pricing", label: "Pricing" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line-100/70 bg-surface-50/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-900 text-sm font-bold text-bronze-300">
            V
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-ink-900">
            VoteDesk
          </span>
        </Link>

        <nav className="ml-6 hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-ink-600 transition-colors hover:text-ink-900"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <Button as={Link} href="/login" variant="ghost" size="sm">
            Login
          </Button>
          <Button as={Link} href="/signup" variant="accent" size="sm">
            Get Started
          </Button>
        </div>

        <button
          className="ml-auto rounded-lg p-2 text-ink-700 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <HiOutlineXMark className="h-5 w-5" /> : <HiOutlineBars3 className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line-100 bg-surface-50 px-5 py-4 md:hidden animate-fade-in">
          <div className="flex flex-col gap-3">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="text-sm font-medium text-ink-700" onClick={() => setOpen(false)}>
                {l.label}
              </a>
            ))}
            <div className="mt-2 flex gap-2">
              <Button as={Link} href="/login" variant="secondary" size="sm" className="flex-1">
                Login
              </Button>
              <Button as={Link} href="/signup" variant="accent" size="sm" className="flex-1">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
