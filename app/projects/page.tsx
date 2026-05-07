import { ArrowLeft, ArrowUpRight, Terminal } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/ui/fade-in";
import { TextFlip } from "@/components/ui/text-flip";
import { StaggerList, StaggerItem } from "@/components/ui/stagger-list";
import { TerminalBox, slugify } from "@/components/ui/terminal-box";
import { BGPattern } from "@/components/ui/bg-pattern";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { SortableTags } from "@/components/ui/sortable-tags";
import { SpecialText } from "@/components/ui/special-text";
// import { ThemeToggle } from "@/components/ui/theme-toggle";
import { projects } from "@/data/data";

export default function ProjectsPage() {
  return (
    <div className="crt relative min-h-screen">
      <BGPattern
        variant="grid"
        mask="fade-edges"
        size={40}
        fill="var(--grid-fill)"
      />
      <ScrollProgress />
      {/* <ThemeToggle /> */}

      <main className="mx-auto max-w-3xl space-y-8 px-6 py-12 sm:px-8">
        <FadeIn>
          <div>
            <Link
              href="/"
              className="group/link mb-8 inline-flex items-center gap-2 font-space-mono text-xs text-zinc-600 transition-colors hover:text-brand dark:text-zinc-400"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover/link:-translate-x-1" />
              <TextFlip>Back</TextFlip>
            </Link>

            <div className="mb-5 flex items-center gap-3">
              <Terminal className="h-5 w-5 text-brand" />
              <h1 className="font-space-mono text-xl font-bold tracking-wider text-brand">
                <SpecialText className="text-xl font-bold tracking-wider">
                  ALL PROJECTS
                </SpecialText>
              </h1>
            </div>
          </div>
        </FadeIn>

        <StaggerList className="space-y-3">
          {projects.map((project) => (
            <StaggerItem key={project.title}>
              <TerminalBox title={`~/projects/${slugify(project.title)}.sh`}>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link mb-1 inline-flex items-center gap-1 font-space-mono text-sm font-medium text-foreground transition-colors hover:text-brand"
                >
                  <TextFlip>{project.title}</TextFlip>
                  <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover/link:opacity-100" />
                </a>
                <p className="mb-3 font-space-mono text-xs text-zinc-600 dark:text-zinc-400">
                  {project.description}
                </p>
                <SortableTags
                  className="flex flex-wrap gap-2"
                  items={project.tags.map((tag) => ({
                    key: tag,
                    node: (
                      <Badge
                        variant="outline"
                        className="rounded border-zinc-300 bg-transparent font-space-mono text-xs text-zinc-600 transition-colors hover:border-brand/50 hover:text-zinc-800 dark:border-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
                      >
                        <TextFlip>{tag}</TextFlip>
                      </Badge>
                    ),
                  }))}
                />
              </TerminalBox>
            </StaggerItem>
          ))}
        </StaggerList>
      </main>
    </div>
  );
}
