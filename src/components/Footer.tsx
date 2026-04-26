import Link from "next/link";

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

function MailIcon() {
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
  { label: "Sponsors", href: "/sponsors" },
  { label: "Parts", href: "/parts" },
];

export default function Footer() {
  return (
    <footer className="relative bg-[#080B12] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <span className="font-heading text-[rgba(240,240,250,1)] font-semibold text-lg tracking-tight">
                MVHS Astronomy
              </span>
            </Link>
            <p className="text-[rgba(240,240,250,0.5)] text-sm leading-relaxed max-w-xs">
              A student-run physics and astronomy club at Mountain View High
              School, building an autonomous telescope for community star
              parties.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-medium text-[rgba(240,240,250,0.5)] uppercase tracking-wider mb-4 font-heading">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[rgba(240,240,250,0.5)] hover:text-[rgba(240,240,250,0.7)] transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-medium text-[rgba(240,240,250,0.5)] uppercase tracking-wider mb-4 font-heading">
              Connect
            </h4>
            <div className="space-y-3">
              <a
                href="mailto:mvhsphysicsastroclub@gmail.com"
                className="flex items-center gap-3 text-[rgba(240,240,250,0.5)] hover:text-[rgba(240,240,250,0.7)] transition-colors duration-200 text-sm"
              >
                <MailIcon />
                mvhsphysicsastroclub@gmail.com
              </a>
              <a
                href="https://instagram.com/mvhs_physics_astro_club"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-[rgba(240,240,250,0.5)] hover:text-[rgba(240,240,250,0.7)] transition-colors duration-200 text-sm"
              >
                <InstagramIcon />
                @mvhs_physics_astro_club
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[rgba(240,240,250,0.55)] text-sm">
            &copy; {new Date().getFullYear()} MVHS Physics &amp; Astronomy Club. All
            rights reserved.
          </p>
          <p className="text-[rgba(240,240,250,0.55)] text-xs">
            Mountain View High School &middot; Mountain View, CA
          </p>
        </div>
      </div>
    </footer>
  );
}
