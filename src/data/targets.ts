/**
 * Curated catalog of popular observation targets shown in the /request
 * typeahead. Values are realistic but the page is in preview — actual
 * observability windows will be computed live once the telescope is online.
 *
 * Magnitudes from common references. "Best month" is for Bay Area latitude
 * (~37.4° N), evening sky.
 */

export type TargetType =
  | "Galaxy"
  | "Nebula"
  | "Star Cluster"
  | "Planet"
  | "Moon"
  | "Double Star";

export interface Target {
  id: string;
  name: string;
  /** Designations and aliases the typeahead should match */
  aliases: string[];
  type: TargetType;
  magnitude: number | string;
  bestMonth: string;
  /** One-line plain-English description for the preview card */
  description: string;
}

export const targets: Target[] = [
  {
    id: "m31",
    name: "Andromeda Galaxy (M31)",
    aliases: ["m31", "andromeda", "ngc 224"],
    type: "Galaxy",
    magnitude: 3.4,
    bestMonth: "October",
    description:
      "The nearest large spiral galaxy, 2.5 million light-years away — and our future collision partner.",
  },
  {
    id: "m42",
    name: "Orion Nebula (M42)",
    aliases: ["m42", "orion nebula", "ngc 1976"],
    type: "Nebula",
    magnitude: 4.0,
    bestMonth: "January",
    description:
      "A stellar nursery in Orion's sword, visible to the naked eye on dark nights.",
  },
  {
    id: "m45",
    name: "Pleiades (M45)",
    aliases: ["m45", "pleiades", "seven sisters"],
    type: "Star Cluster",
    magnitude: 1.6,
    bestMonth: "December",
    description:
      "Open cluster of hot blue stars wrapped in faint reflection nebulosity.",
  },
  {
    id: "m13",
    name: "Hercules Cluster (M13)",
    aliases: ["m13", "hercules cluster", "great cluster"],
    type: "Star Cluster",
    magnitude: 5.8,
    bestMonth: "July",
    description:
      "A globular cluster of several hundred thousand stars on the edge of our galaxy's halo.",
  },
  {
    id: "m27",
    name: "Dumbbell Nebula (M27)",
    aliases: ["m27", "dumbbell", "ngc 6853"],
    type: "Nebula",
    magnitude: 7.5,
    bestMonth: "August",
    description:
      "A dying Sun-like star sloughing off its outer atmosphere into a colorful planetary nebula.",
  },
  {
    id: "m57",
    name: "Ring Nebula (M57)",
    aliases: ["m57", "ring nebula", "ngc 6720"],
    type: "Nebula",
    magnitude: 8.8,
    bestMonth: "August",
    description:
      "A perfect smoke ring of ionized gas, the leftover atmosphere of a dead star.",
  },
  {
    id: "m51",
    name: "Whirlpool Galaxy (M51)",
    aliases: ["m51", "whirlpool", "ngc 5194"],
    type: "Galaxy",
    magnitude: 8.4,
    bestMonth: "May",
    description:
      "Two galaxies caught mid-collision — a face-on spiral being pulled apart by a smaller companion.",
  },
  {
    id: "m81",
    name: "Bode's Galaxy (M81)",
    aliases: ["m81", "bode", "ngc 3031"],
    type: "Galaxy",
    magnitude: 6.9,
    bestMonth: "April",
    description:
      "A bright grand-design spiral in Ursa Major, 12 million light-years away.",
  },
  {
    id: "m82",
    name: "Cigar Galaxy (M82)",
    aliases: ["m82", "cigar galaxy", "ngc 3034"],
    type: "Galaxy",
    magnitude: 8.4,
    bestMonth: "April",
    description:
      "A starburst galaxy throwing red plumes of hydrogen out of its core.",
  },
  {
    id: "m104",
    name: "Sombrero Galaxy (M104)",
    aliases: ["m104", "sombrero", "ngc 4594"],
    type: "Galaxy",
    magnitude: 8.0,
    bestMonth: "May",
    description:
      "An edge-on spiral galaxy with a thick dark dust lane bisecting its glowing core.",
  },
  {
    id: "m1",
    name: "Crab Nebula (M1)",
    aliases: ["m1", "crab nebula", "ngc 1952"],
    type: "Nebula",
    magnitude: 8.4,
    bestMonth: "January",
    description:
      "The wreckage of a supernova witnessed by Chinese astronomers in 1054.",
  },
  {
    id: "m8",
    name: "Lagoon Nebula (M8)",
    aliases: ["m8", "lagoon nebula", "ngc 6523"],
    type: "Nebula",
    magnitude: 6.0,
    bestMonth: "August",
    description:
      "A vast star-forming region in Sagittarius, glowing red with hydrogen-alpha.",
  },
  {
    id: "m17",
    name: "Omega Nebula (M17)",
    aliases: ["m17", "omega nebula", "swan nebula", "ngc 6618"],
    type: "Nebula",
    magnitude: 6.0,
    bestMonth: "August",
    description:
      "A bright emission nebula sometimes called the Swan for its swooping shape.",
  },
  {
    id: "m20",
    name: "Trifid Nebula (M20)",
    aliases: ["m20", "trifid", "ngc 6514"],
    type: "Nebula",
    magnitude: 6.3,
    bestMonth: "August",
    description:
      "A star-forming region with three dark dust lanes carving it into pieces.",
  },
  {
    id: "ngc7000",
    name: "North America Nebula (NGC 7000)",
    aliases: ["ngc 7000", "north america nebula", "caldwell 20"],
    type: "Nebula",
    magnitude: 4.0,
    bestMonth: "September",
    description:
      "A huge emission nebula in Cygnus shaped uncannily like North America.",
  },
  {
    id: "double-cluster",
    name: "Double Cluster (NGC 869 & 884)",
    aliases: ["double cluster", "ngc 869", "ngc 884", "h chi persei"],
    type: "Star Cluster",
    magnitude: 4.3,
    bestMonth: "November",
    description:
      "Two open clusters in Perseus that share the same eyepiece — a guaranteed crowd-pleaser.",
  },
  {
    id: "albireo",
    name: "Albireo (β Cygni)",
    aliases: ["albireo", "beta cygni"],
    type: "Double Star",
    magnitude: 3.1,
    bestMonth: "August",
    description:
      "A gold-and-blue double star — the most beautiful color contrast in the night sky.",
  },
  {
    id: "moon",
    name: "Moon",
    aliases: ["moon", "luna"],
    type: "Moon",
    magnitude: -12.7,
    bestMonth: "Any month",
    description:
      "Our nearest neighbor — craters, mare, and rilles in startling detail.",
  },
  {
    id: "jupiter",
    name: "Jupiter",
    aliases: ["jupiter"],
    type: "Planet",
    magnitude: -2.5,
    bestMonth: "November",
    description:
      "Cloud bands, the Great Red Spot, and the four Galilean moons in transit.",
  },
  {
    id: "saturn",
    name: "Saturn",
    aliases: ["saturn"],
    type: "Planet",
    magnitude: 0.5,
    bestMonth: "September",
    description:
      "The ringed jewel of the solar system — never disappoints, never gets old.",
  },
  {
    id: "mars",
    name: "Mars",
    aliases: ["mars"],
    type: "Planet",
    magnitude: -1.0,
    bestMonth: "Varies (opposition)",
    description:
      "Polar caps and surface markings visible during favorable oppositions.",
  },
  {
    id: "venus",
    name: "Venus",
    aliases: ["venus"],
    type: "Planet",
    magnitude: -4.5,
    bestMonth: "Varies",
    description:
      "Phases like the Moon — Galileo's observation that overturned the geocentric model.",
  },
  {
    id: "uranus",
    name: "Uranus",
    aliases: ["uranus"],
    type: "Planet",
    magnitude: 5.7,
    bestMonth: "October",
    description:
      "A pale blue-green disk at the edge of the solar system's classical worlds.",
  },
  {
    id: "neptune",
    name: "Neptune",
    aliases: ["neptune"],
    type: "Planet",
    magnitude: 7.8,
    bestMonth: "September",
    description:
      "The deep-blue ice giant — a small but unmistakable disk under steady seeing.",
  },
  {
    id: "ngc6960",
    name: "Veil Nebula (NGC 6960)",
    aliases: ["ngc 6960", "veil nebula", "western veil", "witch's broom"],
    type: "Nebula",
    magnitude: 7.0,
    bestMonth: "September",
    description:
      "Delicate filaments of a 10,000-year-old supernova remnant in Cygnus.",
  },
];

/** Case-insensitive substring match against name + aliases. */
export function searchTargets(query: string, limit = 8): Target[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const hits = targets.filter((t) => {
    if (t.name.toLowerCase().includes(q)) return true;
    return t.aliases.some((a) => a.toLowerCase().includes(q));
  });
  return hits.slice(0, limit);
}
