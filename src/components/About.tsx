"use client";

import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const fieldNotes = [
  {
    ref: "PLATE I",
    title: "Hands-on engineering",
    description:
      "A 10-inch reflecting telescope built from raw materials — plywood, aluminum, optics, and electronics, designed and assembled by students.",
  },
  {
    ref: "PLATE II",
    title: "Free star parties",
    description:
      "Open community observation nights for families across the Bay Area. No tickets, no fees — just curiosity and clear skies.",
  },
  {
    ref: "PLATE III",
    title: "Student-led software",
    description:
      "6,800+ lines of Python powering autonomous tracking, plate-solving, and auto-alignment — written and tested entirely by our team.",
  },
];

export default function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Field notes · Mountain View, CA"
          title="Built from scratch, by students"
        />

        {/* Mission statement — an atlas plate inscription */}
        <Reveal>
          <p className="max-w-3xl font-display text-2xl leading-snug text-starlight/90 sm:text-[2rem]">
            The MVHS Physics &amp; Astronomy Club is seven high-school
            students building a research-grade telescope entirely from
            scratch — mechanics, optics, electronics, and software — to
            bring the night sky to the Bay Area through{" "}
            <em className="text-brass-bright">free public star parties.</em>
          </p>
        </Reveal>

        {/* Field notes */}
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {fieldNotes.map((note, i) => (
            <Reveal key={note.title} delay={i * 0.12}>
              <div className="card-atlas tick-corners group h-full p-7 transition-colors duration-300 hover:border-brass/40">
                <p className="eyebrow !text-[0.625rem] text-chart/70">
                  {note.ref}
                </p>
                <h3 className="mt-4 font-display text-xl text-starlight">
                  {note.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-chart-bright/65">
                  {note.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
