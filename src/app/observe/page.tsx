import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import ComingSoonBanner from "@/components/ComingSoonBanner";
import EmailSignup from "@/components/EmailSignup";
import FAQ from "@/components/FAQ";
import ImmersiveHero from "@/components/ImmersiveHero";
import MockLiveView from "@/components/MockLiveView";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import TelescopeHUD from "@/components/TelescopeHUD";
import TonightAtMV, { TonightAtMVSkeleton } from "@/components/TonightAtMV";

export const metadata: Metadata = {
  title: "Live View — MV Public Observatory",
  description:
    "Watch our student-built telescope point at the cosmos in real time. Live view activates when the telescope captures first light in August 2026.",
};

const features = [
  {
    ref: "FIG. 1",
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
    ref: "FIG. 2",
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
    ref: "FIG. 3",
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
          className="underline underline-offset-4 decoration-brass/40 hover:decoration-brass hover:text-brass-bright"
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
      "Yes. Always. The MV Physics & Astronomy Club is a free, student-run organization, and the public observatory is part of our mission to make astronomy accessible across the Bay Area. Sponsors pay for the hardware so visitors don't have to.",
  },
  {
    question: "Who built this?",
    answer: (
      <>
        Seven high schoolers in Mountain View, California. We&apos;re designing
        the optics, machining the mount, writing the control software, and
        running the outreach ourselves. See the{" "}
        <Link
          href="/#team"
          className="underline underline-offset-4 decoration-brass/40 hover:decoration-brass hover:text-brass-bright"
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
      <ImmersiveHero starCount={70} shootingStars className="pt-28 sm:pt-32 pb-16 sm:pb-20">
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-10 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-chart/70">
            <Link
              href="/"
              className="transition-colors duration-200 hover:text-brass-bright"
            >
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-chart-bright/80">Live View</span>
          </div>

          {/* Two-column layout: copy left, HUD right */}
          <div className="lg:grid lg:grid-cols-[1fr_minmax(0,420px)] lg:items-center lg:gap-12">
            <div className="max-w-3xl">
              <p className="eyebrow mb-5">
                MV Public Observatory · 37.37°N −122.08°W · First light Aug 2026
              </p>
              <h1 className="mb-5 font-display text-5xl leading-[1.05] text-starlight sm:text-6xl">
                Live from the night sky
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-chart-bright/70">
                Watch our student-built telescope point at the cosmos in real
                time. Tracking, exposures, sky conditions — all streamed straight
                from our backyard observatory. Coming soon.
              </p>
            </div>

            {/* TelescopeHUD — stacks below copy on mobile, right column on lg */}
            <div className="order-last mt-10 lg:mt-0">
              <TelescopeHUD />
            </div>
          </div>
        </div>
      </ImmersiveHero>

      {/* Coming Soon banner */}
      <section className="relative pt-10 sm:pt-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <ComingSoonBanner
            headline="Live view is offline until First Light"
            message={
              <>
                The telescope is being built right now. Live view activates the
                night we capture{" "}
                <strong className="text-starlight">first light</strong>
                {" "}— currently targeting{" "}
                <strong className="text-starlight">August 2026</strong>.
              </>
            }
          />
        </div>
      </section>

      {/* Mock live view */}
      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <MockLiveView />
        </div>
      </section>

      {/* Tonight at MV — real sky conditions */}
      <section className="relative -mt-4 pb-16 sm:pb-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<TonightAtMVSkeleton />}>
            <TonightAtMV />
          </Suspense>
        </div>
      </section>

      {/* What you'll see */}
      <section className="relative border-t border-chart/12 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Live view · Three instruments"
            title="What you'll see"
            subtitle="Three things make the live view actually worth watching, instead of being a glorified webcam."
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.08}>
                <div className="card-atlas tick-corners h-full p-7 transition-colors duration-300 hover:border-brass/40">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-chart/15 bg-deep text-chart-bright">
                      {f.icon}
                    </div>
                    <p className="eyebrow !text-[0.625rem] text-chart/70">
                      {f.ref}
                    </p>
                  </div>
                  <h3 className="mb-2 font-display text-xl text-starlight">
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-chart-bright/65">
                    {f.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative border-t border-chart/12 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Pipeline · Request to inbox"
            title="How it works"
            subtitle="From request to image, four steps — most happen while you sleep."
          />
          <ol className="grid grid-cols-1 gap-px overflow-hidden rounded border border-chart/15 bg-chart/15 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal
                as="li"
                key={s.n}
                delay={i * 0.08}
                className="relative bg-deep p-7"
              >
                <span className="font-mono text-xs tracking-[0.2em] text-brass">
                  {s.n}
                </span>
                <h3 className="mt-4 font-display text-lg text-starlight">
                  {s.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-chart-bright/65">
                  {s.description}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Email signup */}
      <section className="relative border-t border-chart/12 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <EmailSignup
              source="observe"
              title="Notify me when it's live"
              description="One email, the night the telescope captures first light. No newsletter, no spam — promise."
              cta="Notify me"
            />
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative border-t border-chart/12 py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Field notes · FAQ" title="Questions" />
          <Reveal>
            <FAQ items={faqItems} idPrefix="observe-faq" />
          </Reveal>
        </div>
      </section>
    </>
  );
}
