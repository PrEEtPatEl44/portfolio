import { ArrowUpRight, Github, Linkedin } from "lucide-react";
import Link from "next/link";
import { SceneMount } from "@/components/three/scene-mount";
import { SkillCloud } from "@/components/three/skill-cloud";
import { DepthHud } from "@/components/three/depth-hud";
import { CAT_LABEL, CAT_COLOR } from "@/lib/skill-categories";
import { FadeIn } from "@/components/ui/fade-in";
import { TextFlip } from "@/components/ui/text-flip";
import { AccentPicker } from "@/components/ui/accent-picker";
import { GitHubActivity } from "@/components/ui/github-activity";
import { hero, workExperience, education, projects } from "@/data/data";

export const revalidate = 3600;

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#04050c] text-zinc-100">
      <SceneMount />

      {/* legibility veil between the 3D layer and the content */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(180deg,rgba(4,5,12,.55) 0%,rgba(4,5,12,.16) 30%,rgba(4,5,12,.16) 70%,rgba(4,5,12,.6) 100%)," +
            "radial-gradient(ellipse at 50% 50%,rgba(4,5,12,.08) 18%,rgba(4,5,12,.72) 100%)",
        }}
      />

      <AccentPicker />
      <DepthHud />

      <main className="relative z-10">
        {/* ENTRY */}
        <section
          id="entry"
          className="mx-auto flex min-h-svh max-w-5xl flex-col justify-center gap-6 px-6 py-24 sm:px-10"
        >
          <FadeIn>
            <h1 className="font-space-mono text-[clamp(48px,13vw,150px)] font-bold uppercase leading-[0.85] tracking-tighter [text-shadow:0_6px_60px_rgba(4,5,12,.95)]">
              Preet
              <span className="block text-transparent [-webkit-text-stroke:1px_rgba(200,214,240,.5)]">
                Patel
              </span>
            </h1>
          </FadeIn>

          <FadeIn>
            <p className="max-w-[34ch] font-space-mono text-base text-zinc-200 sm:text-lg [text-shadow:0_2px_22px_rgba(4,5,12,.95)]">
              {hero.description}
            </p>
          </FadeIn>

          <FadeIn>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-space-mono text-[11px] tracking-widest text-zinc-400 [text-shadow:0_2px_16px_rgba(4,5,12,.98)]">
              <span>{hero.location.toUpperCase()}</span>
              <span>
                {workExperience[0].role.toUpperCase()}{" "}
                <span className="text-[color:var(--brand)]">
                  @ {workExperience[0].company.toUpperCase()}
                </span>
              </span>
            </div>
          </FadeIn>

          <FadeIn>
            <div className="flex flex-wrap gap-3 pt-2">
              {hero.socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-zinc-100/20 bg-[#0a0e1e]/50 px-4 py-3 font-space-mono text-[11px] tracking-widest text-zinc-200 backdrop-blur transition-colors hover:border-[color:var(--brand)] hover:text-[color:var(--brand)]"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <TextFlip>{link.name}</TextFlip>
                  </a>
                );
              })}
            </div>
          </FadeIn>

          <FadeIn>
            <p className="pt-6 font-space-mono text-[10px] tracking-[0.2em] text-zinc-500">
              SCROLL TO DESCEND
            </p>
          </FadeIn>
        </section>

        {/* DEPLOYMENT */}
        <Section id="work" index="01" title="DEPLOYMENT">
          <div className="border border-zinc-100/12 bg-[#0a0e1e]/55 p-6 backdrop-blur-md sm:p-9">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="font-space-mono text-xl font-bold sm:text-2xl">
                  {workExperience[0].role}
                </h3>
                <a
                  href={workExperience[0].link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link inline-flex items-center gap-1 font-space-mono text-xs tracking-wider text-[color:var(--brand)]"
                >
                  <TextFlip>{workExperience[0].company.toUpperCase()}</TextFlip>
                  <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover/link:opacity-100" />
                </a>
              </div>
              <span className="font-space-mono text-[11px] tracking-wider text-zinc-500 tabular-nums">
                {workExperience[0].period.toUpperCase()}
              </span>
            </div>

            <p className="my-5 max-w-[58ch] font-space-mono text-sm leading-relaxed text-zinc-400">
              {workExperience[0].description}
            </p>

            <div className="flex flex-wrap gap-2">
              {workExperience[0].tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-zinc-100/12 px-2.5 py-1 font-space-mono text-[11px] text-zinc-400"
                >
                  {tag}
                </span>
              ))}
            </div>

            {education.map((edu) => (
              <div
                key={edu.school}
                className="mt-6 flex flex-col gap-1 border-t border-zinc-100/12 pt-5 sm:flex-row sm:items-start sm:justify-between"
              >
                <div>
                  <h4 className="font-space-mono text-base font-bold">
                    {edu.program}
                  </h4>
                  <a
                    href={edu.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-space-mono text-xs tracking-wider text-[color:var(--brand)]"
                  >
                    {edu.school.toUpperCase()}
                  </a>
                </div>
                <span className="font-space-mono text-[11px] tracking-wider text-zinc-500 tabular-nums">
                  {edu.period.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* ARTIFACTS */}
        <Section id="artifacts" index="02" title="ARTIFACTS">
          <div className="grid gap-4 sm:grid-cols-2">
            {projects.map((project, i) => (
              <article
                key={project.title}
                className="group flex flex-col gap-3 border border-zinc-100/12 bg-[#0a0e1e]/55 p-6 backdrop-blur-md transition-colors hover:border-[color:var(--brand)]/45"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="font-space-mono text-[10px] tracking-[0.16em] text-[color:var(--brand)]">
                    A-{String(i + 1).padStart(2, "0")}
                  </span>
                  {project.featured && (
                    <span className="font-space-mono text-[9px] tracking-[0.12em] text-[#9d7bff]">
                      FEATURED
                    </span>
                  )}
                </div>

                {project.link && project.link !== "#" ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link inline-flex items-center gap-1 font-space-mono text-lg font-bold transition-colors hover:text-[color:var(--brand)]"
                  >
                    <TextFlip>{project.title}</TextFlip>
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover/link:opacity-100" />
                  </a>
                ) : (
                  <h3 className="font-space-mono text-lg font-bold">
                    {project.title}
                  </h3>
                )}

                <p className="flex-1 font-space-mono text-[13px] leading-relaxed text-zinc-400">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-zinc-100/12 px-2 py-1 font-space-mono text-[10px] text-zinc-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </Section>

        {/* EMBEDDING */}
        <Section id="embedding" index="03" title="EMBEDDING">
          <div className="grid items-center gap-8 border border-zinc-100/12 bg-[#0a0e1e]/70 p-5 backdrop-blur-md sm:p-8 lg:grid-cols-[1fr_240px]">
            <SkillCloud />
            <div className="flex flex-col gap-3">
              {CAT_LABEL.map((label, i) => (
                <div
                  key={label}
                  className="flex items-center gap-2.5 font-space-mono text-[11px] tracking-wider text-zinc-400"
                >
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: CAT_COLOR[i] }}
                  />
                  {label.toUpperCase()}
                </div>
              ))}
              <p className="mt-2 border-t border-zinc-100/12 pt-4 font-space-mono text-[10px] leading-loose tracking-wider text-zinc-600">
                24 VECTORS PROJECTED
                <br />
                DRAG TO ROTATE THE MANIFOLD
              </p>
            </div>
          </div>
        </Section>

        {/* ACTIVITY */}
        <Section id="activity" index="04" title="ACTIVITY">
          <div className="border border-zinc-100/12 bg-[#0a0e1e]/55 p-5 backdrop-blur-md sm:p-7">
            <GitHubActivity />
          </div>
        </Section>

        {/* EXIT */}
        <section
          id="exit"
          className="mx-auto flex min-h-[80svh] max-w-5xl flex-col items-center justify-center gap-8 px-6 py-24 text-center sm:px-10"
        >
          <FadeIn>
            <p className="font-space-mono text-[10px] tracking-[0.2em] text-[color:var(--brand)]">
              05 &mdash; EXIT
            </p>
          </FadeIn>
          <FadeIn>
            <h2 className="font-space-mono text-[clamp(34px,8vw,90px)] font-bold uppercase leading-[0.88] tracking-tighter">
              Let&apos;s build
              <br />
              something
            </h2>
          </FadeIn>
          <FadeIn>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={hero.socialLinks[0].href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-[color:var(--brand)] bg-[color:var(--brand)] px-6 py-4 font-space-mono text-[11px] tracking-widest text-[#160d02] transition-opacity hover:opacity-90"
              >
                <Github className="h-4 w-4" />
                GITHUB
              </a>
              <a
                href={hero.socialLinks[1].href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-zinc-100/25 bg-[#0a0e1e]/50 px-6 py-4 font-space-mono text-[11px] tracking-widest text-zinc-200 backdrop-blur transition-colors hover:border-[color:var(--brand)] hover:text-[color:var(--brand)]"
              >
                <Linkedin className="h-4 w-4" />
                LINKEDIN
              </a>
            </div>
          </FadeIn>
          <FadeIn>
            <Link
              href="/projects"
              className="font-space-mono text-[11px] tracking-widest text-zinc-500 underline-offset-4 transition-colors hover:text-[color:var(--brand)] hover:underline"
            >
              SEE ALL PROJECTS
            </Link>
          </FadeIn>
        </section>

        <footer className="pb-12 text-center font-space-mono text-[10px] tracking-widest text-zinc-600">
          &copy; 2026 PREET PATEL &mdash; RENDERED IN REAL TIME WITH THREE.JS
        </footer>
      </main>
    </div>
  );
}

function Section({
  id,
  index,
  title,
  children,
}: {
  id: string;
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mx-auto max-w-5xl px-6 py-24 sm:px-10 sm:py-32">
      <FadeIn>
        <div className="mb-7 flex items-center gap-3">
          <p className="font-space-mono text-[10px] tracking-[0.2em] text-[color:var(--brand)]">
            {index} &mdash; {title}
          </p>
          <span className="h-px flex-1 bg-gradient-to-r from-zinc-100/15 to-transparent" />
        </div>
      </FadeIn>
      <FadeIn>{children}</FadeIn>
    </section>
  );
}
