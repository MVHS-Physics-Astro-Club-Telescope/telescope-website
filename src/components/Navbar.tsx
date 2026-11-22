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

// The org path is a live external identifier; it can't be renamed from this repo.
const GITHUB_URL = "https://github.com/MVHS-Physics-Astro-Club-Telescope";

function GitHubMark() {
  // GitHub's mark (Octicons mark-github, MIT)
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

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

        <div className="flex items-center gap-2 md:gap-5">
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
              <a href="mailto:contact@mvhsastro.org" className="btn h-9 px-4 text-[0.875rem]">
                Contact
              </a>
            </li>
          </ul>

          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="MV Astronomy on GitHub (opens in a new tab)"
            title="GitHub"
            className="nav-link p-2.5 md:-mr-2.5"
          >
            <GitHubMark />
          </a>

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
        </div>
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
            <a href="mailto:contact@mvhsastro.org" className="btn">
              Contact
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
