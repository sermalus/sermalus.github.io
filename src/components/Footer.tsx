import { useEffect, useState } from "react";

function formatLocalTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Chisinau",
  }).format(date);
}

export function Footer() {
  const [time, setTime] = useState(() => formatLocalTime(new Date()));

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
        <span>Available · {time} EET</span>
      </span>
    </footer>
  );
}
