import { ArrowLeft, Terminal } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/ui/fade-in";
import { TextFlip } from "@/components/ui/text-flip";
import { StaggerList, StaggerItem } from "@/components/ui/stagger-list";
import { TerminalBox, slugify } from "@/components/ui/terminal-box";
import { projects } from "@/data/data";

export default function ProjectsPage() {
  return (
    <div className="bg-grid-pattern crt min-h-screen">
      <div className="sticky top-0 z-50 h-1 w-full bg-brand" />

      <main className="mx-auto max-w-3xl space-y-8 px-6 py-12 sm:px-8">
        <FadeIn>
          <div>
            <Link
              href="/"
              className="group/link mb-8 inline-flex items-center gap-2 font-space-mono text-xs text-zinc-400 transition-colors hover:text-brand"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover/link:-translate-x-1" />
              <TextFlip>Back</TextFlip>
            </Link>

            <div className="mb-5 flex items-center gap-3">
              <Terminal className="h-5 w-5 text-brand" />
              <h1 className="font-space-mono text-xl font-bold tracking-wider text-brand">
                ALL PROJECTS
              </h1>
            </div>
          </div>
        </FadeIn>

        <StaggerList className="space-y-3">
          {projects.map((project) => (
            <StaggerItem key={project.title}>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <TerminalBox
                  title={`~/projects/${slugify(project.title)}.sh`}
                  className="group-hover:border-brand/50"
                >
                  <h2 className="mb-1 font-space-mono text-sm font-medium text-white transition-colors group-hover:text-brand">
                    {project.title}
                  </h2>
                  <p className="mb-3 font-space-mono text-xs text-zinc-400">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="rounded border-zinc-700 bg-transparent font-space-mono text-xs text-zinc-400 transition-colors hover:border-brand/50 hover:text-zinc-300"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TerminalBox>
              </a>
            </StaggerItem>
          ))}
        </StaggerList>
      </main>
    </div>
  );
}
