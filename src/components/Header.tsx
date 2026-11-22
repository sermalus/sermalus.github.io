import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { CONTACTS } from "../data/projects";

function DiscordIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
      <path d="M20.32 4.37a19.8 19.8 0 0 0-4.89-1.52.07.07 0 0 0-.08.04c-.21.38-.45.87-.61 1.25a18.3 18.3 0 0 0-5.49 0 12.6 12.6 0 0 0-.62-1.25.08.08 0 0 0-.08-.04A19.7 19.7 0 0 0 3.67 4.37a.07.07 0 0 0-.03.03C.53 9.05-.32 13.58.1 18.06a.08.08 0 0 0 .03.06 19.9 19.9 0 0 0 5.99 3.03.08.08 0 0 0 .08-.03c.46-.63.87-1.3 1.22-2a.08.08 0 0 0-.04-.11 13.1 13.1 0 0 1-1.87-.9.08.08 0 0 1-.01-.13c.13-.09.25-.19.37-.29a.08.08 0 0 1 .08-.01c3.93 1.79 8.18 1.79 12.06 0a.08.08 0 0 1 .08.01c.12.1.25.2.37.29a.08.08 0 0 1-.01.13c-.6.35-1.22.65-1.87.9a.08.08 0 0 0-.04.11c.36.7.77 1.37 1.22 2a.08.08 0 0 0 .08.03 19.8 19.8 0 0 0 6-3.03.08.08 0 0 0 .03-.06c.5-5.18-.84-9.68-3.55-13.66a.06.06 0 0 0-.03-.03ZM8.02 15.33c-1.18 0-2.16-1.08-2.16-2.42 0-1.33.96-2.42 2.16-2.42 1.21 0 2.18 1.1 2.16 2.42 0 1.34-.96 2.42-2.16 2.42Zm7.97 0c-1.18 0-2.16-1.08-2.16-2.42 0-1.33.96-2.42 2.16-2.42 1.21 0 2.18 1.1 2.16 2.42 0 1.34-.95 2.42-2.16 2.42Z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
      <path d="M11.94 0A12 12 0 1 0 24 12 12 12 0 0 0 11.94 0Zm5.69 8.18-1.92 9.04c-.14.65-.52.81-1.06.5l-2.93-2.16-1.41 1.36c-.16.16-.29.29-.59.29l.21-2.98 5.42-4.9c.24-.21-.05-.33-.36-.12l-6.7 4.22-2.89-.9c-.63-.2-.64-.63.13-.93l11.29-4.35c.52-.19.98.13.81.93Z" />
    </svg>
  );
}

export function Header() {
  const [openId, setOpenId] = useState<"discord" | "telegram" | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const clusterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openId) return;

    const onPointerDown = (e: PointerEvent) => {
      if (clusterRef.current && !clusterRef.current.contains(e.target as Node)) {
        setOpenId(null);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenId(null);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openId]);

  const handleCopy = async (id: string, label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedId(id);
      toast.success(`${label} copied`, {
        description: value,
      });
      window.setTimeout(() => {
        setCopiedId((curr) => (curr === id ? null : curr));
      }, 1800);
    } catch {
      toast.error("Could not copy to clipboard");
    }
  };

  return (
    <header className="home-header">
      <div className="identity-block">
        <div className="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 40 40" width="28" height="28" fill="none">
            <path
              d="M26.5 13.6c-1.2-1.1-3-1.8-5.6-1.8-3.7 0-5.9 1.7-5.9 4.3 0 2.4 1.8 3.6 5.2 4.3l2 .4c2.3.4 3.4 1.1 3.4 2.4 0 1.5-1.5 2.6-4.2 2.6-2.5 0-4.5-.9-5.8-2.3l-1.9 2c1.7 1.9 4.3 3 7.7 3 4.4 0 7.1-2.1 7.1-5.2 0-2.6-1.8-4.2-5.6-4.9l-2-.4c-2.2-.4-3.2-1.1-3.2-2.2 0-1.2 1.2-2.1 3.2-2.1 2 0 3.4.6 4.5 1.5l2.1-1.6Z"
              fill="#E8EAED"
            />
          </svg>
        </div>
        <div>
          <h1 className="identity-title">Sermalus</h1>
          <p className="identity-subtitle">Graphic Designer</p>
        </div>
      </div>

      <div className="contact-cluster" ref={clusterRef}>
        {CONTACTS.map((contact) => {
          const isOpen = openId === contact.id;
          const isCopied = copiedId === contact.id;

          return (
            <div className="contact-chip-wrap" key={contact.id}>
              <button
                type="button"
                className="contact-chip"
                aria-expanded={isOpen}
                onClick={() => setOpenId(isOpen ? null : contact.id)}
              >
                {contact.id === "discord" ? <DiscordIcon /> : <TelegramIcon />}
                <span>{contact.label}</span>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    className="contact-plate"
                    initial={{ opacity: 0, scale: 0.96, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: -4 }}
                    transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <div className="plate-label">{contact.label} username</div>
                    <div className="plate-handle-row">
                      <span className="plate-handle">{contact.handle}</span>
                      <button
                        type="button"
                        className="plate-btn"
                        onClick={() =>
                          handleCopy(contact.id, contact.label, contact.copyValue)
                        }
                      >
                        {isCopied ? <Check size={13} /> : <Copy size={13} />}
                        <span>{isCopied ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                    {contact.href && (
                      <a
                        className="plate-link"
                        href={contact.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setOpenId(null)}
                      >
                        <span>Open in Telegram</span>
                        <ArrowUpRight size={14} />
                      </a>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </header>
  );
}
