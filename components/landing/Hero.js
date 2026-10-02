import Link from "next/link";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import ProgressBar from "@/components/ui/ProgressBar";
import { HiArrowRight, HiOutlinePlayCircle } from "react-icons/hi2";

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-5 pb-20 pt-16 sm:px-8 sm:pt-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
          <div className="animate-fade-in">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line-200 bg-white px-3 py-1 text-xs font-medium text-ink-600">
              Now recognizing teams in 40+ countries
            </span>
            <h1 className="mt-5 text-[2.6rem] font-semibold leading-[1.08] tracking-tight text-ink-950 sm:text-6xl">
              Make Every
              <br />
              Contribution Count.
            </h1>
            <p className="mt-5 max-w-md text-[17px] leading-relaxed text-ink-600">
              A simple, private and engaging way for organizations to recognize
              their employees and celebrate the people who make a difference.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button as={Link} href="/signup" variant="accent" size="lg">
                Start Free <HiArrowRight className="h-4 w-4" />
              </Button>
              <Button as="a" href="#how-it-works" variant="secondary" size="lg">
                <HiOutlinePlayCircle className="h-4 w-4" /> See How It Works
              </Button>
            </div>
            <p className="mt-5 text-xs text-ink-500">
              No credit card required · Free up to 25 employees
            </p>
          </div>

          <div className="relative animate-fade-in [animation-delay:120ms]">
            <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-bronze-100/60 via-transparent to-transparent blur-2xl" />
            <div className="rounded-2xl border border-line-100 bg-white p-1.5 shadow-pop">
              <div className="rounded-xl border border-line-100 bg-surface-50 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-ink-500">Active Campaign</p>
                    <p className="text-sm font-semibold text-ink-900">
                      Employee of the Month — Aug 2026
                    </p>
                  </div>
                  <span className="rounded-full bg-success-50 px-2.5 py-1 text-[11px] font-medium text-success-600">
                    Active
                  </span>
                </div>

                <div className="mt-5 rounded-xl border border-line-100 bg-white p-4">
                  <p className="text-xs text-ink-500">Leaderboard</p>
                  <div className="mt-3 space-y-3">
                    {[
                      { name: "Rahul Sharma", color: "#B08D3F", value: 78 },
                      { name: "Priya Singh", color: "#8F7132", value: 58 },
                      { name: "Amit Kumar", color: "#2A2E38", value: 22 },
                    ].map((row) => (
                      <div key={row.name} className="flex items-center gap-3">
                        <Avatar name={row.name} color={row.color} size="sm" />
                        <div className="flex-1">
                          <div className="flex justify-between text-xs text-ink-700">
                            <span>{row.name}</span>
                          </div>
                          <div className="mt-1">
                            <ProgressBar value={row.value} tone="accent" size="sm" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  {[
                    { label: "Votes", value: "91" },
                    { label: "Candidates", value: "6" },
                    { label: "Turnout", value: "67%" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl border border-line-100 bg-white p-3 text-center">
                      <p className="font-mono text-lg font-semibold text-ink-900">{s.value}</p>
                      <p className="text-[11px] text-ink-500">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
