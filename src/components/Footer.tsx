import Link from "next/link";

function InstagramIcon() {
  return (
    <svg
      width="16"
      height="16"
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

function MailIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

const footerLinks = [
  { label: "Mission", href: "/#about" },
  { label: "Observatory", href: "/#observatory" },
  { label: "Crew", href: "/#team" },
  { label: "Instrument", href: "/#specs" },
  { label: "Observing log", href: "/#timeline" },
  { label: "Support", href: "/#support" },
  { label: "Sponsors", href: "/sponsors" },
  { label: "Parts list", href: "/parts" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-chart/15 bg-void">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* Plate colophon */}
          <div>
            <Link href="/" className="inline-block">
              <span className="font-display text-xl text-starlight">
                MV <em className="text-chart-bright">Astronomy</em>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-chart-bright/60">
              An independent, student-run physics and astronomy project in
              Mountain View, California, building an autonomous telescope for
              free community star parties.
            </p>
            <p className="eyebrow mt-6 !text-[0.625rem]">
              37.3894° N · 122.0819° W · ELEV 32 M
            </p>
          </div>

          {/* Index */}
          <div>
            <h4 className="eyebrow mb-5">Chart index</h4>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-chart-bright/60 transition-colors duration-200 hover:text-brass-bright"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="eyebrow mb-5">Transmissions</h4>
            <div className="space-y-3">
              <a
                href="mailto:mvhsphysicsastroclub@gmail.com"
                className="flex items-center gap-3 text-sm text-chart-bright/60 transition-colors duration-200 hover:text-brass-bright"
              >
                <MailIcon />
                mvhsphysicsastroclub@gmail.com
              </a>
              <a
                href="https://instagram.com/mvhs_physics_astro_club"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-chart-bright/60 transition-colors duration-200 hover:text-brass-bright"
              >
                <InstagramIcon />
                @mvhs_physics_astro_club
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-chart/10 pt-8">
          <p className="max-w-3xl text-xs leading-relaxed text-chart-bright/45">
            MV Astronomy is an independent student project. It is not
            affiliated with, endorsed by, or sponsored by Mountain View High
            School or the Mountain View&ndash;Los Altos Union High School
            District.
          </p>
          <div className="mt-7 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-chart-bright/50">
              &copy; {new Date().getFullYear()}{" "}MV Physics &amp;
              Astronomy Club. All rights reserved.
            </p>
            <p className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-chart-bright/40">
              Mountain View, CA
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
