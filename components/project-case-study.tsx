"use client";

import Link from "next/link";
import type { Project } from "@/data/projects";
import { useLocale } from "./locale-provider";
import { SiteHeader } from "./site-header";

export function ProjectCaseStudy({ project, nextProject }: { project: Project; nextProject: Pick<Project, "slug" | "title"> }) {
  const { locale } = useLocale();
  const copy = project.copy[locale];
  return <div className={`case-page locale-${locale}`}>
    <a className="skip-link" href="#case-content">{locale === "en" ? "Skip to case study" : "跳转到项目档案"}</a>
    <SiteHeader />
    <main id="case-content" tabIndex={-1}>
      <article aria-labelledby="case-title">
        <header className="case-hero">
          <Link href="/#work" className="line-link mono">← {locale === "en" ? "ALL WORK" : "全部作品"}</Link>
          <p className="case-kicker mono">{project.code} / {copy.type}</p>
          <h1 id="case-title">{project.title}</h1>
          <p className="case-lead">{copy.lead}</p>
          <p className="case-summary">{copy.body}</p>
          <dl className="case-facts mono">
            <div><dt>{locale === "en" ? "STATUS" : "状态"}</dt><dd>{copy.status}</dd></div>
            <div><dt>{locale === "en" ? "SCOPE" : "范围"}</dt><dd>{copy.scope}</dd></div>
            <div><dt>{locale === "en" ? "TOOLS" : "技术栈"}</dt><dd>{project.stack.join(" / ")}</dd></div>
          </dl>
        </header>
        <div className="case-sections">
          {copy.sections.map((section, index) => <section className="case-section" key={index} aria-labelledby={`case-section-${index}`}>
            <span className="mono case-number" aria-hidden="true">0{index + 1}</span>
            <h2 id={`case-section-${index}`}>{section.title}</h2>
            <div>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
          </section>)}
        </div>
        <aside className="case-evidence" aria-labelledby="evidence-title">
          <h2 id="evidence-title" className="mono">{locale === "en" ? "SOURCE NOTES" : "资料依据"}</h2>
          <p>{copy.evidence}</p>
          {project.links.length > 0 && <ul className="case-links">{project.links.map((link) => <li key={link.href}><a className="line-link mono" href={link.href} target="_blank" rel="noreferrer">{link.label[locale]} <span aria-hidden="true">↗</span></a></li>)}</ul>}
        </aside>
      </article>
      <nav className="case-next" aria-label={locale === "en" ? "More projects" : "更多项目"}>
        <span className="kicker mono">{locale === "en" ? "NEXT OBJECT" : "下一件作品"}</span>
        <Link href={`/work/${nextProject.slug}`}>{nextProject.title} <span aria-hidden="true">↗</span></Link>
      </nav>
    </main>
    <footer className="case-footer mono"><span>JOHN / DIGITAL ORBIT</span><Link href="/#contact">{locale === "en" ? "CONTACT" : "联系"} ↗</Link></footer>
  </div>;
}
