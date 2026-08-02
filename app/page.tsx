import {
  ArrowUpRight,
  Terminal,
  Cpu,
  Briefcase,
  GraduationCap,
  Github,
  FileText,
  Clock,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TextFlip } from "@/components/ui/text-flip";
import { FadeIn } from "@/components/ui/fade-in";
import { StaggerList, StaggerItem } from "@/components/ui/stagger-list";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { TerminalBox, slugify } from "@/components/ui/terminal-box";
import { BGPattern } from "@/components/ui/bg-pattern";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { SortableTags } from "@/components/ui/sortable-tags";
import { PixelMascot } from "@/components/ui/pixel-mascot";
import { SpecialText } from "@/components/ui/special-text";
import {
  hero,
  skills,
  workExperience,
  projects,
  education,
} from "@/data/data";
import { getAllPosts } from "@/lib/blog";
import { AccentPicker } from "@/components/ui/accent-picker";
// import { ThemeToggle } from "@/components/ui/theme-toggle";
import { GitHubActivity } from "@/components/ui/github-activity";

function getVersion(): string {
  const dob = new Date(2004, 3, 4);
  const now = new Date();

  const beforeBday =
    now.getMonth() < dob.getMonth() ||
    (now.getMonth() === dob.getMonth() && now.getDate() < dob.getDate());
  const age = now.getFullYear() - dob.getFullYear() - (beforeBday ? 1 : 0);

  const lastBday = new Date(
    beforeBday ? now.getFullYear() - 1 : now.getFullYear(),
    dob.getMonth(),
    dob.getDate(),
  );
  const daysSinceBday = Math.floor(
    (now.getTime() - lastBday.getTime()) / 86_400_000,
  );

  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `v${age}.${month}.${daysSinceBday}`;
}

export const revalidate = 3600;

