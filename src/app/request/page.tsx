import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ComingSoonBanner from "@/components/ComingSoonBanner";
import CoordinateGrid from "@/components/CoordinateGrid";
import EmailSignup from "@/components/EmailSignup";
import FAQ from "@/components/FAQ";
import ImmersiveHero from "@/components/ImmersiveHero";
import MockTargetPicker from "@/components/MockTargetPicker";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Request a target — MVHS Public Observatory",
  description:
    "Tell our student-built robotic telescope what to capture for you. Submit a target, get a high-resolution image emailed back. Coming soon.",
};

const captureCategories = [
  {
    ref: "PLATE I",
    title: "Moon & planets",
    image: "/request/moon.jpg",
    alt: "The full Moon photographed by NASA",
    credit: "NASA",
    description:
      "Lunar craters and rilles, Jupiter's cloud bands and moons, Saturn's rings, Mars at opposition.",
  },
  {
    ref: "PLATE II",
    title: "Bright nebulae & clusters",
    image: "/request/nebula.jpg",
    alt: "NASA Spitzer infrared image of a star-forming nebula",
    credit: "Star-forming nebula — NASA / Spitzer",
    description:
      "Star-forming regions, planetary nebulae, supernova remnants, open and globular clusters.",
  },
  {
    ref: "PLATE III",
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
      <ImmersiveHero starCount={70} shootingStars className="pt-28 sm:pt-32 pb-16 sm:pb-20">
        {/* CoordinateGrid layered behind text */}
        <CoordinateGrid />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-chart/70">
            <Link
              href="/"
              className="transition-colors duration-200 hover:text-brass-bright"
            >
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-chart-bright/80">Request</span>
          </div>

          <div className="max-w-3xl">
            <p className="eyebrow mb-5">
              MVHS Public Observatory · Target queue · Opens Aug 2026
            </p>
            <h1 className="mb-5 font-display text-5xl leading-[1.05] text-starlight sm:text-6xl">
              Request a target
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-chart-bright/70">
              Tell our telescope what to capture for you. Pick a galaxy, a
              nebula, a planet — we&apos;ll point the optics at it and email
              you the image.
            </p>
          </div>
        </div>
      </ImmersiveHero>

      {/* Coming Soon banner */}
      <section className="relative pt-10 sm:pt-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <ComingSoonBanner
            headline="Request queue opens at First Light"
            message={
              <>
                Currently targeting{" "}
                <strong className="text-starlight">August 2026</strong>.
                You can preview the request flow below — the submit button
                unlocks automatically the night of first light.
              </>
            }
          />
        </div>
      </section>

      {/* Mock target picker */}
      <section className="relative py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mb-8">
              <p className="eyebrow mb-4">Preview · Full catalog · ⌘K to search</p>
              <h2 className="mb-3 font-display text-3xl text-starlight sm:text-4xl">
                Build your request
              </h2>
              <p className="text-sm leading-relaxed text-chart-bright/65">
                Try it out — type a target name, pick from suggestions, see the
                preview card. The submit button activates when the telescope
                goes online.
              </p>
            </div>
          </Reveal>
          <Reveal>
            <MockTargetPicker />
          </Reveal>
        </div>
      </section>

      {/* What we can capture */}
      <section className="relative border-t border-chart/12 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Catalog · 10-inch f/4.48 · mag ≤ 12"
            title="What we can capture"
            subtitle="A 10-inch f/4.48 Dobsonian gathers enough light for the whole Messier catalog, all eight planets, and most of the brighter NGC objects. Here's the rough menu."
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
            {captureCategories.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.08}>
                <div className="card-atlas tick-corners h-full overflow-hidden transition-colors duration-300 hover:border-brass/40">
                  <div className="relative aspect-[4/3] bg-black">
                    <Image
                      src={c.image}
                      alt={c.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                    <span className="absolute bottom-2 right-2 rounded-sm border border-chart/20 bg-void/75 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-chart-bright/70">
                      {c.credit}
                    </span>
                  </div>
                  <div className="p-6">
                    <p className="eyebrow !text-[0.625rem] text-chart/70">
                      {c.ref}
                    </p>
                    <h3 className="mt-3 mb-2 font-display text-xl text-starlight">
                      {c.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-chart-bright/65">
                      {c.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Email signup */}
      <section className="relative border-t border-chart/12 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <EmailSignup
              source="request"
              title="Notify me when submissions open"
              description="One email when the request queue goes live. No marketing, no follow-ups — you tell us your target, we point the telescope."
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
            <FAQ items={faqItems} idPrefix="request-faq" />
          </Reveal>
        </div>
      </section>
    </>
  );
}
