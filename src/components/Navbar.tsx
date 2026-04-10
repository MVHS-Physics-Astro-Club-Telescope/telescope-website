"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "About", href: "/#about" },
  { label: "Team", href: "/#team" },
  { label: "Specs", href: "/#specs" },
  { label: "Timeline", href: "/#timeline" },
  { label: "Support Us", href: "/#support" },
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
      strokeWidth="2"
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

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#080B12]/80 backdrop-blur-xl border-b border-white/[0.06]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-heading text-[rgba(240,240,250,1)] font-semibold text-lg tracking-tight">
              MVHS Astronomy
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-3 py-2 text-sm text-[rgba(240,240,250,0.6)] hover:text-[rgba(240,240,250,1)] transition-colors duration-200"
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
              className="p-2 text-[rgba(240,240,250,0.6)] hover:text-[rgba(240,240,250,1)] transition-colors duration-200"
              aria-label="Instagram"
            >
              <InstagramIcon />
            </a>
            <a
              href="mailto:mvhsphysicsastroclub@gmail.com"
              className="btn-titanium-dark px-7 py-2.5 text-sm font-medium text-[rgba(240,240,250,0.9)] rounded-full"
            >
              Contact Us
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-[rgba(240,240,250,0.6)] hover:text-[rgba(240,240,250,1)] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          mobileOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-[#080B12]/95 backdrop-blur-xl border-t border-white/[0.06] px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-[rgba(240,240,250,0.6)] hover:text-[rgba(240,240,250,1)] transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-3 px-4 pt-4 border-t border-white/[0.06] mt-2">
            <a
              href="https://instagram.com/mvhs_physics_astro_club"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-[rgba(240,240,250,0.6)] hover:text-[rgba(240,240,250,1)] transition-colors"
              aria-label="Instagram"
            >
              <InstagramIcon />
            </a>
            <a
              href="mailto:mvhsphysicsastroclub@gmail.com"
              className="flex-1 text-center btn-titanium-dark px-7 py-2.5 text-sm font-medium text-[rgba(240,240,250,0.9)] rounded-full"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
