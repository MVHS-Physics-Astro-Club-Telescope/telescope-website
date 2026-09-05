import Link from "next/link";
import { getBudgetRange } from "@/data/parts";
import { getTotalCashRaised, sponsors } from "@/data/sponsors";

const perks = [
  "Your name engraved on the telescope",
  "A permanent listing on our sponsors page",
  "Thanks at every star party we host",
  "An invitation to first light",
];

export default function Support() {
  const { low, high } = getBudgetRange();
  const raised = getTotalCashRaised();
  const inKind = sponsors.filter((s) => s.type !== "Cash").length;

  return (
    <section id="support" className="scroll-mt-16 border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-14 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-2 lg:gap-20">
        <div>
          <p className="label">Support</p>
          <h2 className="font-display mt-3 max-w-md text-[clamp(1.9rem,4vw,3rem)] text-ink">
            Put your name on the telescope.
          </h2>
          <p className="prose-tight mt-5">
            The project is student-run and sponsor-funded. Cash goes straight
            to the parts list; equipment and fabrication credit go straight
            onto the instrument.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="mailto:mvhsphysicsastroclub@gmail.com?subject=Telescope%20sponsorship"
              className="btn btn-solid"
            >
              Become a sponsor
            </a>
            <Link href="/sponsors" className="btn">
              See who already has
            </Link>
          </div>
        </div>

        <div>
          <dl className="grid grid-cols-3 gap-6">
            <div>
              <dt className="label">Cash raised</dt>
              <dd className="font-display mt-2 text-3xl text-ink tabular-nums">
                ${raised.toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="label">In-kind sponsors</dt>
              <dd className="font-display mt-2 text-3xl text-ink tabular-nums">{inKind}</dd>
            </div>
            <div>
              <dt className="label">Parts budget</dt>
              <dd className="font-display mt-2 text-3xl text-ink tabular-nums">
                ${low.toLocaleString()}&ndash;{high.toLocaleString()}
              </dd>
            </div>
          </dl>

          <ul className="mt-10">
            {perks.map((p) => (
              <li key={p} className="row py-3.5 text-[0.9375rem] text-ink-2">
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
