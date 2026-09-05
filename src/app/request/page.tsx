import type { Metadata } from "next";
import EmailSignup from "@/components/EmailSignup";
import MockTargetPicker from "@/components/MockTargetPicker";
import OfflineStatus from "@/components/OfflineStatus";

export const metadata: Metadata = {
  title: "Request a target",
  description:
    "Tell the MV Astronomy telescope what to photograph. Pick a target, get the image by email. Opens at first light.",
};

export default function RequestPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-32 sm:px-8 sm:pb-32 sm:pt-40">
      <p className="label">Request</p>
      <h1 className="font-display mt-3 max-w-2xl text-[clamp(2.4rem,6vw,4.5rem)] text-ink">
        Tell it what to capture.
      </h1>
      <p className="prose-tight mt-5 text-lg">
        Pick a galaxy, a nebula, or a planet. The telescope queues it for the
        next clear night it is above the horizon, then emails you the image.
        Anything brighter than about magnitude 12 is fair game.
      </p>
      <OfflineStatus what="The request queue" />

      <div className="mt-16 max-w-2xl">
        <MockTargetPicker />
      </div>

      <div className="mt-24 border-t border-line pt-16">
        <EmailSignup
          source="request"
          title="Notify me when requests open"
          description="One email when the queue goes live. You tell us the target, we point the telescope."
        />
      </div>
    </div>
  );
}
