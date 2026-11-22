import { useEffect, useState } from "react";
import { UI_COPY, type Lang } from "../i18n";

interface FooterProps {
  lang: Lang;
}

function formatLocalTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Chisinau",
  }).format(date);
}

export function Footer({ lang }: FooterProps) {
  const [time, setTime] = useState(() => formatLocalTime(new Date()));
  const t = UI_COPY[lang];

  useEffect(() => {
    const id = window.setInterval(() => {
      setTime(formatLocalTime(new Date()));
    }, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <footer className="site-footer site-width">
      <span>© 2026 Sermalus</span>
      <span className="footer-status">
        <span className="status-dot" aria-hidden="true" />
        <span>
          {t.available} · {time} EET
        </span>
      </span>
    </footer>
  );
}
