export interface TeamMember {
  name: string;
  role: string;
  initials: string;
  color: string;
  image?: string;
}

export const team: TeamMember[] = [
  {
    name: "Eeshan Khandelwal",
    role: "Software & Electronics Lead",
    initials: "EK",
    color: "#3b82f6",
    image: "/team/eeshan.jpg",
  },
  {
    name: "Aryan Khanna",
    role: "Club President",
    initials: "AK",
    color: "#7c3aed",
    image: "/team/aryan_khanna.jpg",
  },
  {
    name: "Vidu Senadheera",
    role: "Mechanical Lead",
    initials: "VS",
    color: "#06b6d4",
    image: "/team/vidu.jpg",
  },
  {
    name: "Neel Chhatrala",
    role: "Electrical Member",
    initials: "NC",
    color: "#f59e0b",
    image: "/team/neel.jpg",
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
    name: "Ishaan Sakariya",
    role: "Mechanical & Software Member",
    initials: "IS",
    color: "#f97316",
    image: "/team/ishaan.jpg",
  },
];
