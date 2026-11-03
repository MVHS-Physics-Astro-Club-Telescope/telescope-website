export interface TeamMember {
  name: string;
  role: string;
  /** "lead" members are listed first and carry a named responsibility. */
  tier: "lead" | "member";
  image?: string;
}

/**
 * Roster as of 2026-11-02 (Ibrahim Hasan, Sophie Weng and Lenar Khusiainov
 * added once they sent photos). Order is leads first, then members.
 * Eeshan is the sole Electronics & Software lead; Neel is an electronics
 * member (lead title removed 2026-11-02 at Eeshan's instruction).
 * Roles are a public statement of who holds what on this project —
 * keep `leadershipNote` below in sync when they change.
 */
export const team: TeamMember[] = [
  {
    name: "Eeshan Khandelwal",
    role: "Electronics & Software Lead",
    tier: "lead",
    image: "/team/eeshan.jpg",
  },
  {
    name: "Vidu Senadheera",
    role: "Co-Mechanical Lead",
    tier: "lead",
    image: "/team/vidu.jpg",
  },
  {
    name: "David Cho",
    role: "Co-Mechanical Lead",
    tier: "lead",
    image: "/team/david.jpg",
  },
  {
    name: "Aryan Khanna",
    role: "Physics Calculation Lead",
    tier: "lead",
    image: "/team/aryan_khanna.jpg",
  },
  {
    name: "Tristan Schaefer",
    role: "Outreach Lead",
    tier: "lead",
    image: "/team/tristan.jpg",
  },
  {
    name: "Neel Chhatrala",
    role: "Electronics",
    tier: "member",
    image: "/team/neel.jpg",
  },
  {
    name: "Ibrahim Hasan",
    role: "Electronics",
    tier: "member",
    image: "/team/ibrahim.jpg",
  },
  {
    name: "Lenar Khusiainov",
    role: "Electronics",
    tier: "member",
    image: "/team/lenar.jpg",
  },
  {
    name: "Ishaan Sakariya",
    role: "Mechanical",
    tier: "member",
    image: "/team/ishaan.jpg",
  },
  {
    name: "Dominic Reouk",
    role: "Mechanical",
    tier: "member",
    image: "/team/dominic.jpg",
  },
  {
    name: "Sophie Weng",
    role: "Outreach",
    tier: "member",
    image: "/team/sophie.jpg",
  },
];

const NUMBER_WORDS = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
  "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
  "seventeen", "eighteen", "nineteen", "twenty",
];

/**
 * How many students the site says built the telescope, as a word ("eleven").
 * Derived from the roster so the crew heading, the home story and the site
 * description can never disagree with the grid.
 */
export const crewCountWord: string = NUMBER_WORDS[team.length] ?? String(team.length);

/**
 * Rendered under the crew grid. A public statement of who holds which
 * role on this project — keep in sync with the roster above.
 */
export const leadershipNote =
  "This project has no president. Its leads are Eeshan Khandelwal " +
  "(Electronics & Software), Vidu Senadheera and David Cho (Mechanical), " +
  "Aryan Khanna (Physics Calculations), and Tristan Schaefer (Outreach). " +
  "Neel Chhatrala, Ibrahim Hasan and Lenar Khusiainov are electronics " +
  "members, Ishaan Sakariya and Dominic Reouk are mechanical members, and " +
  "Sophie Weng is an outreach member.";
