import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  CASE_STUDIES,
  getCaseText,
  type CaseImage,
  type CaseSection,
} from "../data/cases";
import { UI_COPY, type Lang } from "../i18n";

interface CasePageProps {
  caseId: "cold-war" | "stec";
  lang: Lang;
  onToggleLang: () => void;
  onBack: () => void;
  onNavigateCase: (id: "cold-war" | "stec") => void;
}

interface LightboxState {
  items: CaseImage[];
  index: number;
  sectionTitle: string;
}

function CarouselRow({
  section,
  lang,
  onOpenImage,
}: {
  section: CaseSection;
  lang: Lang;
  onOpenImage: (items: CaseImage[], index: number, sectionTitle: string) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const copy = getCaseText(lang);
  const title = section.title[lang];

  const scrollByStep = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const step = Math.max(300, Math.round(el.clientWidth * 0.72));
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section className="case-section" aria-labelledby={`sec-${section.id}`}>
      <div className="case-section-head">
        <div className="case-section-title-wrap">
          <h2 id={`sec-${section.id}`} className="case-section-title">
            {title}
          </h2>
          <span className="case-section-count">
            {String(section.items.length).padStart(2, "0")}
          </span>
        </div>

        <div className="carousel-nav">
          <button
            type="button"
            className="carousel-arrow"
            onClick={() => scrollByStep(-1)}
            aria-label={copy.prevAria}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            className="carousel-arrow"
            onClick={() => scrollByStep(1)}
            aria-label={copy.nextAria}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="carousel-track" ref={trackRef}>
        {section.items.map((item, idx) => (
          <button
            key={item.src}
            type="button"
            className="carousel-item"
            onClick={() => onOpenImage(section.items, idx, title)}
            aria-label={item.alt}
          >
            <img
              src={item.src}
              alt={item.alt}
              loading="lazy"
              decoding="async"
            />
          </button>
        ))}
      </div>
    </section>
  );
}

