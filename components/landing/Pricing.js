import Link from "next/link";
import Button from "@/components/ui/Button";
import { HiCheck } from "react-icons/hi2";

const plans = [
  {
    name: "Free Trial",
    price: "$0",
    period: "/month",
    features: ["Up to 25 employees", "1 active campaign", "Basic voting", "Results dashboard"],
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/month",
    features: [
      "Up to 100 employees",
      "Unlimited campaigns",
      "Anonymous voting",
      "Advanced campaign controls",
    ],
    cta: "Create Your Organization",
    highlighted: true,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-ink-950">
            Simple pricing, built to grow with you.
          </h2>
          <p className="mt-3 text-ink-600">Start free. Upgrade when your team does.</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-7 ${
                plan.highlighted
                  ? "border-ink-900 bg-ink-900 text-white shadow-pop"
                  : "border-line-100 bg-white"
              }`}
            >
              <p className={`text-sm font-medium ${plan.highlighted ? "text-bronze-300" : "text-ink-500"}`}>
                {plan.name}
              </p>
              <p className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-semibold tracking-tight">{plan.price}</span>
                <span className={plan.highlighted ? "text-white/60" : "text-ink-500"}>
                  {plan.period}
                </span>
              </p>
              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <HiCheck
                      className={`h-4 w-4 shrink-0 ${plan.highlighted ? "text-bronze-300" : "text-bronze-500"}`}
                    />
                    <span className={plan.highlighted ? "text-white/90" : "text-ink-700"}>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                as={Link}
                href="/signup"
                variant={plan.highlighted ? "accent" : "secondary"}
                className="mt-7 w-full"
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
