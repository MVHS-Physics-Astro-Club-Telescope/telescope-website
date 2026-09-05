import Link from "next/link";

const links = [
  { label: "Crew", href: "/#crew" },
  { label: "Support", href: "/#support" },
  { label: "Sponsors", href: "/sponsors" },
  { label: "Parts", href: "/parts" },
  { label: "Observe", href: "/observe" },
  { label: "Request", href: "/request" },
];

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Link href="/" className="font-display text-[1.35rem] text-ink">
              MV Astronomy
            </Link>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-2">
              An independent, student-run project in Mountain View, California,
              building an autonomous telescope for free community star parties.
            </p>
          </div>

          <div className="flex flex-col gap-8 sm:flex-row sm:gap-16">
            <ul className="space-y-2.5">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="nav-link text-[0.9375rem]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="space-y-2.5">
              <li>
                <a href="mailto:mvhsphysicsastroclub@gmail.com" className="nav-link text-[0.9375rem]">
                  mvhsphysicsastroclub@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/mvhs_physics_astro_club"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-link text-[0.9375rem]"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/MVHS-Physics-Astro-Club-Telescope"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-link text-[0.9375rem]"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-line pt-6 text-[0.8125rem] leading-relaxed text-ink-3">
          <p className="max-w-2xl">
            MV Astronomy is an independent student project. It is not affiliated
            with, endorsed by, or sponsored by Mountain View High School or the
            Mountain View&ndash;Los Altos Union High School District.
          </p>
          <p className="mt-4">&copy; {new Date().getFullYear()} MV Astronomy</p>
        </div>
      </div>
    </footer>
  );
}
