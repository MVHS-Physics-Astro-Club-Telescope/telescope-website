import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import ComingSoonBanner from "@/components/ComingSoonBanner";
import EmailSignup from "@/components/EmailSignup";
import FAQ from "@/components/FAQ";
import MockLiveView from "@/components/MockLiveView";
import StarField from "@/components/StarField";
import TonightAtMVHS, {
  TonightAtMVHSSkeleton,
} from "@/components/TonightAtMVHS";

export const metadata: Metadata = {
  title: "Live View — MVHS Public Observatory",
  description:
    "Watch our student-built telescope point at the cosmos in real time. Live view activates when the telescope captures first light in August 2026.",
};

const features = [
  {
    title: "Real-time tracking",
    description:
      "See exactly where the telescope is pointing — RA, Dec, altitude, and azimuth, updated every second.",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="22" y1="12" x2="18" y2="12" />
        <line x1="6" y1="12" x2="2" y2="12" />
        <line x1="12" y1="6" x2="12" y2="2" />
        <line x1="12" y1="22" x2="12" y2="18" />
      </svg>
    ),
  },
  {
    title: "Live image stacking",
    description:
      "Watch faint galaxies and nebulae emerge frame-by-frame as exposures stack in your browser.",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
  },
  {
    title: "Sky conditions overlay",
    description:
      "Cloud cover, seeing, and the Bortle sky brightness for our Mountain View site — so you know what to expect.",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M17.5 19a4.5 4.5 0 1 0 0-9 7 7 0 0 0-13.5 2.5" />
        <path d="M3 16h.01" />
        <path d="M6 19h.01" />
        <path d="M9 22h.01" />
      </svg>
    ),
  },
];

const steps = [
  {
    n: "01",
    title: "Submit a target",
    description:
      "Pick from a curated list of galaxies, nebulae, planets, and clusters — or paste in coordinates.",
  },
  {
    n: "02",
    title: "Telescope queues it",
    description:
      "Our scheduler sorts requests by sky position, magnitude, and what's actually overhead tonight.",
  },
  {
    n: "03",
    title: "Captures overnight",
    description:
      "Long-exposure frames stack on top of each other while you sleep — no light pollution, no clouds, no fuss.",
  },
  {
    n: "04",
    title: "Image lands in your inbox",
    description:
      "A high-resolution PNG (and the raw FITS frames, if you want them) emailed to you the next morning.",
  },
];

const faqItems = [
  {
    question: "When will the live view actually go live?",
    answer: (
      <>
        We&apos;re targeting <strong>First Light in August 2026</strong>. That&apos;s
        when the optics are mounted, the tracking software is calibrated, and we
        get our first real photons through the telescope. Drop your email below
        and we&apos;ll tell you the night it happens.
      </>
    ),
  },
  {
    question: "What can the telescope observe?",
    answer:
      "It's a 10-inch f/4.48 truss-tube Dobsonian with a cooled astronomy camera. That's enough aperture for the Moon, all the planets out to Neptune, hundreds of nebulae and clusters, and most galaxies down to about magnitude 12 — including all the famous ones (Andromeda, Whirlpool, Sombrero, Orion, etc.).",
  },
  {
    question: "How do I request a target?",
    answer: (
      <>
        Head over to the{" "}
        <Link
          href="/request"
          className="underline underline-offset-4 decoration-white/30 hover:decoration-white/60"
        >
          /request page
        </Link>
        . You&apos;ll be able to pick a target, drop in your email, and we&apos;ll
        send the captured image once it&apos;s done. The form is in preview
        mode until the telescope goes online.
      </>
    ),
  },
  {
    question: "Is this free?",
    answer:
      "Yes. Always. The MVHS Physics & Astronomy Club is a free, student-run organization, and the public observatory is part of our mission to make astronomy accessible across the Bay Area. Sponsors pay for the hardware so visitors don't have to.",
  },
  {
    question: "Who built this?",
    answer: (
      <>
        Seven high schoolers at Mountain View High School. We&apos;re designing
        the optics, machining the mount, writing the control software, and
        running the outreach ourselves. See the{" "}
        <Link
          href="/#team"
          className="underline underline-offset-4 decoration-white/30 hover:decoration-white/60"
        >
          team page
        </Link>{" "}
        for who&apos;s doing what.
      </>
    ),
  },
];

