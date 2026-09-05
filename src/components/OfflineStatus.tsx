/**
 * One line that says the observatory is not online yet. Used on /observe
 * and /request so both pages carry the same, honest status.
 */
export default function OfflineStatus({ what }: { what: string }) {
  return (
    <p role="status" className="mt-8 flex items-center gap-3 text-[0.9375rem] text-ink-2">
      <span aria-hidden="true" className="pulse-dot inline-block h-2 w-2 rounded-full bg-warn" />
      <span>
        <span className="text-ink">Coming soon.</span> {what} opens the night the
        telescope sees first light.
      </span>
    </p>
  );
}
