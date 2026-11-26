import Link from "next/link";
import { getBuildCost } from "@/data/parts";
import { getTotalCashRaised, getTotalSupport } from "@/data/sponsors";

const perks = [
  "Your name engraved on the telescope",
  "A permanent listing on our sponsors page",
  "Thanks at every star party we host",
  "An invitation to first light",
];

export default function Support() {
  const buildCost = getBuildCost();
  const raised = getTotalCashRaised();
  const support = getTotalSupport();

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
          <dl className="grid grid-cols-3 grid-rows-[auto_auto] gap-x-6">
            <div className="row-span-2 grid grid-rows-subgrid">
              <dt className="label self-end">Total support</dt>
              <dd className="font-display mt-2 text-3xl text-ink tabular-nums">
                ${support.toLocaleString()}
              </dd>
            </div>
            <div className="row-span-2 grid grid-rows-subgrid">
              <dt className="label self-end">Cash raised</dt>
              <dd className="font-display mt-2 text-3xl text-ink tabular-nums">
                ${raised.toLocaleString()}
              </dd>
            </div>
            <div className="row-span-2 grid grid-rows-subgrid">
              <dt className="label self-end">Build cost</dt>
              <dd className="font-display mt-2 text-3xl text-ink tabular-nums">
                ${buildCost.toLocaleString()}
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-[0.8125rem] leading-relaxed text-ink-3">
            Total support is cash plus donated equipment, credit, and services
            at estimated retail value. Build cost is every part on the
            telescope at retail, donated or bought; the rocker box, mirror
            box, spider vanes and current sensor are not priced yet.
          </p>

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