export default function ObservePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#080B12] pt-28 sm:pt-32 pb-16 sm:pb-20">
        <div
          className="absolute inset-0 pointer-events-none hero-glow"
          aria-hidden="true"
        />
        <StarField count={50} />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-[rgba(240,240,250,0.4)] mb-8">
            <Link
              href="/"
              className="hover:text-[rgba(240,240,250,0.8)] transition-colors duration-200"
            >
              Home
            </Link>
            <span>/</span>
            <span className="text-[rgba(240,240,250,0.7)]">Live View</span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.04] mb-6 text-[11px] text-[rgba(240,240,250,0.55)] tracking-[0.2em] uppercase">
              MVHS Public Observatory
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-[rgba(240,240,250,1)] leading-[1.05] tracking-tighter mb-5">
              Live from the night sky
            </h1>
            <p className="text-lg text-[rgba(240,240,250,0.65)] leading-relaxed max-w-2xl">
              Watch our student-built telescope point at the cosmos in real
              time. Tracking, exposures, sky conditions — all streamed straight
              from our backyard observatory. Coming soon.
            </p>
          </div>
        </div>
      </section>

      {/* Coming Soon banner */}
      <section className="relative bg-[#080B12]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2">
          <ComingSoonBanner
            headline="Live view is offline until First Light"
            message={
              <>
                The telescope is being built right now. Live view activates the
                night we capture{" "}
                <strong className="text-[rgba(240,240,250,0.95)]">first light</strong>
                {" "}— currently targeting{" "}
                <strong className="text-[rgba(240,240,250,0.95)]">August 2026</strong>.
              </>
            }
          />
        </div>
      </section>

      {/* Mock live view */}
      <section className="relative bg-[#080B12] py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <MockLiveView />
        </div>
      </section>

      {/* Tonight at MVHS — real sky conditions */}
      <section className="relative bg-[#080B12] pb-16 sm:pb-20 -mt-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<TonightAtMVHSSkeleton />}>
            <TonightAtMVHS />
          </Suspense>
        </div>
      </section>

      {/* What you'll see */}
      <section className="relative bg-[#080B12] py-16 sm:py-20 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6" />
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[rgba(240,240,250,1)] mb-3">
              What you&apos;ll see
            </h2>
            <p className="text-[rgba(240,240,250,0.6)] text-base">
              Three things make the live view actually worth watching, instead
              of being a glorified webcam.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {features.map((f) => (
              <div
                key={f.title}
                className="p-7 rounded-2xl bg-[#0D1219] border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:border-white/[0.12] hover:bg-[#111922] transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-[#121A25] border border-white/[0.06] flex items-center justify-center text-white/90 mb-5">
                  {f.icon}
                </div>
                <h3 className="font-heading text-lg font-semibold text-[rgba(240,240,250,0.95)] mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-[rgba(240,240,250,0.6)] leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative bg-[#080B12] py-16 sm:py-20 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6" />
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[rgba(240,240,250,1)] mb-3">
              How it works
            </h2>
            <p className="text-[rgba(240,240,250,0.6)] text-base">
              From request to image, four steps — most happen while you sleep.
            </p>
          </div>
          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((s) => (
              <li
                key={s.n}
                className="relative p-6 rounded-2xl bg-[#0D1219] border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
              >
                <span className="font-mono text-xs text-[#9DC4FF] tracking-[0.2em]">
                  {s.n}
                </span>
                <h3 className="font-heading text-lg font-semibold text-[rgba(240,240,250,0.95)] mt-2 mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-[rgba(240,240,250,0.6)] leading-relaxed">
                  {s.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Email signup */}
      <section className="relative bg-[#080B12] py-16 sm:py-20 border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <EmailSignup
            source="observe"
            title="Notify me when it's live"
            description="One email, the night the telescope captures first light. No newsletter, no spam — promise."
            cta="Notify me"
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="relative bg-[#080B12] py-16 sm:py-20 border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6" />
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[rgba(240,240,250,1)]">
              Questions
            </h2>
          </div>
          <FAQ items={faqItems} idPrefix="observe-faq" />
        </div>
      </section>
    </>
  );
}
