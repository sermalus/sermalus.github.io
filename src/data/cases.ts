import type { Lang } from "../i18n";

export interface CaseImage {
  src: string;
  alt: string;
}

export interface CaseSection {
  id: string;
  title: { en: string; ru: string };
  items: CaseImage[];
}

export interface CaseStudyData {
  id: "cold-war" | "stec";
  title: string;
  icon: string;
  cover: string;
  role: { en: string; ru: string };
  summary: { en: string; ru: string };
  meta: {
    en: Array<{ label: string; value: string }>;
    ru: Array<{ label: string; value: string }>;
  };
  quote: {
    en: { text: string; author: string };
    ru: { text: string; author: string };
  };
  links: Array<{ label: { en: string; ru: string }; href: string }>;
  nextCase: { id: "cold-war" | "stec"; title: string };
  sections: CaseSection[];
}

export const CASE_STUDIES: Record<"cold-war" | "stec", CaseStudyData> = {
  "cold-war": {
    id: "cold-war",
    title: "COLD WAR",
    icon: "/assets/cold-war-icon.png",
    cover: "/assets/covers/coldwar.webp",
    role: {
      en: "Senior Contributor · Grip Studios",
      ru: "Senior Contributor · Grip Studios",
    },
    summary: {
      en: "1980s–90s alt-history Roblox shooter — designed in-world commercial branding, McDowald's menu boards, bilingual military signage, and propaganda posters across Valley View, Fulda Gap, and Vavidas.",
      ru: "Альтернативно-исторический Roblox-шутер 1980–90-х — внутриигровая реклама, меню McDowald's, двуязычные военные таблички и агитационные постеры для карт Valley View, Fulda Gap и Vavidas.",
    },
    meta: {
      en: [
        { label: "Period", value: "2025 – Present" },
        { label: "Tools", value: "Figma · Affinity" },
        { label: "Works", value: "21 assets" },
      ],
      ru: [
        { label: "Период", value: "2025 – сейчас" },
        { label: "Софт", value: "Figma · Affinity" },
        { label: "Работ", value: "21 ассет" },
      ],
    },
    quote: {
      en: {
        text: "Easy to work with, fast to respond and generally a nice person. I highly recommend him for his good working attitude.",
        author: "popkid56 · Team Lead, Cold War",
      },
      ru: {
        text: "С ним приятно и легко работать: быстро отвечает и всегда на связи. Однозначно рекомендую за ответственный подход к задачам.",
        author: "popkid56 · Тимлид, Cold War",
      },
    },
    links: [
      {
        label: { en: "Roblox Game", ru: "Игра в Roblox" },
        href: "https://www.roblox.com/games/13687899540/Cold-War",
      },
      {
        label: { en: "Community", ru: "Сообщество" },
        href: "https://www.roblox.com/communities/32519006",
      },
    ],
    nextCase: { id: "stec", title: "STEC" },
    sections: [
      {
        id: "cw-commercial",
        title: { en: "Commercial & Banners", ru: "Реклама и баннеры" },
        items: [
          { src: "/assets/cases/cold-war/banner-builders.webp", alt: "Valley View — Builders banner" },
          { src: "/assets/cases/cold-war/banner-mc.webp", alt: "Valley View — McDowald's banner" },
          { src: "/assets/cases/cold-war/banner-glasses.webp", alt: "Valley View — Glasses banner" },
          { src: "/assets/cases/cold-war/banner-bettercall.webp", alt: "Valley View — Better Call banner" },
          { src: "/assets/cases/cold-war/banner-adrentger.webp", alt: "Fulda Gap — Adrentger banner" },
          { src: "/assets/cases/cold-war/banner-anvelopp.webp", alt: "Fulda Gap — Anvelopp banner" },
          { src: "/assets/cases/cold-war/banner-gymger.webp", alt: "Fulda Gap — Gymger banner" },
          { src: "/assets/cases/cold-war/wallposter-mitosubhi.webp", alt: "Fulda Gap — Mitosubhi wall poster" },
        ],
      },
      {
        id: "cw-mcdowalds",
        title: { en: "McDowald's Series", ru: "Серия McDowald's" },
        items: [
          { src: "/assets/cases/cold-war/mc-ingame-counter.webp", alt: "McDowald's in-game counter & menu boards" },
          { src: "/assets/cases/cold-war/mc-ingame-drivethru.webp", alt: "McDowald's drive-thru sign in-game" },
          { src: "/assets/cases/cold-war/mc-poster-bigmeal.webp", alt: "McDowald's Big Meal poster" },
          { src: "/assets/cases/cold-war/mc-poster-beefsteak.webp", alt: "McDowald's Beefsteak poster" },
          { src: "/assets/cases/cold-war/mc-poster-toy.webp", alt: "McDowald's Toy poster" },
          { src: "/assets/cases/cold-war/mc-poster-cola.webp", alt: "McDowald's Cola poster" },
          { src: "/assets/cases/cold-war/mc-poster-jimmy.webp", alt: "McDowald's Jimmy poster" },
        ],
      },
      {
        id: "cw-posters",
        title: { en: "Posters & Signage", ru: "Постеры и таблички" },
        items: [
          { src: "/assets/cases/cold-war/poster-viva-che.webp", alt: "Vavidas, Cuba — Viva Che poster" },
          { src: "/assets/cases/cold-war/poster-26.webp", alt: "Vavidas, Cuba — 26 de Julio poster" },
          { src: "/assets/cases/cold-war/poster-afga.webp", alt: "Fulda Gap — AFGA poster" },
          { src: "/assets/cases/cold-war/poster-stein.webp", alt: "Fulda Gap — Stein poster" },
          { src: "/assets/cases/cold-war/signage-equipment.webp", alt: "Bilingual military equipment signage" },
          { src: "/assets/cases/cold-war/signage-nocamping.webp", alt: "No Camping warning sign" },
        ],
      },
    ],
  },

  stec: {
    id: "stec",
    title: "STEC",
    icon: "/assets/stec-icon.png",
    cover: "/assets/covers/stec.webp",
    role: {
      en: "Senior Contributor · Media Office",
      ru: "Senior Contributor · Media Office",
    },
    summary: {
      en: "Stratocratic Engineering Corps & AFCS Media Office — recruitment & faction posters, retro commercial ads, product packaging, visual guides, and vector killfeed UI icons for a 20,000+ member community.",
      ru: "Stratocratic Engineering Corps и AFCS Media Office — агитационные и фракционные постеры, ретро-реклама, упаковка, гайды и векторные UI-иконки для комьюнити 20 000+ участников.",
    },
    meta: {
      en: [
        { label: "Scale", value: "20k+ members" },
        { label: "Tools", value: "Figma · Affinity" },
        { label: "Works", value: "18 assets" },
      ],
      ru: [
        { label: "Масштаб", value: "20k+ участников" },
        { label: "Софт", value: "Figma · Affinity" },
        { label: "Работ", value: "18 ассетов" },
      ],
    },
    quote: {
      en: {
        text: "Quick and skilled contributor who shows a great and unique touch for graphic design. Both active and highly capable.",
        author: "Dipstick (@hvzel_dip) · STEC Department Head",
      },
      ru: {
        text: "Быстрый и сильный участник команды с отличным чувством графического дизайна. Активный и надёжный специалист.",
        author: "Dipstick (@hvzel_dip) · Руководитель отдела STEC",
      },
    },
    links: [
      {
        label: { en: "STEC Community", ru: "Сообщество STEC" },
        href: "https://www.roblox.com/communities/947666928/Stratocratic-Engineering-Corps#!/about",
      },
      {
        label: { en: "AFCS Community", ru: "Сообщество AFCS" },
        href: "https://www.roblox.com/communities/35979610/AFCS-Atrian-Federal-Correctional-Services#!/about",
      },
    ],
    nextCase: { id: "cold-war", title: "COLD WAR" },
    sections: [
      {
        id: "stec-afcs",
        title: { en: "AFCS Posters", ru: "Постеры AFCS" },
        items: [
          { src: "/assets/cases/stec/afcs-poster-1.webp", alt: "AFCS Poster 1" },
          { src: "/assets/cases/stec/afcs-poster-2.webp", alt: "AFCS Poster 2" },
          { src: "/assets/cases/stec/afcs-poster-3.webp", alt: "AFCS Poster 3" },
          { src: "/assets/cases/stec/afcs-poster-4.webp", alt: "AFCS Poster 4" },
          { src: "/assets/cases/stec/afcs-recruitment.webp", alt: "AFCS Recruitment poster" },
        ],
      },
      {
        id: "stec-military",
        title: { en: "Military & Faction Posters", ru: "Военные и фракционные постеры" },
        items: [
          { src: "/assets/cases/stec/n1-poster-1.webp", alt: "N1 Poster #1" },
          { src: "/assets/cases/stec/gsmc-poster-1.webp", alt: "GSMC Poster #1" },
          { src: "/assets/cases/stec/fairzone-1.webp", alt: "Infantry Fairzone — Centurion Shoreline v1" },
          { src: "/assets/cases/stec/fairzone-2.webp", alt: "Infantry Fairzone — Centurion Shoreline v2" },
        ],
      },
      {
        id: "stec-commercial",
        title: { en: "Commercial & Packaging", ru: "Реклама и упаковка" },
        items: [
          { src: "/assets/cases/stec/noobic-detergent.webp", alt: "Noobic Detergent packaging" },
          { src: "/assets/cases/stec/briktek-ad.webp", alt: "BrikTek 60s Story print ad" },
          { src: "/assets/cases/stec/iron-shark.webp", alt: "Iron Shark Academy flyer" },
          { src: "/assets/cases/stec/bloxy-cola-ad.webp", alt: "Bloxy Cola retro ad" },
          { src: "/assets/cases/stec/bloxy-vending.webp", alt: "Bloxy Cola vending machine in-game" },
        ],
      },
      {
        id: "stec-ui",
        title: { en: "UI, Guides & Icons", ru: "UI, гайды и иконки" },
        items: [
          { src: "/assets/cases/stec/color-guide.webp", alt: "Noobic Color Guide #1" },
          { src: "/assets/cases/stec/units-sheet.webp", alt: "Units visual sheet" },
          { src: "/assets/cases/stec/killfeed-ingame.webp", alt: "Killfeed HUD icons in-game" },
          { src: "/assets/cases/stec/killfeed-icons.webp", alt: "Vector killfeed icon set" },
        ],
      },
    ],
  },
};

export function getCaseText(lang: Lang) {
  return lang === "ru"
    ? {
        home: "Главная",
        fullPdf: "Полный PDF",
        nextProject: "Следующий проект",
        prevAria: "Прокрутить влево",
        nextAria: "Прокрутить вправо",
        closeLightbox: "Закрыть просмотр",
        prevImg: "Предыдущая работа",
        nextImg: "Следующая работа",
      }
    : {
        home: "Home",
        fullPdf: "Full PDF",
        nextProject: "Next project",
        prevAria: "Scroll left",
        nextAria: "Scroll right",
        closeLightbox: "Close preview",
        prevImg: "Previous image",
        nextImg: "Next image",
      };
}
