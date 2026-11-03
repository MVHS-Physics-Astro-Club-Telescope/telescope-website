/**
 * One line that says the telescope is down right now. Used on /observe and
 * /request so both pages carry the same, honest status. `detail` says what
 * that means for the page it sits on.
 */
export default function OfflineStatus({ detail }: { detail: string }) {
  return (
    <p role="status" className="mt-8 flex items-center gap-3 text-[0.9375rem] text-ink-2">
      <span aria-hidden="true" className="pulse-dot inline-block h-2 w-2 rounded-full bg-warn" />
      <span>
        <span className="text-ink">The telescope is down right now.</span> {detail}
      </span>
    </p>
  );
}
