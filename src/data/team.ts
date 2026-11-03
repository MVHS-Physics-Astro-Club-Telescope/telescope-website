export interface TeamMember {
  name: string;
  role: string;
  /** "lead" members are listed first and carry a named responsibility. */
  tier: "lead" | "member";
  image?: string;
}

/**
 * Roster as of 2026-11-02. Leads first, then members grouped by discipline.
 * Every recruit from the fall 2026 new-member form is listed (Eeshan,
 * 2026-11-02); `image` is optional and anyone without one shows the default
 * avatar until they send a photo.
 * Eeshan is the sole Electronics & Software lead; Neel is an electronics
 * member (lead title removed 2026-11-02 at Eeshan's instruction).
 * Roles are a public statement of who holds what on this project; the
 * member half of `leadershipNote` below is generated from this list.
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
    name: "Sebastian Lawrence",
    role: "Electronics",
    tier: "member",
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
    name: "Aadi Kesari",
    role: "Mechanical",
    tier: "member",
  },
  {
    name: "Isaac Rhee",
    role: "Mechanical",
    tier: "member",
  },
  {
    name: "Ming-Yang Jiang",
    role: "Mechanical",
    tier: "member",
  },
  {
    name: "Nathaniel Krasic",
    role: "Mechanical",
    tier: "member",
  },
  {
    name: "Omar Ansari",
    role: "Mechanical",
    tier: "member",
  },
  {
    name: "Omer Har Gil",
    role: "Mechanical",
    tier: "member",
  },
  {
    name: "Yarin Baum",
    role: "Mechanical",
    tier: "member",
  },
  {
    name: "Yuvan Shankar",
    role: "Software",
    tier: "member",
  },
  {
    name: "Sophie Weng",
    role: "Outreach",
    tier: "member",
    image: "/team/sophie.jpg",
  },
  {
    name: "Edison Liu",
    role: "Outreach",
    tier: "member",
    image: "/team/edison.jpg",
  },
  {
    name: "Maya Rinn",
    role: "PR",
    tier: "member",
  },
  {
    name: "Laura S.",
    role: "PR",
    tier: "member",
  },
  {
    name: "Anaaya Mashru",
    role: "PR",
    tier: "member",
  },
];

const ONES = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
  "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
  "seventeen", "eighteen", "nineteen",
];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

function numberWord(n: number): string {
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? `-${ONES[n % 10]}` : "");
  return String(n);
}

/**
 * How many students the site says built the telescope, as words
 * ("twenty-one"). Derived from the roster so the crew heading, the home story
 * and the site description can never disagree with the grid.
 */
export const crewCountWord: string = numberWord(team.length);

/** "A", "A and B", "A, B and C" */
function listNames(names: string[]): string {
  return names.length < 2 ? names.join("") : `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`;
}

const MEMBER_GROUPS: [role: string, word: string][] = [
  ["Electronics", "electronics"],
  ["Mechanical", "mechanical"],
  ["Software", "software"],
  ["Outreach", "outreach"],
  ["PR", "PR"],
];

/** "X and Y are electronics members; Z is a software member; and ..." */
const memberClauses = MEMBER_GROUPS.map(([role, word]) => {
  const names = team.filter((m) => m.tier === "member" && m.role === role).map((m) => m.name);
  if (names.length === 0) return null;
  // "an electronics/outreach member", "a mechanical/software/PR member"
  const article = /^[aeiou]/.test(word) ? "an" : "a";
  return names.length === 1
    ? `${names[0]} is ${article} ${word} member`
    : `${listNames(names)} are ${word} members`;
}).filter((c): c is string => c !== null);

/**
 * Rendered under the crew grid. A public statement of who holds which
 * role on this project. The leads sentence is written by hand; the members
 * sentence is built from the roster so it cannot drift from the grid.
 */
export const leadershipNote =
  "This project has no president. Its leads are Eeshan Khandelwal " +
  "(Electronics & Software), Vidu Senadheera and David Cho (Mechanical), " +
  "Aryan Khanna (Physics Calculations), and Tristan Schaefer (Outreach). " +
  (memberClauses.length > 1
    ? `${memberClauses.slice(0, -1).join("; ")}; and ${memberClauses.at(-1)}.`
    : `${memberClauses.join("")}.`);
