const steps = [
  {
    n: "01",
    title: "Create a campaign",
    desc: "Name it, choose your candidates, and set a voting window that fits your month.",
  },
  {
    n: "02",
    title: "Let your team vote",
    desc: "Employees get one clear, simple ballot. Public or anonymous — your call.",
  },
  {
    n: "03",
    title: "Celebrate the winner",
    desc: "Results update live. Announce the winner with a leaderboard everyone can see.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-surface-100/60 px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-semibold tracking-tight text-ink-950">How it works</h2>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.n} className="relative">
              <p className="font-mono text-sm text-bronze-500">{s.n}</p>
              <h3 className="mt-3 text-lg font-semibold text-ink-900">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">{s.desc}</p>
              {i < steps.length - 1 && (
                <div className="mt-6 hidden h-px w-full bg-line-200 sm:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
