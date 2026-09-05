"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, MotionConfig } from "framer-motion";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";

const TelescopeCanvas = dynamic(() => import("./TelescopeCanvas"), { ssr: false });

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Beat = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  side: "left" | "right";
};

const BEATS: Beat[] = [
  {
    id: "mechanical",
    eyebrow: "Mechanical",
    title: "Plywood, aluminum, and printed ASA.",
    body:
      "A truss-tube Dobsonian. The birch mirror box rides on Teflon bearings inside a rocker box, six aluminum poles carry the upper cage, and every bracket is printed in-house. It splits in two and fits in a car.",
    side: "left",
  },
  {
    id: "electrical",
    eyebrow: "Electrical",
    title: "Two steppers and a Raspberry Pi.",
    body:
      "A NEMA 23 drives altitude through a sector gear; a NEMA 17 turns azimuth by belt. A Raspberry Pi 4 runs the scheduler, the safety interlocks, and the camera from 12 V and 24 V rails.",
    side: "right",
  },
  {
    id: "optics",
    eyebrow: "Optics",
    title: "254 mm of glass at f/4.48.",
    body:
      "A donated parabolic primary folds light off a 70 mm flat into a cooled ToupTek camera. 1,138 mm focal length, enough to reach galaxies near magnitude 12.",
    side: "left",
  },
];

const SCREENS = BEATS.length + 2; // hero + beats + outro

export default function TelescopeStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const reduced = usePrefersReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Progress is read directly from scroll inside the render loop; bounds
  // are cached here on resize so the frame loop never touches layout.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let top = 0;
    let span = 1;
    const measure = () => {
      const r = el.getBoundingClientRect();
      top = r.top + window.scrollY;
      span = Math.max(el.offsetHeight - window.innerHeight, 1);
    };
    const update = () => {
      const p = (window.scrollY - top) / span;
      progress.current = Math.min(Math.max(p, 0), 1);
    };
    measure();
    update();
    window.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(() => {
      measure();
      update();
    });
    ro.observe(el);
    return () => {
      window.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={sectionRef}
        aria-label="The telescope"
        className="relative"
        style={{ height: `${SCREENS * 100}svh` }}
      >
        {/* Pinned stage */}
        <div className="sticky top-0 h-svh overflow-hidden">
          {mounted && <TelescopeCanvas progress={progress} animate={!reduced} />}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] bg-gradient-to-t from-black via-black/70 to-transparent sm:hidden"
          />
        </div>

        {/* Copy, in normal flow over the stage */}
        <div className="absolute inset-0">
          {/* Hero */}
          <div className="flex h-svh items-end">
            <div className="mx-auto w-full max-w-6xl px-5 pb-14 sm:px-8 sm:pb-20">
              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3, ease }}
                className="font-display max-w-[14ch] text-[clamp(2.6rem,7.2vw,6rem)] text-ink"
              >
                A telescope that aims itself.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.55, ease }}
                className="prose-tight mt-5 text-[1.0625rem] sm:text-lg"
              >
                A 10-inch Dobsonian designed and built from scratch by eight
                students in Mountain View, California.
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.4, ease }}
                className="label mt-10"
              >
                Scroll
              </motion.p>
            </div>
          </div>

          {BEATS.map((b) => (
            <div key={b.id} id={b.id} className="flex h-svh items-end pb-16 sm:items-center sm:pb-0">
              <div
                className={`mx-auto flex w-full max-w-6xl px-5 sm:px-8 ${
                  b.side === "right" && !reduced ? "justify-end" : "justify-start"
                }`}
              >
                <motion.div
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ amount: 0.6, once: false }}
                  transition={{ duration: 0.8, ease }}
                  className="max-w-md"
                >
                  <p className="label">{b.eyebrow}</p>
                  <h2 className="font-display mt-3 text-[clamp(1.9rem,4vw,3rem)] text-ink">
                    {b.title}
                  </h2>
                  <p className="prose-tight mt-4 text-[0.9375rem] sm:text-base">{b.body}</p>
                </motion.div>
              </div>
            </div>
          ))}

          {/* Outro */}
          <div className="flex h-svh items-end pb-16 sm:items-center sm:pb-0">
            <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.6, once: false }}
                transition={{ duration: 0.8, ease }}
                className="max-w-md"
              >
                <p className="label">Public observatory</p>
                <h2 className="font-display mt-3 text-[clamp(1.9rem,4vw,3rem)] text-ink">
                  Anyone can use it.
                </h2>
                <p className="prose-tight mt-4 text-[0.9375rem] sm:text-base">
                  At first light, you pick a target from your phone. The
                  telescope finds it, photographs it, and emails you the image.
                  Free, every time.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link href="/request" className="btn btn-solid">
                    Request a target
                  </Link>
                  <Link href="/observe" className="btn">
                    Watch it work
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
