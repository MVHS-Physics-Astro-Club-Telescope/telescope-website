"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { OPEN_SCHEMATICS_EVENT, SCHEMATICS_HASH } from "./announcement";

/**
 * Reopens the schematics viewer. On the home page it opens in place; from any
 * other page it goes home with the deep link, which opens it there.
 */
export default function SchematicsLink({ className, children }: { className?: string; children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <Link
      href={`/${SCHEMATICS_HASH}`}
      className={className}
      onClick={(e) => {
        if (pathname !== "/" || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        window.dispatchEvent(new Event(OPEN_SCHEMATICS_EVENT));
      }}
    >
      {children}
    </Link>
  );
}
