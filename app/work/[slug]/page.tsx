import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects, getProject } from "@/data/projects";
import { ProjectCaseStudy } from "@/components/project-case-study";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) notFound();
  return {
    title: project.title,
    description: project.copy.en.body,
    openGraph: { title: `${project.title} / Digital Orbit`, description: project.copy.en.body, type: "article" },
  };
}

export default async function WorkPage({ params }: Props) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return <ProjectCaseStudy project={project} nextProject={{ slug: next.slug, title: next.title }} />;
}
