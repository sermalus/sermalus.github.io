import { useState } from "react";
import { motion } from "motion/react";
import { Toaster } from "sonner";
import { Header } from "./components/Header";
import { ProjectCard } from "./components/ProjectCard";
import { ProjectDialog } from "./components/ProjectDialog";
import { Footer } from "./components/Footer";
import { PROJECTS, type ProjectItem } from "./data/projects";

export function App() {
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);

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
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        >
          <Header />

          <section className="cards-row" aria-label="Projects">
            {PROJECTS.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onSelect={setActiveProject}
              />
            ))}
          </section>
        </motion.div>
      </main>

      <Footer />

      <ProjectDialog
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />
    </div>
  );
}

export default App;
