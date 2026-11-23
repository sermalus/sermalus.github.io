import type { ProjectItem } from "./data/projects";

export type Lang = "en" | "ru";

const STORAGE_KEY = "sermalus-lang";

export function detectInitialLang(): Lang {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "ru") return saved;
  } catch {
    // Ignore storage access errors
  }

  const langs = navigator.languages?.length
    ? navigator.languages
    : [navigator.language || "en"];

  for (const l of langs) {
    const lower = l.toLowerCase();
    if (lower.startsWith("ru")) return "ru";
    if (lower.startsWith("en")) return "en";
  }
  return "en";
}

export function saveLang(lang: Lang) {
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // Ignore storage access errors
  }
}

export const UI_COPY = {
  en: {
    pageTitle: "Sermalus — Graphic Designer",
    subtitle: "Graphic Designer",
    usernameLabel: (platform: string) => `${platform} username`,
    copy: "Copy",
    copied: "Copied",
    copiedToast: (platform: string) => `${platform} copied`,
    copyError: "Could not copy to clipboard",
    openTelegram: "Open in Telegram",
    available: "Available",
    closeDialog: "Close project details",
    viewFullCase: (works?: number) =>
      works ? `Open gallery (${works} works)` : "Open gallery",
    openSlide: (page: number) => `Open slide ${page}`,
    switchLangAria: "Switch language to Russian",
    aboutButton: "About",
  },
  ru: {
    pageTitle: "Sermalus — Графический дизайнер",
    subtitle: "Графический дизайнер",
    usernameLabel: (platform: string) => `Ник в ${platform}`,
    copy: "Копировать",
    copied: "Скопировано",
    copiedToast: (platform: string) => `${platform} скопирован`,
    copyError: "Не удалось скопировать",
    openTelegram: "Открыть в Telegram",
    available: "Открыт к проектам",
    closeDialog: "Закрыть описание проекта",
    viewFullCase: (works?: number) =>
      works ? `Открыть галерею (${works})` : "Открыть галерею",
    openSlide: (page: number) => `Открыть слайд ${page}`,
    switchLangAria: "Переключить язык на английский",
    aboutButton: "Обо мне",
  },
} as const;

export const ABOUT_COPY = {
  en: {
    role: "Graphic Designer · 3+ years",
    closeAria: "Close about modal",
    aboutTitle: "About me",
    aboutText:
      "Graphic designer with 3+ years of hands-on experience creating brand identities, logo systems, and in-game visual assets. I combine clean, structured branding (logo books, merch, community visuals) with detailed worldbuilding graphics (in-game ads, retro posters, signage, packaging, and faction iconography).",
    focusTitle: "Core focus",
    focusItems: [
      {
        title: "Brand & Identity",
        desc: "Logos, visual guidelines, merch, print & community branding",
      },
      {
        title: "Game Environment Graphics",
        desc: "In-world posters, commercial signage, prop textures, faction emblems & vector icons",
      },
    ],
    skillsTitle: "Skills",
    skills: [
      { name: "Figma", desc: "Logo design, brand systems, layouts" },
      { name: "Affinity", desc: "Poster design, print & texture editing" },
    ],
    reviewsTitle: "Team reviews",
    reviews: [
      {
        text: "Easy to work with, fast to respond and generally a nice person. I highly recommend him for his good working attitude.",
        author: "popkid56 · Team Lead, Cold War",
      },
      {
        text: "Quick and skilled contributor who shows a great and unique touch for graphic design. Both active and highly capable.",
        author: "Dipstick (@hvzel_dip) · STEC Department Head",
      },
    ],
    openPdf: "Open full PDF (68p)",
    copyDiscord: "Copy Discord",
  },
  ru: {
    role: "Графический дизайнер · 3+ года опыта",
    closeAria: "Закрыть окно «Обо мне»",
    aboutTitle: "Обо мне",
    aboutText:
      "Графический дизайнер с опытом более 3 лет в создании айдентики, логотипов и внутриигровой графики. Совмещаю чистый структурный брендинг (логобуки, мерч, оформление сообществ) с детальной графикой игровых миров (внутриигровая реклама, ретро-постеры, вывески, упаковка и символика фракций).",
    focusTitle: "Основной фокус",
    focusItems: [
      {
        title: "Брендинг и айдентика",
        desc: "Логотипы, гайдлайны, мерч, полиграфия и оформление комьюнити",
      },
      {
        title: "Игровая графика окружения",
        desc: "Постеры, коммерческие вывески, текстуры пропов, эмблемы фракций и векторные иконки",
      },
    ],
    skillsTitle: "Инструменты",
    skills: [
      { name: "Figma", desc: "Логотипы, бренд-системы, вёрстка и макеты" },
      { name: "Affinity", desc: "Постеры, печать и работа с текстурами" },
    ],
    reviewsTitle: "Отзывы команд",
    reviews: [
      {
        text: "С ним приятно и легко работать: быстро отвечает и всегда на связи. Однозначно рекомендую за ответственный подход к задачам.",
        author: "popkid56 · Тимлид, Cold War",
      },
      {
        text: "Быстрый и сильный участник команды с отличным чувством графического дизайна. Активный и надёжный специалист.",
        author: "Dipstick (@hvzel_dip) · Руководитель отдела STEC",
      },
    ],
    openPdf: "Открыть PDF (68 сл.)",
    copyDiscord: "Скопировать Discord",
  },
} as const;

