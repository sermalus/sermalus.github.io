import type { PointerEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import type { ProjectItem } from "../data/projects";

interface ProjectCardProps {
  project: ProjectItem;
  onSelect: (project: ProjectItem) => void;
}

function DeckPreview() {
  return (
    <div className="deck-fan" aria-hidden="true">
      <div className="deck-sheet deck-sheet--back" />
      <div className="deck-sheet deck-sheet--mid" />
      <div className="deck-sheet deck-sheet--front">
        <div className="deck-top-row">
          <span className="deck-pill">PORTFOLIO</span>
          <span className="deck-year">2026</span>
        </div>
        <div className="deck-slashes">
          <span className="deck-slash" />
          <span className="deck-slash" />
          <span className="deck-slash" />
          <span className="deck-slash" />
          <span className="deck-slash" />
        </div>
      </div>
    </div>
  );
}

export function ProjectCard({ project, onSelect }: ProjectCardProps) {
  const handlePointerMove = (e: PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  const targetHref = project.href ?? (project.caseId ? `#/${project.caseId}` : null);

  const innerContent = (
    <>
      <div className="card-visual">
        {project.icon ? (
          <div className="project-icon-frame">
            <img
              src={project.icon}
              alt={`${project.title} icon`}
              className="project-icon-img"
              width={134}
              height={134}
              decoding="async"
            />
          </div>
        ) : (
          <DeckPreview />
        )}
      </div>

      <div className="card-footer-stack">
        <h2 className="card-title">{project.title}</h2>
        <div className="card-expand">
          <div className="card-expand-inner">
            <p className="card-desc">{project.shortDesc}</p>
            <span
              className={
                project.href ? "card-cta" : "card-cta card-cta--outline"
              }
            >
              <span>{project.ctaLabel}</span>
              {targetHref && <ArrowUpRight size={13} aria-hidden="true" />}
            </span>
          </div>
        </div>
      </div>
    </>
  );

  if (targetHref) {
    return (
      <a
        href={targetHref}
        className="bento-card"
        onPointerMove={handlePointerMove}
      >
        {innerContent}
      </a>
    );
  }

  return (
    <button
      type="button"
      className="bento-card"
      onPointerMove={handlePointerMove}
      onClick={() => onSelect(project)}
    >
      {innerContent}
    </button>
  );
}
