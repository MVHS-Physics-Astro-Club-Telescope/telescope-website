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
  { label: "Parts", href: "/parts" },
];

function InstagramIcon() {
  return (
    <svg
      width="20"
      height="20"
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
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#030712]/80 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold transition-transform duration-300 group-hover:scale-110">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">
              MVHS <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">Astronomy</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-3 py-2 text-sm text-slate-300 hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/5"
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
              className="p-2 text-slate-400 hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/5"
              aria-label="Instagram"
            >
              <InstagramIcon />
            </a>
            <a
              href="mailto:mvhsphysicsastroclub@gmail.com"
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg hover:from-blue-500 hover:to-violet-500 transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5"
            >
              Contact Us
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
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
        <div className="bg-[#030712]/95 backdrop-blur-xl border-t border-white/5 px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-3 px-4 pt-4 border-t border-white/5 mt-2">
            <a
              href="https://instagram.com/mvhs_physics_astro_club"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <InstagramIcon />
            </a>
            <a
              href="mailto:mvhsphysicsastroclub@gmail.com"
              className="flex-1 text-center px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg hover:from-blue-500 hover:to-violet-500 transition-all duration-200"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
