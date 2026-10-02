import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features, { SocialProof } from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/landing/Footer";
import Button from "@/components/ui/Button";
import { HiArrowRight } from "react-icons/hi2";

export default function LandingPage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <SocialProof />
      <Features />
      <HowItWorks />
      <Pricing />

      <section className="px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl bg-ink-900 px-8 py-14 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Ready to recognize your team?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-white/60">
            Set up your organization in minutes and launch your first
            campaign today.
          </p>
          <Button as={Link} href="/signup" variant="accent" size="lg" className="mt-7">
            Create Your Organization <HiArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
