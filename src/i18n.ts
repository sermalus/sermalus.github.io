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
  },
} as const;

export const PROJECTS_RU: Record<ProjectItem["id"], Partial<ProjectItem>> = {
  "my-projects": {
    shortDesc: "Айдентика, логотипы и полное портфолио (68 сл.).",
    ctaLabel: "Открыть PDF",
  },
  "cold-war": {
    shortDesc: "Графика и визуал окружения для шутера 1980–90-х.",
    ctaLabel: "Подробнее",
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
    ctaLabel: "Подробнее",
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
