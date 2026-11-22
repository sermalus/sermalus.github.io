export interface ProjectLink {
  label: string;
  href: string;
}

export interface ProjectQuote {
  text: string;
  author: string;
}

export interface ProjectItem {
  id: "my-projects" | "cold-war" | "stec" | "hellmet";
  title: string;
  shortDesc: string;
  ctaLabel: string;
  icon?: string;
  href?: string;
  role?: string;
  status?: "active" | "placeholder";
  summary?: string;
  portfolioPage?: number;
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
    title: "MY PROJECTS",
    shortDesc: "Brand identity, posters & full 68-page PDF deck.",
    ctaLabel: "Open deck",
    href: "/portfolio/",
  },
  {
    id: "cold-war",
    title: "COLD WAR",
    shortDesc: "1980s–90s alt-history game graphics & worldbuilding.",
    ctaLabel: "Inspect",
    icon: "/assets/cold-war-icon.png",
    role: "Senior Contributor · Grip Studios",
    status: "active",
    summary:
      "An alternate history game set in the 1980s and 1990s depicting a conventional war between NATO forces and the Warsaw Pact. Contributed commercial signage, military & propaganda posters, and in-world environment graphics.",
    portfolioPage: 31,
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
      text: "Working with sermalus is a pleasant experience, easy to work with, fast to respond and generally a nice person. I highly recommend him for his good working attitude.",
      author: "popkid56 · Team Lead, Cold War",
    },
  },
  {
    id: "stec",
    title: "STEC",
    shortDesc: "Development & game design studio for a 20k+ community.",
    ctaLabel: "Inspect",
    icon: "/assets/stec-icon.png",
    role: "Senior Contributor · Media Office",
    status: "active",
    summary:
      "Stratocratic Engineering Corps — a development and game design studio for a community of over 20,000 members. Designed in-game maps graphics, faction iconography, commercial signage, and media assets for STEC and AFCS.",
    portfolioPage: 49,
    links: [
      {
        label: "STEC Community",
        href: "https://www.roblox.com/communities/947666928/Stratocratic-Engineering-Corps#!/about",
      },
      {
        label: "AFCS Community",
        href: "https://www.roblox.com/communities/35979610/AFCS-Atrian-Federal-Correctional-Services#!/about",
      },
    ],
    quote: {
      text: "Sermalus is a quick and skilled contributor who shows a great and unique touch for graphic design. He is both active and highly capable.",
      author: "Dipstick (@hvzel_dip) · STEC Department Head",
    },
  },
  {
    id: "hellmet",
    title: "HELLMET",
    shortDesc: "Current project · Case study coming soon.",
    ctaLabel: "Preview",
    icon: "/assets/hellmet-icon.png",
    role: "In Progress",
    status: "placeholder",
    summary:
      "Project materials, selected visuals, and dedicated PDF showcase for HELLMET are currently being prepared and will be published here soon.",
  },
];