export default function Home() {
  return (
    <div className="crt relative min-h-screen">
      <BGPattern
        variant="grid"
        mask="fade-edges"
        size={40}
        fill="var(--grid-fill)"
      />
      <ScrollProgress />
      <AccentPicker />
      {/* <ThemeToggle /> */}

      {/* Full-bleed hero */}
      <FadeIn>
        <section className="flex w-full justify-center px-6 pt-12 pb-8 sm:px-10 lg:px-16">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:gap-10 sm:text-left">
            {/* Pixel mascot */}
            <PixelMascot className="h-16 w-24" />

            <div className="w-full min-w-0 space-y-1 font-space-mono text-sm leading-relaxed">
              <div>
                <SpecialText className="font-bold text-foreground">
                  Preet Codes
                </SpecialText>
                <span className="text-zinc-500"> {getVersion()}</span>
              </div>
              <div className="hidden text-zinc-700 dark:text-zinc-300 sm:block">
                Espresso 4.7 with high jitters{" "}
                <span className="text-zinc-400 dark:text-zinc-600">·</span> Imposter Syndrome Pro
              </div>
              <div className="flex flex-wrap items-center justify-center gap-x-2 text-zinc-500 sm:justify-start">
                <span>~/portfolio</span>
                {hero.socialLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <span
                      key={link.name}
                      className="flex items-center gap-x-2"
                    >
                      <span className="text-zinc-400 dark:text-zinc-600">·</span>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={link.name}
                        className="inline-flex items-center justify-center p-1.5 text-zinc-600 dark:text-zinc-400 transition-colors hover:text-brand"
                      >
                        <TextFlip>
                          <Icon className="h-3.5 w-3.5" />
                        </TextFlip>
                      </a>
                    </span>
                  );
                })}
              </div>
              <div className="text-zinc-500">
                {hero.location} <span className="text-zinc-400 dark:text-zinc-600">·</span>{" "}
                {workExperience[0].role} @{" "}
                <a
                  href={workExperience[0].link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-600 dark:text-zinc-400 underline-offset-4 transition-colors hover:text-brand hover:underline"
                >
                  {workExperience[0].company}
                </a>
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      <main className="mx-auto max-w-3xl space-y-12 px-6 pb-12 sm:px-8">
        {/* Work Section */}
        <FadeIn>
          <section>
            {/* Section header */}
            <div className="mb-5 flex items-center gap-3">
              <Briefcase className="h-5 w-5 text-brand" />
              <h2 className="font-space-mono text-lg tracking-wider text-brand">
                WORK
              </h2>
            </div>

            {/* Work experience list */}
            <StaggerList className="space-y-3">
              {workExperience.map((job) => (
                <StaggerItem key={job.company}>
                  <TerminalBox title={`~/work/${slugify(job.company)}.sh`}>
                    <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="font-space-mono text-base font-medium text-foreground">
                          {job.role}
                        </h3>
                        <a
                          href={job.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/link inline-flex items-center gap-1 font-space-mono text-xs text-brand transition-colors hover:text-brand/80"
                        >
                          <TextFlip>{job.company}</TextFlip>
                          <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover/link:opacity-100" />
                        </a>
                      </div>
                      <span className="font-space-mono text-xs text-zinc-500">
                        {job.period}
                      </span>
                    </div>

                    <p className="mb-3 font-space-mono text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                      {job.description}
                    </p>

                    <SortableTags
                      className="flex flex-wrap gap-2"
                      items={job.tags.map((tag) => ({
                        key: tag,
                        node: (
                          <Badge
                            variant="outline"
                            className="rounded border-zinc-300 dark:border-zinc-700 bg-transparent font-space-mono text-xs text-zinc-600 dark:text-zinc-400 transition-colors hover:border-brand/50 hover:text-zinc-800 dark:hover:text-zinc-300"
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
          </section>
        </FadeIn>

        {/* Education Section */}
        <FadeIn>
          <section>
            <div className="mb-5 flex items-center gap-3">
              <GraduationCap className="h-5 w-5 text-brand" />
              <h2 className="font-space-mono text-lg tracking-wider text-brand">
                EDUCATION
              </h2>
            </div>

            <StaggerList className="space-y-3">
              {education.map((edu) => (
                <StaggerItem key={edu.school}>
                  <TerminalBox title={`~/edu/${slugify(edu.school)}.sh`}>
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="font-space-mono text-base font-medium text-foreground">
                          {edu.program}
                        </h3>
                        {edu.link ? (
                          <a
                            href={edu.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/link inline-flex items-center gap-1 font-space-mono text-xs text-brand transition-colors hover:text-brand/80"
                          >
                            <TextFlip>{edu.school}</TextFlip>
                            <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover/link:opacity-100" />
                          </a>
                        ) : (
                          <span className="font-space-mono text-xs text-brand">
                            {edu.school}
                          </span>
                        )}
                      </div>
                      <span className="font-space-mono text-xs text-zinc-500">
                        {edu.period}
                      </span>
                    </div>
                  </TerminalBox>
                </StaggerItem>
              ))}
            </StaggerList>
          </section>
        </FadeIn>

        {/* Projects Section */}
        <FadeIn>
          <section>
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Terminal className="h-5 w-5 text-brand" />
                <h2 className="font-space-mono text-lg tracking-wider text-brand">
                  PROJECTS
                </h2>
              </div>
              <Link
                href="/projects"
                className="group/link inline-flex items-center gap-1 font-space-mono text-xs text-zinc-600 dark:text-zinc-400 transition-colors hover:text-brand"
              >
                <TextFlip>See all</TextFlip>
                <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover/link:opacity-100" />
              </Link>
            </div>

            <StaggerList className="space-y-3">
              {projects.slice(0, 2).map((project) => (
                <StaggerItem key={project.title}>
                  <TerminalBox
                    title={`~/projects/${slugify(project.title)}.sh`}
                  >
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
                            className="rounded border-zinc-300 dark:border-zinc-700 bg-transparent font-space-mono text-xs text-zinc-600 dark:text-zinc-400 transition-colors hover:border-brand/50 hover:text-zinc-800 dark:hover:text-zinc-300"
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
          </section>
        </FadeIn>

        {/* Blog Section */}
        <FadeIn>
          <section>
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-brand" />
                <h2 className="font-space-mono text-lg tracking-wider text-brand">
                  BLOG
                </h2>
              </div>
              <Link
                href="/blogs"
                className="group/link inline-flex items-center gap-1 font-space-mono text-xs text-zinc-600 dark:text-zinc-400 transition-colors hover:text-brand"
              >
                <TextFlip>See all</TextFlip>
                <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover/link:opacity-100" />
              </Link>
            </div>

            <StaggerList className="space-y-3">
              {getAllPosts().slice(0, 2).map((post) => (
                <StaggerItem key={post.slug}>
                  <Link href={`/blogs/${post.slug}`} className="group block">
                    <TerminalBox
                      title={`~/blog/${post.slug}.md`}
                      className="group-hover:border-brand/50"
                    >
                      <div className="mb-2 flex items-center gap-4 font-space-mono text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readTime}
                        </span>
                      </div>
                      <h3 className="mb-1 font-space-mono text-sm font-medium text-foreground transition-colors group-hover:text-brand">
                        {post.title}
                      </h3>
                      <p className="font-space-mono text-xs text-zinc-600 dark:text-zinc-400">
                        {post.description}
                      </p>
                    </TerminalBox>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerList>
          </section>
        </FadeIn>

        {/* Skills Section */}
        <FadeIn>
          <section>
            {/* Section header */}
            <div className="mb-5 flex items-center gap-3">
              <Cpu className="h-5 w-5 text-brand" />
              <h2 className="font-space-mono text-lg tracking-wider text-brand">
                SKILLS
              </h2>
            </div>

            {/* Skills badges */}
            <SortableTags
              className="flex flex-wrap justify-center gap-3"
              items={skills.map((skill) => {
                const Icon = skill.icon;
                return {
                  key: skill.name,
                  node: (
                    <Badge
                      variant="outline"
                      className="gap-2 rounded border-zinc-300 dark:border-zinc-700 bg-transparent px-2.5 py-1.5 font-space-mono text-xs text-zinc-700 dark:text-zinc-300 transition-colors hover:border-brand/50 hover:text-white"
                    >
                      <Icon className="h-4 w-4 text-brand" />
                      <TextFlip>{skill.name}</TextFlip>
                    </Badge>
                  ),
                };
              })}
            />
          </section>
        </FadeIn>

        {/* Activity Section */}
        <FadeIn>
          <section>
            <div className="mb-5 flex items-center gap-3">
              <Github className="h-5 w-5 text-brand" />
              <h2 className="font-space-mono text-lg tracking-wider text-brand">
                ACTIVITY
              </h2>
            </div>
            <GitHubActivity />
          </section>
        </FadeIn>

        {/* CTA Section */}
        <FadeIn>
          <section>
            <div className="flex flex-col items-center justify-center px-8 py-6 text-center">
              <h2 className="mb-3 font-space-mono text-xl font-bold text-foreground sm:text-2xl">
                Let&apos;s work together.
              </h2>
              <p className="mb-6 max-w-md font-space-mono text-xs text-zinc-600 dark:text-zinc-400">
                Currently open for new opportunities and interesting projects.
              </p>
              <MagneticButton className="inline-block">
                <Button
                  className="bg-brand font-space-mono text-white hover:bg-brand/90"
                  asChild
                >
                  <a
                    href={hero.socialLinks[1].href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <TextFlip>Get in Touch</TextFlip>
                  </a>
                </Button>
              </MagneticButton>
            </div>
          </section>
        </FadeIn>
      </main>
    </div>
  );
}
