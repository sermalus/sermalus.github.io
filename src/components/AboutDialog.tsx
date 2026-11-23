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
        <div className="dialog-body">
          <div className="dialog-head">
            <div className="dialog-identity">
              <div className="about-mark" aria-hidden="true">
                <svg viewBox="0 0 40 40" width="26" height="26" fill="none">
                  <path
                    d="M26.5 13.6c-1.2-1.1-3-1.8-5.6-1.8-3.7 0-5.9 1.7-5.9 4.3 0 2.4 1.8 3.6 5.2 4.3l2 .4c2.3.4 3.4 1.1 3.4 2.4 0 1.5-1.5 2.6-4.2 2.6-2.5 0-4.5-.9-5.8-2.3l-1.9 2c1.7 1.9 4.3 3 7.7 3 4.4 0 7.1-2.1 7.1-5.2 0-2.6-1.8-4.2-5.6-4.9l-2-.4c-2.2-.4-3.2-1.1-3.2-2.2 0-1.2 1.2-2.1 3.2-2.1 2 0 3.4.6 4.5 1.5l2.1-1.6Z"
                    fill="#E8EAED"
                  />
                </svg>
              </div>
              <div>
                <span className="dialog-role">{copy.role}</span>
                <h2 id="about-dialog-title" className="dialog-title">
                  Sermalus
                </h2>
              </div>
            </div>

            <form method="dialog">
              <button
                type="submit"
                className="dialog-close"
                aria-label={copy.closeAria}
                autoFocus
              >
                <X size={16} />
              </button>
            </form>
          </div>

          <section className="about-section">
            <h3 className="about-label">{copy.aboutTitle}</h3>
            <p className="dialog-copy">{copy.aboutText}</p>
          </section>

          <section className="about-section">
            <h3 className="about-label">{copy.focusTitle}</h3>
            <div className="about-grid">
              {copy.focusItems.map((item) => (
                <div className="about-card" key={item.title}>
                  <div className="about-card-title">{item.title}</div>
                  <p className="about-card-desc">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="about-section">
            <h3 className="about-label">{copy.skillsTitle}</h3>
            <div className="about-skills">
              {copy.skills.map((skill) => (
                <div className="about-skill-row" key={skill.name}>
                  <span className="about-skill-name">{skill.name}</span>
                  <span className="about-skill-desc">{skill.desc}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="about-section">
            <h3 className="about-label">{copy.reviewsTitle}</h3>
            <div className="about-quotes">
              {copy.reviews.map((review) => (
                <blockquote className="dialog-quote" key={review.author}>
                  <p>“{review.text}”</p>
                  <footer>— {review.author}</footer>
                </blockquote>
              ))}
            </div>
          </section>

          <div className="dialog-footer-bar">
            <a className="dialog-btn dialog-btn--primary" href="/portfolio/">
              <span>{copy.openPdf}</span>
              <ArrowUpRight size={15} />
            </a>

            <div className="dialog-ext-links">
              <button
                type="button"
                className="dialog-text-link about-copy-btn"
                onClick={handleCopyDiscord}
              >
                {copiedDiscord ? <Check size={13} /> : <Copy size={13} />}
                <span>{copiedDiscord ? ui.copied : "Discord"}</span>
              </button>
              <a
                className="dialog-text-link"
                href="https://t.me/sermalus"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Telegram</span>
                <ArrowUpRight size={13} />
              </a>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
