import { HiOutlineMegaphone, HiOutlineHandRaised, HiOutlineChartBar, HiOutlineLockClosed } from "react-icons/hi2";

const logos = ["Northwind", "Umbra Labs", "Fernway", "Cobalt & Co", "Haldor"];

const features = [
  {
    icon: HiOutlineMegaphone,
    title: "Create Campaigns",
    desc: "Set up an Employee of the Month cycle in minutes — name it, pick candidates, choose dates.",
  },
  {
    icon: HiOutlineHandRaised,
    title: "Simple Employee Voting",
    desc: "One clear choice per employee, per campaign. No confusing ballots, no spreadsheets.",
  },
  {
    icon: HiOutlineChartBar,
    title: "Real-Time Results",
    desc: "Watch votes come in and see a live leaderboard as the campaign progresses.",
  },
  {
    icon: HiOutlineLockClosed,
    title: "Secure & Private",
    desc: "Choose public or anonymous voting, and control exactly who sees the results.",
  },
];

export function SocialProof() {
  return (
    <section className="border-y border-line-100 bg-surface-100/60 py-10">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="text-center text-xs font-medium uppercase tracking-wide text-ink-500">
          Trusted by modern teams to celebrate great work
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 opacity-70">
          {logos.map((name) => (
            <span key={name} className="text-sm font-semibold tracking-tight text-ink-600">
              {name}
            </span>
          ))}
        </div>
        <p className="mt-4 text-center text-[11px] text-ink-500">Demo companies shown for illustration</p>
      </div>
    </section>
  );
}

export default function Features() {
  return (
    <section id="features" className="px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-lg">
          <h2 className="text-3xl font-semibold tracking-tight text-ink-950">
            Everything you need, nothing you don&apos;t.
          </h2>
          <p className="mt-3 text-ink-600">
            VoteDesk is built around one workflow, done exceptionally well.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-line-100 bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-900 text-bronze-300">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-[15px] font-semibold text-ink-900">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
