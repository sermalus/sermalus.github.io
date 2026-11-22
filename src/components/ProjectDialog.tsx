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
                  width={52}
                  height={52}
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

          {project.meta && project.meta.length > 0 && (
            <dl className="dialog-meta-bar">
              {project.meta.map((item) => (
                <div className="dialog-meta-cell" key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {project.contextLine && (
            <p className="dialog-copy">{project.contextLine}</p>
          )}

          {project.deliverables && project.deliverables.length > 0 && (
            <div className="dialog-tags" aria-label="Deliverables">
              {project.deliverables.map((tag) => (
                <span className="dialog-tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          {project.previews && project.previews.length > 0 && (
            <div className="dialog-previews" aria-label="Selected works">
              {project.previews.map((preview) => (
                <a
                  key={preview.page}
                  href={`/portfolio/#page=${preview.page}`}
                  className="dialog-preview-item"
                  title={`Open slide ${preview.page}`}
                >
                  <img
                    src={preview.src}
                    alt={preview.alt}
                    loading="lazy"
                    decoding="async"
                  />
                </a>
              ))}
            </div>
          )}

          {project.quote && (
            <blockquote className="dialog-quote">
              <p>“{project.quote.text}”</p>
              <footer>— {project.quote.author}</footer>
            </blockquote>
          )}

          {(project.portfolioPage || (project.links && project.links.length > 0)) && (
            <div className="dialog-footer-bar">
              {project.portfolioPage && (
                <a
                  className="dialog-btn dialog-btn--primary"
                  href={`/portfolio/#page=${project.portfolioPage}`}
                >
                  <span>
                    View full case
                    {project.slideCount ? ` (${project.slideCount} slides)` : ""}
                  </span>
                  <ArrowUpRight size={15} />
                </a>
              )}

              {project.links && project.links.length > 0 && (
                <div className="dialog-ext-links">
                  {project.links.map((link) => (
                    <a
                      key={link.href}
                      className="dialog-text-link"
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight size={13} />
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </dialog>
  );
}
