export interface TeamMember {
  name: string;
  role: string;
  initials: string;
  color: string;
  image?: string;
}

export const team: TeamMember[] = [
  {
    name: "Vidu Senadheera",
    role: "Mechanical Lead",
    initials: "VS",
    color: "#06b6d4",
    image: "/team/vidu.jpg",
  },
  {
    name: "Eeshan Khandelwal",
    role: "Software & Electronics Lead",
    initials: "EK",
    color: "#3b82f6",
    image: "/team/eeshan.jpg",
  },
  {
    name: "David Cho",
    role: "Mechanical Member",
    initials: "DC",
    color: "#10b981",
    image: "/team/david.jpg",
  },
  {
    name: "Tristan Schaefer",
    role: "Outreach",
    initials: "TS",
    color: "#ec4899",
    image: "/team/tristan.jpg",
  },
  {
    name: "Neel Chhatrala",
    role: "Mechanical Member",
    initials: "NC",
    color: "#f59e0b",
    image: "/team/neel.jpg",
  },
  {
    name: "Aryan Khanna",
    role: "General Member",
    initials: "AK",
    color: "#7c3aed",
    image: "/team/aryan_khanna.jpg",
  },
  {
    name: "Ishaan Sakariya",
    role: "Mechanical & Software Member",
    initials: "IS",
    color: "#f97316",
    image: "/team/ishaan.jpg",
  },
];

/**
 * Leadership note rendered under the crew grid (see components/Team.tsx).
 * Keep in sync with the roles above — it is a public statement of who holds
 * which role on this project.
 */
export const leadershipNote = {
  heading: "Roles & leadership",
  body:
    "This project has no president. Its leads are Vidu Senadheera (Mechanical), " +
    "Eeshan Khandelwal (Software & Electronics), and Tristan Schaefer (Outreach). " +
    "Every other member listed above is a general member. Aryan Khanna is a " +
    "general member and does not hold a president or project-lead role on this " +
    "project.",
};
