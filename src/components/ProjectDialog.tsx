import { useEffect, useRef } from "react";
import { ArrowUpRight, X } from "lucide-react";
import type { ProjectItem } from "../data/projects";

interface ProjectDialogProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export function ProjectDialog({ project, onClose }: ProjectDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (project && !dialog.open) {
      dialog.showModal();
    } else if (!project && dialog.open) {
      dialog.close();
    }
  }, [project]);

  // Fallback light-dismiss for browsers without <dialog closedby="any">
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
      if (pressedOutside && isOutside(e)) {
        dialog.close();
      }
    };

    dialog.addEventListener("pointerdown", onDown);
    dialog.addEventListener("pointerup", onUp);
    return () => {
      dialog.removeEventListener("pointerdown", onDown);
      dialog.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="project-dialog"
      {...({ closedby: "any" } as Record<string, string>)}
      aria-labelledby="project-dialog-title"
      onClose={() => {
        if (dialogRef.current) dialogRef.current.returnValue = "";
        onClose();
      }}
    >
      {project && (
        <div className="dialog-body">
          <div className="dialog-head">
            <div className="dialog-identity">
              {project.icon && (
                <img
                  src={project.icon}
                  alt={`${project.title} icon`}
                  className="dialog-icon"
                  width={56}
                  height={56}
                />
              )}
              <div>
                {project.role && (
                  <span className="dialog-role">{project.role}</span>
                )}
                <h2 id="project-dialog-title" className="dialog-title">
                  {project.title}
                </h2>
              </div>
            </div>

            <form method="dialog">
              <button
                type="submit"
                className="dialog-close"
                aria-label="Close project details"
                autoFocus
              >
                <X size={16} />
              </button>
            </form>
          </div>

          {project.summary && (
            <p className="dialog-copy">{project.summary}</p>
          )}

          {project.quote && (
            <blockquote className="dialog-quote">
              <p>“{project.quote.text}”</p>
              <footer>— {project.quote.author}</footer>
            </blockquote>
          )}

          <div className="dialog-actions">
            {project.portfolioPage && (
              <a
                className="dialog-btn dialog-btn--primary"
                href={`/portfolio/#page=${project.portfolioPage}`}
              >
                <span>Open slides (p. {project.portfolioPage})</span>
                <ArrowUpRight size={15} />
              </a>
            )}
            {project.links?.map((link) => (
              <a
                key={link.href}
                className="dialog-btn dialog-btn--secondary"
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{link.label}</span>
                <ArrowUpRight size={14} />
              </a>
            ))}
          </div>
        </div>
      )}
    </dialog>
  );
}
