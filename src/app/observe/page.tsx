import type { Metadata } from "next";
import { Suspense } from "react";
import EmailSignup from "@/components/EmailSignup";
import OfflineStatus from "@/components/OfflineStatus";
import TonightAtMV, { TonightAtMVSkeleton } from "@/components/TonightAtMV";

export const metadata: Metadata = {
  title: "Live View",
  description:
    "Watch the MV Astronomy telescope point at the sky in real time. The live view opens at first light.",
};

const feed = [
  ["Pointing", "Right ascension, declination, altitude, and azimuth, updated every second."],
  ["Exposures", "Frames stacking in your browser as the camera integrates on a target."],
  ["Conditions", "Cloud, seeing, and moon for the Mountain View site, so you know what to expect."],
];

export default function ObservePage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-32 sm:px-8 sm:pb-32 sm:pt-40">
      <p className="label">Live view</p>
      <h1 className="font-display mt-3 max-w-2xl text-[clamp(2.4rem,6vw,4.5rem)] text-ink">
        Watch it work.
      </h1>
      <p className="prose-tight mt-5 text-lg">
        Where the telescope is pointed, what it is exposing, and what the sky
        is doing, streamed from the observatory.
      </p>
      <OfflineStatus what="The live view" />

      <div className="mt-20 grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
        <section aria-labelledby="tonight">
          <h2 id="tonight" className="label mb-2">
            Tonight over Mountain View
          </h2>
          <Suspense fallback={<TonightAtMVSkeleton />}>
            <TonightAtMV />
          </Suspense>
        </section>

        <section aria-labelledby="feed">
          <h2 id="feed" className="label mb-2">
            What the feed will show
          </h2>
          <dl>
            {feed.map(([term, def]) => (
              <div key={term} className="row grid gap-1 py-4 sm:grid-cols-[7rem_1fr] sm:gap-6">
                <dt className="text-[0.9375rem] text-ink">{term}</dt>
                <dd className="text-[0.9375rem] text-ink-2">{def}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <div className="mt-24 border-t border-line pt-16">
        <EmailSignup
          source="observe"
          title="Notify me when it's live"
          description="One email, the night the telescope captures first light. Nothing else."
        />
      </div>
    </div>
  );
}
