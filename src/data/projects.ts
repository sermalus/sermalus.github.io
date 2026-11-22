export interface ProjectLink {
  label: string;
  href: string;
}

export interface ProjectQuote {
  text: string;
  author: string;
}

export interface ProjectPreview {
  src: string;
  alt: string;
  page: number;
}

export interface ProjectMeta {
  label: string;
  value: string;
}

export interface ProjectItem {
  id: "my-projects" | "cold-war" | "stec" | "hellmet";
  title: string;
  shortDesc: string;
  ctaLabel: string;
  icon?: string;
  cover?: string;
  href?: string;
  caseId?: "cold-war" | "stec";
  role?: string;
  status?: "active" | "placeholder";
  contextLine?: string;
  meta?: ProjectMeta[];
  deliverables?: string[];
  previews?: ProjectPreview[];
  portfolioPage?: number;
  workCount?: number;
  links?: ProjectLink[];
  quote?: ProjectQuote;
}

export const CONTACTS = [
  {
    id: "discord" as const,
    label: "Discord",
    handle: "@sermalus",
    copyValue: "sermalus",
  },
  {
    id: "telegram" as const,
    label: "Telegram",
    handle: "@sermalus",
    copyValue: "@sermalus",
    href: "https://t.me/sermalus",
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: "my-projects",
    title: "PORTFOLIO",
    shortDesc: "Brand identity, logos & full 68-page PDF.",
    ctaLabel: "Open PDF",
    href: "/portfolio/",
  },
  {
    id: "cold-war",
    title: "COLD WAR",
    shortDesc: "1980s–90s alt-history game graphics & worldbuilding.",
    ctaLabel: "Open gallery",
    icon: "/assets/cold-war-icon.png",
    caseId: "cold-war",
    role: "Senior Contributor · Grip Studios",
    status: "active",
    contextLine:
      "1980s–90s alt-history Roblox shooter — designed in-world commercial branding, bilingual military signage, and environment posters.",
    meta: [
      { label: "Period", value: "2025 – Present" },
      { label: "Tools", value: "Figma · Affinity" },
      { label: "Works", value: "21 assets" },
    ],
    deliverables: [
      "Commercial signage",
      "Military & propaganda posters",
      "McDowald's menu series",
      "Prop textures",
    ],
    previews: [
      { src: "/assets/previews/cw-1.webp", alt: "Cold War retro food ad", page: 35 },
      { src: "/assets/previews/cw-2.webp", alt: "Bilingual military signage", page: 44 },
      { src: "/assets/previews/cw-3.webp", alt: "In-game menu boards", page: 47 },
    ],
    portfolioPage: 31,
    workCount: 21,
    links: [
      {
        label: "Roblox Game",
        href: "https://www.roblox.com/games/13687899540/Cold-War",
      },
      {
        label: "Community",
        href: "https://www.roblox.com/communities/32519006",
      },
    ],
    quote: {
      text: "Easy to work with, fast to respond and generally a nice person. I highly recommend him for his good working attitude.",
      author: "popkid56 · Team Lead, Cold War",
    },
  },
  {
    id: "stec",
    title: "STEC",
    shortDesc: "Development & game design studio for a 20k+ community.",
    ctaLabel: "Open gallery",
    icon: "/assets/stec-icon.png",
    caseId: "stec",
    role: "Senior Contributor · Media Office",
    status: "active",
    contextLine:
      "Stratocratic Engineering Corps & AFCS Media Office — created recruitment posters, retro commercial ads, map graphics, and vector UI icons.",
    meta: [
      { label: "Scale", value: "20k+ members" },
      { label: "Tools", value: "Figma · Affinity" },
      { label: "Works", value: "18 assets" },
    ],
    deliverables: [
      "AFCS & faction posters",
      "Commercial ads & packaging",
      "Vector UI icons",
      "Color & unit guides",
    ],
    previews: [
      { src: "/assets/previews/stec-1.webp", alt: "STEC recruitment posters", page: 51 },
      { src: "/assets/previews/stec-2.webp", alt: "Retro Bloxy Cola ad", page: 55 },
      { src: "/assets/previews/stec-3.webp", alt: "Vector killfeed UI icons", page: 62 },
    ],
    portfolioPage: 49,
    workCount: 18,
    links: [
      {
        label: "STEC",
        href: "https://www.roblox.com/communities/947666928/Stratocratic-Engineering-Corps#!/about",
      },
      {
        label: "AFCS",
        href: "https://www.roblox.com/communities/35979610/AFCS-Atrian-Federal-Correctional-Services#!/about",
      },
    ],
    quote: {
      text: "Quick and skilled contributor who shows a great and unique touch for graphic design. Both active and highly capable.",
      author: "Dipstick (@hvzel_dip) · STEC Department Head",
    },
  },
  {
    id: "hellmet",
    title: "HELLMET",
    shortDesc: "Current project · Case study coming soon.",
    ctaLabel: "Preview",
    icon: "/assets/hellmet-icon.png",
    cover: "/assets/covers/hellmet.webp",
    role: "In Progress",
    status: "placeholder",
    contextLine:
      "Project materials, selected visuals, and dedicated showcase for HELLMET are currently in progress and will be published here soon.",
  },
];