export function CasePage({
  caseId,
  lang,
  onToggleLang,
  onBack,
  onNavigateCase,
}: CasePageProps) {
  const data = CASE_STUDIES[caseId];
  const copy = getCaseText(lang);
  const ui = UI_COPY[lang];
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [caseId]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (lightbox && !dialog.open) {
      dialog.showModal();
    } else if (!lightbox && dialog.open) {
      dialog.close();
    }
  }, [lightbox]);

  useEffect(() => {
    if (!lightbox) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setLightbox((curr) =>
          curr
            ? { ...curr, index: (curr.index + 1) % curr.items.length }
            : null
        );
      } else if (e.key === "ArrowLeft") {
        setLightbox((curr) =>
          curr
            ? {
                ...curr,
                index: (curr.index - 1 + curr.items.length) % curr.items.length,
              }
            : null
        );
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightbox]);

  // Fallback light-dismiss for Safari / browsers without closedby="any"
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || "closedBy" in HTMLDialogElement.prototype) return;

    const isOutside = (e: PointerEvent) => {
      const r = dialog.getBoundingClientRect();
      return (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      );
    };
    let pressedOutside = false;
    const onDown = (e: PointerEvent) => {
      pressedOutside = isOutside(e);
    };
    const onUp = (e: PointerEvent) => {
      if (pressedOutside && isOutside(e)) dialog.close();
    };
    dialog.addEventListener("pointerdown", onDown);
    dialog.addEventListener("pointerup", onUp);
    return () => {
      dialog.removeEventListener("pointerdown", onDown);
      dialog.removeEventListener("pointerup", onUp);
    };
  }, []);

  const currentImg = lightbox ? lightbox.items[lightbox.index] : null;

  return (
    <div className="case-shell">
      <header className="case-topbar">
        <div className="site-width case-topbar-inner">
          <div className="case-topbar-left">
            <button
              type="button"
              className="case-back-pill"
              onClick={onBack}
            >
              <ArrowLeft size={15} />
              <span>{copy.home}</span>
            </button>
            <span className="case-topbar-sep" aria-hidden="true" />
            <img
              src={data.icon}
              alt=""
              className="case-topbar-icon"
              width={26}
              height={26}
            />
            <span className="case-topbar-name">{data.title}</span>
          </div>

          <div className="case-topbar-right">
            <button
              type="button"
              className="lang-chip"
              onClick={onToggleLang}
              aria-label={ui.switchLangAria}
            >
              <span className={lang === "en" ? "is-current" : ""}>EN</span>
              <span className="lang-sep" aria-hidden="true">/</span>
              <span className={lang === "ru" ? "is-current" : ""}>RU</span>
            </button>
          </div>
        </div>
      </header>

      <main className="site-width case-main">
        <div className="case-hero-cover">
          <img src={data.cover} alt={`${data.title} cover`} />
        </div>

        <div className="case-intro">
          <div className="case-intro-head">
            <div>
              <span className="dialog-role">{data.role[lang]}</span>
              <h1 className="case-h1">{data.title}</h1>
            </div>

            <div className="case-ext-links">
              {data.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="case-ext-pill"
                >
                  <span>{link.label[lang]}</span>
                  <ArrowUpRight size={14} />
                </a>
              ))}
            </div>
          </div>

          <p className="case-summary">{data.summary[lang]}</p>

          <dl className="dialog-meta-bar case-meta-bar">
            {data.meta[lang].map((m) => (
              <div className="dialog-meta-cell" key={m.label}>
                <dt>{m.label}</dt>
                <dd>{m.value}</dd>
              </div>
            ))}
          </dl>

          <blockquote className="dialog-quote">
            <p>“{data.quote[lang].text}”</p>
            <footer>— {data.quote[lang].author}</footer>
          </blockquote>
        </div>

        <div className="case-sections">
          {data.sections.map((section) => (
            <CarouselRow
              key={section.id}
              section={section}
              lang={lang}
              onOpenImage={(items, index, sectionTitle) =>
                setLightbox({ items, index, sectionTitle })
              }
            />
          ))}
        </div>

        <footer className="case-bottom-nav">
          <button type="button" className="case-back-pill" onClick={onBack}>
            <ArrowLeft size={15} />
            <span>{copy.home}</span>
          </button>

          <div className="case-bottom-right">
            <a href="/portfolio/" className="dialog-text-link">
              <span>{copy.fullPdf}</span>
              <ArrowUpRight size={13} />
            </a>
            <button
              type="button"
              className="dialog-btn dialog-btn--primary"
              onClick={() => onNavigateCase(data.nextCase.id)}
            >
              <span>
                {copy.nextProject}: {data.nextCase.title}
              </span>
              <ArrowUpRight size={15} />
            </button>
          </div>
        </footer>
      </main>

      <dialog
        ref={dialogRef}
        className="gallery-lightbox"
        {...({ closedby: "any" } as Record<string, string>)}
        aria-label={lightbox?.sectionTitle || "Image preview"}
        onClose={() => {
          if (dialogRef.current) dialogRef.current.returnValue = "";
          setLightbox(null);
        }}
      >
        {lightbox && currentImg && (
          <>
            <div className="glb-topbar">
              <span className="glb-counter">
                {lightbox.sectionTitle} · {lightbox.index + 1} /{" "}
                {lightbox.items.length}
              </span>
              <form method="dialog">
                <button
                  type="submit"
                  className="glb-close"
                  aria-label={copy.closeLightbox}
                  autoFocus
                >
                  <X size={18} />
                </button>
              </form>
            </div>

            <div
              className="glb-stage"
              onClick={(e) => {
                if (e.target === e.currentTarget) dialogRef.current?.close();
              }}
            >
              {lightbox.items.length > 1 && (
                <button
                  type="button"
                  className="glb-arrow glb-arrow--left"
                  aria-label={copy.prevImg}
                  onClick={() =>
                    setLightbox((curr) =>
                      curr
                        ? {
                            ...curr,
                            index:
                              (curr.index - 1 + curr.items.length) %
                              curr.items.length,
                          }
                        : null
                    )
                  }
                >
                  <ChevronLeft size={20} />
                </button>
              )}

              <img
                src={currentImg.src}
                alt={currentImg.alt}
                className="glb-img"
              />

              {lightbox.items.length > 1 && (
                <button
                  type="button"
                  className="glb-arrow glb-arrow--right"
                  aria-label={copy.nextImg}
                  onClick={() =>
                    setLightbox((curr) =>
                      curr
                        ? { ...curr, index: (curr.index + 1) % curr.items.length }
                        : null
                    )
                  }
                >
                  <ChevronRight size={20} />
                </button>
              )}
            </div>
          </>
        )}
      </dialog>
    </div>
  );
}
