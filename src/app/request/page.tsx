import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ComingSoonBanner from "@/components/ComingSoonBanner";
import EmailSignup from "@/components/EmailSignup";
import FAQ from "@/components/FAQ";
import MockTargetPicker from "@/components/MockTargetPicker";
import StarField from "@/components/StarField";

export const metadata: Metadata = {
  title: "Request a target — MVHS Public Observatory",
  description:
    "Tell our student-built robotic telescope what to capture for you. Submit a target, get a high-resolution image emailed back. Coming soon.",
};

const captureCategories = [
  {
    title: "Moon & planets",
    image: "/request/moon.jpg",
    alt: "The full Moon photographed by NASA",
    credit: "NASA",
    description:
      "Lunar craters and rilles, Jupiter's cloud bands and moons, Saturn's rings, Mars at opposition.",
  },
  {
    title: "Bright nebulae & clusters",
    image: "/request/nebula.jpg",
    alt: "NASA Spitzer infrared image of a star-forming nebula",
    credit: "Star-forming nebula — NASA / Spitzer",
    description:
      "Star-forming regions, planetary nebulae, supernova remnants, open and globular clusters.",
  },
  {
    title: "Galaxies",
    image: "/request/galaxy.jpg",
    alt: "GALEX/Spitzer composite image of the Andromeda Galaxy",
    credit: "NASA / JPL",
    description:
      "Andromeda, the Whirlpool, the Sombrero, and dozens more — anything down to about magnitude 12.",
  },
];

const faqItems = [
  {
    question: "When can I actually submit a request?",
    answer: (
      <>
        Submissions open the night the telescope captures{" "}
        <strong>first light</strong>, currently targeting <strong>August 2026</strong>.
        Drop your email below and we&apos;ll let you know the moment the queue
        is open.
      </>
    ),
  },
  {
    question: "How long until I get my image?",
    answer:
      "Same week, if the weather plays along. Targets that are well-placed and bright (Moon, planets, the brighter Messier objects) capture in under an hour. Faint galaxies and nebulae need multiple clear nights to stack enough exposure time. We'll email you the moment your image is ready.",
  },
  {
    question: "What if my target isn't visible right now?",
    answer:
      "We'll queue it for the next time it's above the horizon and out of the Moon's glare. The Bay Area sky moves through every season eventually — you'll get your image, just maybe not tomorrow night.",
  },
  {
    question: "Do I get the raw data?",
    answer:
      "If you want it, yes. We'll email you a high-res PNG by default, and the calibrated FITS frames on request — perfect for amateur astrophotographers who want to do their own processing.",
  },
];

export default function RequestPage() {
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
          <div className="flex items-center gap-2 text-sm text-[rgba(240,240,250,0.4)] mb-8">
            <Link
              href="/"
              className="hover:text-[rgba(240,240,250,0.8)] transition-colors duration-200"
            >
              Home
            </Link>
            <span>/</span>
            <span className="text-[rgba(240,240,250,0.7)]">Request</span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.04] mb-6 text-[11px] text-[rgba(240,240,250,0.55)] tracking-[0.2em] uppercase">
              MVHS Public Observatory
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-[rgba(240,240,250,1)] leading-[1.05] tracking-tighter mb-5">
              Request a target
            </h1>
            <p className="text-lg text-[rgba(240,240,250,0.65)] leading-relaxed max-w-2xl">
              Tell our telescope what to capture for you. Pick a galaxy, a
              nebula, a planet — we&apos;ll point the optics at it and email
              you the image.
            </p>
          </div>
        </div>
      </section>

      {/* Coming Soon banner */}
      <section className="relative bg-[#080B12]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2">
          <ComingSoonBanner
            headline="Request queue opens at First Light"
            message={
              <>
                Currently targeting{" "}
                <strong className="text-[rgba(240,240,250,0.95)]">August 2026</strong>.
                You can preview the request flow below — the submit button
                unlocks automatically the night of first light.
              </>
            }
          />
        </div>
      </section>

      {/* Mock target picker */}
      <section className="relative bg-[#080B12] py-14 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[rgba(240,240,250,1)] mb-2">
              Build your request
            </h2>
            <p className="text-sm text-[rgba(240,240,250,0.6)] leading-relaxed">
              Try it out — type a target name, pick from suggestions, see the
              preview card. The submit button activates when the telescope
              goes online.
            </p>
          </div>
          <MockTargetPicker />
        </div>
      </section>

      {/* What we can capture */}
      <section className="relative bg-[#080B12] py-16 sm:py-20 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6" />
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[rgba(240,240,250,1)] mb-3">
              What we can capture
            </h2>
            <p className="text-[rgba(240,240,250,0.6)] text-base">
              A 10-inch f/4.48 Dobsonian gathers enough light for the whole
              Messier catalog, all eight planets, and most of the brighter
              NGC objects. Here&apos;s the rough menu.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {captureCategories.map((c) => (
              <div
                key={c.title}
                className="rounded-2xl overflow-hidden bg-[#0D1219] border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:border-white/[0.12] transition-all duration-300"
              >
                <div className="relative aspect-[4/3] bg-black">
                  <Image
                    src={c.image}
                    alt={c.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                  <span className="absolute bottom-2 right-2 text-[10px] font-mono uppercase tracking-[0.15em] text-white/70 bg-black/60 px-2 py-1 rounded">
                    {c.credit}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-lg font-semibold text-[rgba(240,240,250,0.95)] mb-2">
                    {c.title}
                  </h3>
                  <p className="text-sm text-[rgba(240,240,250,0.6)] leading-relaxed">
                    {c.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Email signup */}
      <section className="relative bg-[#080B12] py-16 sm:py-20 border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <EmailSignup
            source="request"
            title="Notify me when submissions open"
            description="One email when the request queue goes live. No marketing, no follow-ups — you tell us your target, we point the telescope."
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
          <FAQ items={faqItems} idPrefix="request-faq" />
        </div>
      </section>
    </>
  );
}
