"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "Crew", href: "/#crew" },
  { label: "Sponsors", href: "/sponsors" },
  { label: "Parts", href: "/parts" },
  { label: "Observe", href: "/observe" },
  { label: "Request", href: "/request" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? "bg-black/70 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8"
      >
        <Link href="/" className="font-display text-[1.35rem] text-ink" onClick={() => setOpen(false)}>
          MV Astronomy
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {links.map((l) => {
            const current = pathname === l.href;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={current ? "page" : undefined}
                  className="nav-link text-[0.9375rem]"
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
          <li>
            <a href="mailto:mvhsphysicsastroclub@gmail.com" className="btn h-9 px-4 text-[0.875rem]">
              Contact
            </a>
          </li>
        </ul>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="nav-link -mr-2 p-2 md:hidden"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
            {open ? (
              <>
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </>
            ) : (
              <>
                <line x1="4" y1="8" x2="20" y2="8" />
                <line x1="4" y1="16" x2="20" y2="16" />
              </>
            )}
          </svg>
        </button>
      </nav>

      <div
        id="mobile-menu"
        hidden={!open}
        className="border-t border-line bg-black/90 backdrop-blur-md md:hidden"
      >
        <ul className="mx-auto flex max-w-6xl flex-col px-5 py-3">
          {links.map((l) => (
            <li key={l.href} className="row">
              <Link href={l.href} onClick={() => setOpen(false)} className="nav-link block py-3.5 text-lg">
                {l.label}
              </Link>
            </li>
          ))}
          <li className="pt-4 pb-2">
            <a href="mailto:mvhsphysicsastroclub@gmail.com" className="btn">
              Contact
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
