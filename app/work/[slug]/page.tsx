import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import projects from "../../project-data.json";

function getProject(slug: string) {
  if (!Object.hasOwn(projects, slug)) notFound();
  const project = projects[slug as keyof typeof projects];
  if (!project) notFound();
  return project;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  const host = (await headers()).get("host") ?? "localhost:3000";
  const origin = `${/^(localhost|127\.0\.0\.1)/.test(host) ? "http" : "https"}://${host}`;
  const title = `${project.title} — Dedharya Immanuella`;
  const images = project.image ? [`${origin}${project.image}`] : [];
  return { title, description: project.description,
    openGraph: { title, description: project.description, images },
    twitter: { title, description: project.description, images } };
}

export default async function Project({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);

  return (
    <iframe
      id="main"
      className="reference-frame"
      src={`/work-${slug}-reference.html`}
      title={project.title}
    />
  );
}
