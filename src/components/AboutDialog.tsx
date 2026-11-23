import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, Copy, X } from "lucide-react";
import { toast } from "sonner";
import { ABOUT_COPY, UI_COPY, type Lang } from "../i18n";

interface AboutDialogProps {
  open: boolean;
  lang: Lang;
  onClose: () => void;
}

export function AboutDialog({ open, lang, onClose }: AboutDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [copiedDiscord, setCopiedDiscord] = useState(false);
  const copy = ABOUT_COPY[lang];
  const ui = UI_COPY[lang];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

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

  const handleCopyDiscord = async () => {
    try {
      await navigator.clipboard.writeText("sermalus");
      setCopiedDiscord(true);
      toast.success(ui.copiedToast("Discord"), { description: "sermalus" });
      window.setTimeout(() => setCopiedDiscord(false), 1800);
    } catch {
      toast.error(ui.copyError);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="project-dialog about-dialog"
      {...({ closedby: "any" } as Record<string, string>)}
      aria-labelledby="about-dialog-title"
      onClose={() => {
        if (dialogRef.current) dialogRef.current.returnValue = "";
        onClose();
      }}
    >
      {open && (
        <div className="about-body">
          <header className="about-head">
            <div className="about-identity">
              <div className="about-mark" aria-hidden="true">
                <svg viewBox="0 0 40 40" width="22" height="22" fill="none">
                  <path
                    d="M26.5 13.6c-1.2-1.1-3-1.8-5.6-1.8-3.7 0-5.9 1.7-5.9 4.3 0 2.4 1.8 3.6 5.2 4.3l2 .4c2.3.4 3.4 1.1 3.4 2.4 0 1.5-1.5 2.6-4.2 2.6-2.5 0-4.5-.9-5.8-2.3l-1.9 2c1.7 1.9 4.3 3 7.7 3 4.4 0 7.1-2.1 7.1-5.2 0-2.6-1.8-4.2-5.6-4.9l-2-.4c-2.2-.4-3.2-1.1-3.2-2.2 0-1.2 1.2-2.1 3.2-2.1 2 0 3.4.6 4.5 1.5l2.1-1.6Z"
                    fill="#E8EAED"
                  />
                </svg>
              </div>
              <div>
                <h2 id="about-dialog-title" className="about-name">
                  Sermalus
                </h2>
                <p className="about-role">{copy.role}</p>
              </div>
            </div>

            <form method="dialog">
              <button
                type="submit"
                className="about-close"
                aria-label={copy.closeAria}
                autoFocus
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            </form>
          </header>

          <p className="about-bio">{copy.aboutText}</p>

          <div className="about-divider" aria-hidden="true" />

          <div className="about-columns">
            <section className="about-col">
              <h3 className="about-label">{copy.focusTitle}</h3>
              <ul className="about-list">
                {copy.focusItems.map((item) => (
                  <li className="about-list-item" key={item.title}>
                    <div className="about-item-title">{item.title}</div>
                    <p className="about-item-desc">{item.desc}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="about-col">
              <h3 className="about-label">{copy.skillsTitle}</h3>
              <ul className="about-list">
                {copy.skills.map((skill) => (
                  <li className="about-list-item" key={skill.name}>
                    <div className="about-item-title about-item-title--mono">
                      {skill.name}
                    </div>
                    <p className="about-item-desc">{skill.desc}</p>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="about-divider" aria-hidden="true" />

          <section className="about-reviews-block">
            <h3 className="about-label">{copy.reviewsTitle}</h3>
            <div className="about-quotes">
              {copy.reviews.map((review) => (
                <blockquote className="about-quote" key={review.author}>
                  <p>“{review.text}”</p>
                  <footer>{review.author}</footer>
                </blockquote>
              ))}
            </div>
          </section>

          <footer className="about-footer">
            <a className="about-primary-btn" href="/portfolio/">
              <span>{copy.openPdf}</span>
              <ArrowUpRight size={16} strokeWidth={1.5} />
            </a>

            <div className="about-contacts">
              <button
                type="button"
                className="about-link-btn"
                onClick={handleCopyDiscord}
              >
                {copiedDiscord ? (
                  <Check size={14} strokeWidth={1.5} />
                ) : (
                  <Copy size={14} strokeWidth={1.5} />
                )}
                <span>{copiedDiscord ? ui.copied : "Discord"}</span>
              </button>
              <a
                className="about-link-btn"
                href="https://t.me/sermalus"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Telegram</span>
                <ArrowUpRight size={14} strokeWidth={1.5} />
              </a>
            </div>
          </footer>
        </div>
      )}
    </dialog>
  );
}
