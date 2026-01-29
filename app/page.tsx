import {
  ArrowUpRight,
  Terminal,
  Cpu,
  MapPin,
  Building2,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TextFlip } from "@/components/ui/text-flip";
import { TextScramble } from "@/components/ui/text-scramble";
import { FadeIn } from "@/components/ui/fade-in";
import { hero, skills, workExperience, projects, education } from "@/data/data";

export default function Home() {
  return (
    <div className="bg-grid-pattern min-h-screen">
      {/* Top accent line - sticky */}
      <div className="sticky top-0 z-50 h-1 w-full bg-brand" />

      <main className="mx-auto max-w-5xl space-y-24 px-8 py-20 sm:px-16">
        {/* Hero Section */}
        <FadeIn>
        <section>
          {/* Name */}
          <h1 className="mb-6 font-[family-name:var(--font-space-mono)] text-3xl font-bold uppercase tracking-tight sm:text-4xl md:text-5xl">
            <span className="text-white">&gt; </span>
            <span className="text-white">HELLO, I&apos;M</span>
            <br />
            <TextScramble text={hero.name} className="text-outline" />
            <span className="inline-block w-[0.6em] h-[1.1em] bg-brand align-middle ml-1 animate-blink" />
          </h1>

          {/* Location & Position */}
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:gap-6">
            <div className="flex items-center gap-2 text-zinc-400">
              <MapPin className="h-4 w-4 text-brand" />
              <span className="font-[family-name:var(--font-space-mono)] text-sm">
                {hero.location}
              </span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400">
              <Building2 className="h-4 w-4 text-brand" />
              <span className="font-[family-name:var(--font-space-mono)] text-sm">
                {hero.position}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="mb-6 font-[family-name:var(--font-space-mono)] text-sm text-zinc-400 sm:text-xl">
            {hero.description}
          </p>

          {/* Social links */}
          <div className="flex items-center gap-6">
            {hero.socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  target={
                    link.href.startsWith("mailto:") ? undefined : "_blank"
                  }
                  rel={
                    link.href.startsWith("mailto:")
                      ? undefined
                      : "noopener noreferrer"
                  }
                  className="text-zinc-400 transition-colors hover:text-brand"
                >
                  <TextFlip className="items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="font-[family-name:var(--font-space-mono)] text-xs tracking-wider">
                      {link.name}
                    </span>
                  </TextFlip>
                </a>
              );
            })}
          </div>
        </section>
        </FadeIn>

        {/* Work Section */}
        <FadeIn>
        <section>
          {/* Section header */}
          <div className="mb-10 flex items-center gap-3">
            <Briefcase className="h-5 w-5 text-brand" />
            <h2 className="font-[family-name:var(--font-space-mono)] text-xl tracking-wider text-brand">
              WORK
            </h2>
          </div>

          {/* Work experience list */}
          <div className="space-y-8">
            {workExperience.map((job) => (
              <div key={job.company} className="group">
                {/* Company and period row */}
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <h3 className="font-[family-name:var(--font-space-mono)] text-lg font-medium text-white">
                      {job.role}
                    </h3>
                    <a
                      href={job.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link inline-flex items-center gap-1 font-[family-name:var(--font-space-mono)] text-sm text-brand transition-colors hover:text-brand/80"
                    >
                      <TextFlip>{job.company}</TextFlip>
                      <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover/link:opacity-100" />
                    </a>
                  </div>
                  <span className="font-[family-name:var(--font-space-mono)] text-sm text-zinc-500">
                    {job.period}
                  </span>
                </div>

                {/* Description */}
                <p className="mb-3 font-[family-name:var(--font-space-mono)] text-sm leading-relaxed text-zinc-400">
                  {job.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="rounded border-zinc-700 bg-transparent font-[family-name:var(--font-space-mono)] text-xs text-zinc-400 transition-colors hover:border-brand/50 hover:text-zinc-300"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
        </FadeIn>

        {/* Education Section */}
        <FadeIn>
        <section>
          <div className="mb-10 flex items-center gap-3">
            <GraduationCap className="h-5 w-5 text-brand" />
            <h2 className="font-[family-name:var(--font-space-mono)] text-xl tracking-wider text-brand">
              EDUCATION
            </h2>
          </div>

          <div className="space-y-8">
            {education.map((edu) => (
              <div key={edu.school} className="group">
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <h3 className="font-[family-name:var(--font-space-mono)] text-lg font-medium text-white">
                      {edu.program}
                    </h3>
                    {edu.link ? (
                      <a
                        href={edu.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/link inline-flex items-center gap-1 font-[family-name:var(--font-space-mono)] text-sm text-brand transition-colors hover:text-brand/80"
                      >
                        <TextFlip>{edu.school}</TextFlip>
                        <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover/link:opacity-100" />
                      </a>
                    ) : (
                      <span className="font-[family-name:var(--font-space-mono)] text-sm text-brand">
                        {edu.school}
                      </span>
                    )}
                  </div>
                  <span className="font-[family-name:var(--font-space-mono)] text-sm text-zinc-500">
                    {edu.period}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
        </FadeIn>

        {/* Projects Section */}
        <FadeIn>
        <section>
          {/* Section header */}
          <div className="mb-10 flex items-center gap-3">
            <Terminal className="h-5 w-5 text-brand" />
            <h2 className="font-[family-name:var(--font-space-mono)] text-xl tracking-wider text-brand">
              PROJECTS
            </h2>
          </div>

          {/* Projects list */}
          <div className="space-y-8">
            {projects.map((project, index) => (
              <div key={project.title} className="group">
                {/* Title row */}
                <div className="mb-3 flex items-start justify-between">
                  <a
                    href={project.link}
                    className="group/link inline-flex items-center gap-2 transition-colors hover:text-brand"
                  >
                    <h3 className="font-[family-name:var(--font-space-mono)] text-lg font-medium text-white underline-offset-4 transition-all group-hover/link:text-brand">
                      <TextFlip>{project.title}</TextFlip>
                    </h3>
                    <ArrowUpRight className="h-4 w-4 opacity-0 transition-opacity group-hover/link:opacity-100" />
                  </a>
                  <span className="font-[family-name:var(--font-space-mono)] text-sm text-zinc-600">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Description */}
                <p className="mb-3 font-[family-name:var(--font-space-mono)] text-sm leading-relaxed text-zinc-400">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="rounded border-zinc-700 bg-transparent font-[family-name:var(--font-space-mono)] text-xs text-zinc-400 transition-colors hover:border-brand/50 hover:text-zinc-300"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
        </FadeIn>

        {/* Skills Section */}
        <FadeIn>
        <section>
          {/* Section header */}
          <div className="mb-10 flex items-center gap-3">
            <Cpu className="h-5 w-5 text-brand" />
            <h2 className="font-[family-name:var(--font-space-mono)] text-xl tracking-wider text-brand">
              SKILLS
            </h2>
          </div>

          {/* Skills badges */}
          <div className="flex flex-wrap gap-3">
            {skills.map((skill) => {
              const Icon = skill.icon;
              return (
                <Badge
                  key={skill.name}
                  variant="outline"
                  className="gap-2 rounded border-zinc-700 bg-transparent px-3 py-2 font-[family-name:var(--font-space-mono)] text-sm text-zinc-300 transition-colors hover:border-brand/50 hover:text-white"
                >
                  <Icon className="h-4 w-4 text-brand" />
                  {skill.name}
                </Badge>
              );
            })}
          </div>
        </section>
        </FadeIn>

        {/* CTA Section */}
        <FadeIn>
        <section>
          <div className="flex flex-col items-center justify-center rounded border border-zinc-800 px-8 py-12 text-center">
            <h2 className="mb-3 font-[family-name:var(--font-space-mono)] text-2xl font-bold text-white sm:text-3xl">
              Let&apos;s work together.
            </h2>
            <p className="mb-6 max-w-md font-[family-name:var(--font-space-mono)] text-sm text-zinc-400">
              Currently open for new opportunities and interesting projects.
            </p>
            <Button
              className="bg-brand font-[family-name:var(--font-space-mono)] text-white hover:bg-brand/90"
              asChild
            >
              <a href={hero.socialLinks[2].href}>
                <TextFlip>Get in Touch</TextFlip>
              </a>
            </Button>
          </div>
        </section>
        </FadeIn>
      </main>
    </div>
  );
}
