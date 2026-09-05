import { leadershipNote, team } from "@/data/team";

export default function Crew() {
  return (
    <section id="crew" className="scroll-mt-16 border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <div className="max-w-xl">
          <p className="label">Crew</p>
          <h2 className="font-display mt-3 text-[clamp(1.9rem,4vw,3rem)] text-ink">
            Eight students. Every discipline.
          </h2>
        </div>

        <ul className="mt-14 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          {team.map((m) => (
            <li key={m.name}>
              <div className="aspect-[4/5] overflow-hidden bg-[#0d0d0d]">
                {m.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={m.image}
                    alt={m.name}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover grayscale-[0.35] transition-[filter] duration-500 hover:grayscale-0"
                  />
                ) : null}
              </div>
              <p className="mt-3.5 text-[0.9375rem] text-ink">{m.name}</p>
              <p className="mt-0.5 text-[0.875rem] text-ink-3">{m.role}</p>
            </li>
          ))}
        </ul>

        <p className="mt-14 max-w-2xl text-[0.875rem] leading-relaxed text-ink-3">
          {leadershipNote}
        </p>
      </div>
    </section>
  );
}
