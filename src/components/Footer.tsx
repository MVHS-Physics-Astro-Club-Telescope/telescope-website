import Link from "next/link";

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

function MailIcon() {
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
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

const footerLinks = [
  { label: "About", href: "/#about" },
  { label: "Team", href: "/#team" },
  { label: "Specs", href: "/#specs" },
  { label: "Timeline", href: "/#timeline" },
  { label: "Support", href: "/#support" },
  { label: "Parts", href: "/parts" },
];

export default function Footer() {
  return (
    <footer className="relative bg-[#030712] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              </div>
              <span className="text-white font-semibold text-lg">
                MVHS Astronomy
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              A student-run physics and astronomy club at Mountain View High
              School, building an autonomous telescope for community star
              parties.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-500 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Connect
            </h4>
            <div className="space-y-3">
              <a
                href="mailto:mvhsphysicsastroclub@gmail.com"
                className="flex items-center gap-3 text-slate-500 hover:text-white transition-colors duration-200 text-sm"
              >
                <MailIcon />
                mvhsphysicsastroclub@gmail.com
              </a>
              <a
                href="https://instagram.com/mvhs_physics_astro_club"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-slate-500 hover:text-white transition-colors duration-200 text-sm"
              >
                <InstagramIcon />
                @mvhs_physics_astro_club
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-sm">
            &copy; {new Date().getFullYear()} MVHS Physics &amp; Astronomy Club. All
            rights reserved.
          </p>
          <p className="text-slate-700 text-xs">
            Mountain View High School &middot; Mountain View, CA
          </p>
        </div>
      </div>
    </footer>
  );
}
