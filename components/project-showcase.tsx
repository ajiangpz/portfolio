import Link from "next/link";
import type { Locale } from "./locale-provider";
import type { Project } from "@/data/projects";

export function ProjectShowcase({ project, index, locale }: { project: Project; index: number; locale: Locale }) {
  const copy = project.copy[locale];
  return <section className={`project project-${index + 1} ${index === 1 ? "align-right" : "align-left"}`} data-scene={project.scene} data-nav="1" aria-labelledby={`${project.slug}-title`}>
    <div className="project-safe-zone">
      <div className="object-id mono"><span>{project.code}</span><span>{copy.type}</span></div>
      <p className="project-index mono">0{index + 1} / 03</p>
      <h2 id={`${project.slug}-title`}>{project.title}</h2>
      <p className="project-lead">{copy.lead}</p><p className="project-body">{copy.body}</p>
      <dl className="project-spec mono">
        <div><dt>{locale === "en" ? "STACK" : "技术"}</dt><dd>{project.stack.join(" / ")}</dd></div>
        <div><dt>{locale === "en" ? "SCOPE" : "范围"}</dt><dd>{copy.scope}</dd></div>
        <div><dt>{locale === "en" ? "STATUS" : "状态"}</dt><dd>{copy.status}</dd></div>
      </dl>
      <Link className="line-link mono" href={`/work/${project.slug}`} aria-label={locale === "en" ? `Explore ${project.title}` : `查看 ${project.title} 项目档案`}>{locale === "en" ? "EXPLORE CASE STUDY" : "查看项目档案"} <span aria-hidden="true">↗</span></Link>
    </div>
  </section>;
}
