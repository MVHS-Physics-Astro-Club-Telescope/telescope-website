"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const navLinks = [
  { label: "Mission", href: "/#about" },
  { label: "Observatory", href: "/#observatory" },
  { label: "Crew", href: "/#team" },
  { label: "Instrument", href: "/#specs" },
  { label: "Log", href: "/#timeline" },
  { label: "Support", href: "/#support" },
  { label: "Sponsors", href: "/sponsors" },
  { label: "Parts", href: "/parts" },
];

function InstagramIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/** Reticle wordmark — the telescope's crosshair, in brass */
function Mark() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      aria-hidden="true"
      className="text-brass"
    >
      <circle cx="12" cy="12" r="8" />
      <line x1="12" y1="1" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="23" />
      <line x1="1" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="23" y2="12" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-void/85 backdrop-blur-xl border-b border-chart/15"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Wordmark */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <Mark />
            <span className="font-display text-lg text-starlight">
              MVHS <em className="text-chart-bright">Astronomy</em>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="nav-link px-2.5 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] whitespace-nowrap text-chart-bright/70"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Right */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="https://instagram.com/mvhs_physics_astro_club"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-chart-bright/60 hover:text-brass-bright transition-colors duration-200"
              aria-label="Instagram"
            >
              <InstagramIcon />
            </a>
            <a
              href="mailto:mvhsphysicsastroclub@gmail.com"
              className="btn-line px-6 py-2.5 text-sm"
            >
              Contact us
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-chart-bright/70 hover:text-starlight transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          mobileOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-void/95 backdrop-blur-xl border-t border-chart/15 px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="nav-link block px-4 py-3 font-mono text-xs uppercase tracking-[0.14em] text-chart-bright/70"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-3 px-4 pt-4 border-t border-chart/15 mt-2">
            <a
              href="https://instagram.com/mvhs_physics_astro_club"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-chart-bright/60 hover:text-brass-bright transition-colors"
              aria-label="Instagram"
            >
              <InstagramIcon />
            </a>
            <a
              href="mailto:mvhsphysicsastroclub@gmail.com"
              className="flex-1 text-center btn-line px-6 py-2.5 text-sm"
            >
              Contact us
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
