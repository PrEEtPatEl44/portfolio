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
import { AnimatedBadge } from "@/components/ui/animated-badge";
import { SocialIconLink } from "@/components/ui/social-icon-link";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { TerminalBox, slugify } from "@/components/ui/terminal-box";
import {
  hero,
  skills,
  workExperience,
  projects,
  education,
} from "@/data/data";
import { getAllPosts } from "@/lib/blog";
import { AccentPicker } from "@/components/ui/accent-picker";
import { MusicPlayer } from "@/components/ui/music-player";
import { GitHubActivity } from "@/components/ui/github-activity";

export default function Home() {
  return (
    <div className="bg-grid-pattern crt min-h-screen">
      {/* Top accent line - sticky */}
      <div className="sticky top-0 z-50 h-1 w-full bg-brand" />
      <AccentPicker />
      <MusicPlayer />

      <main className="mx-auto max-w-3xl space-y-12 px-6 py-12 sm:px-8">
        {/* Hero Section */}
        <FadeIn>
          <section>
            <TerminalBox title="~/status.sh" className="text-xs">
              <div className="space-y-1.5 text-zinc-400">
                <div>
                  <span className="text-brand">$</span> whoami
                </div>
                <div className="pl-3 text-white">preet_patel</div>
                <div className="my-2 h-px bg-zinc-800" />
                <div>
                  <span className="text-brand">&gt;</span> status:{" "}
                  <span className="text-white">
                    shipping
                    <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-brand align-middle animate-pulse" />
                  </span>
                </div>
                <div>
                  <span className="text-brand">&gt;</span> where:{" "}
                  <span className="text-white">{hero.location}</span>
                </div>
                <div>
                  <span className="text-brand">&gt;</span> role:{" "}
                  <span className="text-white">
                    {workExperience[0].role}
                  </span>
                </div>
                <div>
                  <span className="text-brand">&gt;</span> at:{" "}
                  <a
                    href={workExperience[0].link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white underline-offset-4 transition-colors hover:text-brand hover:underline"
                  >
                    {workExperience[0].company}
                  </a>
                </div>
              </div>
            </TerminalBox>

            <StaggerList
              className="mt-4 flex items-center gap-2"
              stagger={0.06}
              amount={0.5}
            >
              {hero.socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <SocialIconLink
                    key={link.name}
                    href={link.href}
                    label={link.name}
                  >
                    <Icon className="h-4 w-4 text-neutral-500 transition-colors group-hover:text-brand" />
                  </SocialIconLink>
                );
              })}
            </StaggerList>
          </section>
        </FadeIn>

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
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <h3 className="font-space-mono text-base font-medium text-white">
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

                    <p className="mb-3 font-space-mono text-xs leading-relaxed text-zinc-400">
                      {job.description}
                    </p>

                    <StaggerList
                      className="flex flex-wrap gap-2"
                      stagger={0.03}
                      amount={0.3}
                    >
                      {job.tags.map((tag) => (
                        <AnimatedBadge key={tag}>
                          <Badge
                            variant="outline"
                            className="rounded border-zinc-700 bg-transparent font-space-mono text-xs text-zinc-400 transition-colors hover:border-brand/50 hover:text-zinc-300"
                          >
                            <TextFlip>{tag}</TextFlip>
                          </Badge>
                        </AnimatedBadge>
                      ))}
                    </StaggerList>
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
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-space-mono text-base font-medium text-white">
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
                className="group/link inline-flex items-center gap-1 font-space-mono text-xs text-zinc-400 transition-colors hover:text-brand"
              >
                <TextFlip>See all</TextFlip>
                <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover/link:opacity-100" />
              </Link>
            </div>

            <StaggerList className="space-y-3">
              {projects.slice(0, 2).map((project) => (
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
                      <h3 className="mb-1 font-space-mono text-sm font-medium text-white transition-colors group-hover:text-brand">
                        {project.title}
                      </h3>
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
                className="group/link inline-flex items-center gap-1 font-space-mono text-xs text-zinc-400 transition-colors hover:text-brand"
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
                      <h3 className="mb-1 font-space-mono text-sm font-medium text-white transition-colors group-hover:text-brand">
                        {post.title}
                      </h3>
                      <p className="font-space-mono text-xs text-zinc-400">
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
            <StaggerList
              className="flex flex-wrap justify-center gap-3"
              stagger={0.04}
            >
              {skills.map((skill) => {
                const Icon = skill.icon;
                return (
                  <AnimatedBadge key={skill.name}>
                    <Badge
                      variant="outline"
                      className="gap-2 rounded border-zinc-700 bg-transparent px-2.5 py-1.5 font-space-mono text-xs text-zinc-300 transition-colors hover:border-brand/50 hover:text-white"
                    >
                      <Icon className="h-4 w-4 text-brand" />
                      <TextFlip>{skill.name}</TextFlip>
                    </Badge>
                  </AnimatedBadge>
                );
              })}
            </StaggerList>
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
            <div className="flex justify-center">
              <GitHubActivity />
            </div>
          </section>
        </FadeIn>

        {/* CTA Section */}
        <FadeIn>
          <section>
            <div className="flex flex-col items-center justify-center px-8 py-6 text-center">
              <h2 className="mb-3 font-space-mono text-xl font-bold text-white sm:text-2xl">
                Let&apos;s work together.
              </h2>
              <p className="mb-6 max-w-md font-space-mono text-xs text-zinc-400">
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
