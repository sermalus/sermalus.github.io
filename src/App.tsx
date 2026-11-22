import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Toaster } from "sonner";
import { Header } from "./components/Header";
import { ProjectCard } from "./components/ProjectCard";
import { ProjectDialog } from "./components/ProjectDialog";
import { Footer } from "./components/Footer";
import { PROJECTS, type ProjectItem } from "./data/projects";
import {
  UI_COPY,
  detectInitialLang,
  localizeProject,
  saveLang,
  type Lang,
} from "./i18n";

export function App() {
  const [lang, setLang] = useState<Lang>(() => detectInitialLang());
  const [activeId, setActiveId] = useState<ProjectItem["id"] | null>(null);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = UI_COPY[lang].pageTitle;
    saveLang(lang);
  }, [lang]);

  const localizedProjects = useMemo(
    () => PROJECTS.map((p) => localizeProject(p, lang)),
    [lang]
  );

  const activeProject = useMemo(
    () => localizedProjects.find((p) => p.id === activeId) ?? null,
    [localizedProjects, activeId]
  );

  const toggleLang = () => setLang((prev) => (prev === "en" ? "ru" : "en"));

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
      />
    </div>
  );
}

export default App;
