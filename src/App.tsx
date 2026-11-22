import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Toaster } from "sonner";
import { Header } from "./components/Header";
import { ProjectCard } from "./components/ProjectCard";
import { ProjectDialog } from "./components/ProjectDialog";
import { Footer } from "./components/Footer";
import { CasePage } from "./components/CasePage";
import { PROJECTS, type ProjectItem } from "./data/projects";
import {
  UI_COPY,
  detectInitialLang,
  localizeProject,
  saveLang,
  type Lang,
} from "./i18n";

type CaseRoute = "cold-war" | "stec" | null;

function parseCaseRoute(): CaseRoute {
  const hash = window.location.hash.replace(/^#\/?/, "").toLowerCase();
  if (hash === "cold-war" || hash === "stec") return hash;
  return null;
}

export function App() {
  const [lang, setLang] = useState<Lang>(() => detectInitialLang());
  const [activeId, setActiveId] = useState<ProjectItem["id"] | null>(null);
  const [caseRoute, setCaseRoute] = useState<CaseRoute>(() => parseCaseRoute());

  useEffect(() => {
    const onHashChange = () => setCaseRoute(parseCaseRoute());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    if (caseRoute === "cold-war") {
      document.title = "COLD WAR — Sermalus";
    } else if (caseRoute === "stec") {
      document.title = "STEC — Sermalus";
    } else {
      document.title = UI_COPY[lang].pageTitle;
    }
    saveLang(lang);
  }, [lang, caseRoute]);

  const localizedProjects = useMemo(
    () => PROJECTS.map((p) => localizeProject(p, lang)),
    [lang]
  );

  const activeProject = useMemo(
    () => localizedProjects.find((p) => p.id === activeId) ?? null,
    [localizedProjects, activeId]
  );

  const toggleLang = () => setLang((prev) => (prev === "en" ? "ru" : "en"));

  const navigateToCase = (id: "cold-war" | "stec") => {
    setActiveId(null);
    window.location.hash = `/${id}`;
    setCaseRoute(id);
  };

  const navigateHome = () => {
    window.location.hash = "";
    setCaseRoute(null);
  };

  if (caseRoute) {
    return (
      <CasePage
        caseId={caseRoute}
        lang={lang}
        onToggleLang={toggleLang}
        onBack={navigateHome}
        onNavigateCase={navigateToCase}
      />
    );
  }

  return (
    <div className="app-shell">
      <Toaster
        theme="dark"
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#1F1F1F",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "#E8EAED",
            borderRadius: "12px",
            fontFamily: "var(--font-sans)",
          },
        }}
      />

      <main className="flex-1 flex flex-col justify-center">
        <motion.div
          className="site-width"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
        >
          <Header lang={lang} onToggleLang={toggleLang} />

          <section className="cards-row" aria-label="Projects">
            {localizedProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onSelect={(p) => setActiveId(p.id)}
              />
            ))}
          </section>
        </motion.div>
      </main>

      <Footer lang={lang} />

      <ProjectDialog
        project={activeProject}
        lang={lang}
        onClose={() => setActiveId(null)}
        onOpenCase={navigateToCase}
      />
    </div>
  );
}

export default App;