export const PROJECTS_RU: Record<ProjectItem["id"], Partial<ProjectItem>> = {
  "my-projects": {
    title: "АЙДЕНТИКА И PDF",
    shortDesc: "Айдентика, логотипы и полное портфолио (68 сл.).",
    ctaLabel: "Открыть PDF",
  },
  "cold-war": {
    shortDesc: "Графика и визуал окружения для шутера 1980–90-х.",
    ctaLabel: "Открыть галерею",
    role: "Senior Contributor · Grip Studios",
    contextLine:
      "Альтернативно-исторический Roblox-шутер 1980–90-х — внутриигровая реклама, двуязычные военные таблички и постеры окружения.",
    meta: [
      { label: "Период", value: "2025 – сейчас" },
      { label: "Софт", value: "Figma · Affinity" },
      { label: "Работ", value: "21 ассет" },
    ],
    deliverables: [
      "Коммерческие вывески",
      "Военные и агит-постеры",
      "Меню заведений в игре",
      "Текстуры пропов",
    ],
    links: [
      {
        label: "Игра в Roblox",
        href: "https://www.roblox.com/games/13687899540/Cold-War",
      },
      {
        label: "Сообщество",
        href: "https://www.roblox.com/communities/32519006",
      },
    ],
    quote: {
      text: "С ним приятно и легко работать: быстро отвечает и всегда на связи. Однозначно рекомендую за ответственный подход к задачам.",
      author: "popkid56 · Тимлид, Cold War",
    },
  },
  stec: {
    shortDesc: "Студия разработки и медиа-дизайна для 20k+ комьюнити.",
    ctaLabel: "Открыть галерею",
    role: "Senior Contributor · Media Office",
    contextLine:
      "Stratocratic Engineering Corps и AFCS Media Office — агитационные постеры, ретро-реклама, графика карт и векторные иконки интерфейса.",
    meta: [
      { label: "Масштаб", value: "20k+ участников" },
      { label: "Софт", value: "Figma · Affinity" },
      { label: "Работ", value: "18 ассетов" },
    ],
    deliverables: [
      "Агитационные постеры",
      "Коммерческая реклама",
      "Векторные UI-иконки",
      "Символика фракций",
    ],
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
      text: "Быстрый и сильный участник команды с отличным чувством графического дизайна. Активный и надёжный специалист.",
      author: "Dipstick (@hvzel_dip) · Руководитель отдела STEC",
    },
  },
  hellmet: {
    shortDesc: "Текущий проект · Кейс готовится к публикации.",
    ctaLabel: "Открыть",
    role: "В работе",
    contextLine:
      "Материалы проекта, подборка работ и отдельный PDF-кейс по HELLMET сейчас готовятся и скоро появятся здесь.",
  },
};

export function localizeProject(project: ProjectItem, lang: Lang): ProjectItem {
  if (lang === "en") return project;
  return { ...project, ...PROJECTS_RU[project.id] };
}
