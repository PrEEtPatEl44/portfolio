import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TextFlip } from "@/components/ui/text-flip";
import { BGPattern } from "@/components/ui/bg-pattern";
import { SortableTags } from "@/components/ui/sortable-tags";
import { BentoWorkspace } from "@/components/ui/bento-workspace";
import { BentoTile } from "@/components/ui/bento-tile";
import { ProjectDeck } from "@/components/ui/project-deck";
import { WorkLog } from "@/components/ui/work-log";
import { GitHubActivity } from "@/components/ui/github-activity";
import { hero, skills, workExperience, projects, education } from "@/data/data";

function Entry({ index, children }: { index: number; children: ReactNode }) {
  return (
    <article className="workspace-entry">
      <span className="workspace-entry-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
      <div className="min-w-0 flex-1">{children}</div>
    </article>
  );
}

export const revalidate = 3600;

export default function Home() {
  return (
    <div className="portfolio-home crt relative isolate min-h-screen">
      <BGPattern className="portfolio-grid-background" variant="grid" mask="none" size={40} fill="var(--grid-fill)" />
      <BentoWorkspace intro={{
        name: hero.name,
        location: hero.location,
        role: workExperience[0].role,
        company: workExperience[0].company,
        description: hero.description,
        today: new Date().toISOString().slice(0, 10),
        links: hero.socialLinks.map(({ name, href }) => ({ name, href })),
      }}>
        <ProjectDeck projects={projects.map(({ title, description, tags, link, featured }) => ({ title, description, tags, link, featured }))} />

        <WorkLog jobs={workExperience.map(({ company, role, period, description, tags, link }) => ({ company, role, period, description, tags, link }))} />

        <BentoTile id="education" title="Education" filename="education.md">
          {education.map((edu, index) => (
            <Entry key={edu.school} index={index}>
              <h3 className="workspace-entry-title">{edu.program}</h3>
              {edu.link ? <a href={edu.link} target="_blank" rel="noopener noreferrer" className="workspace-link">{edu.school}<ArrowUpRight className="h-3 w-3" /></a> : <p className="text-xs text-brand">{edu.school}</p>}
              <p className="workspace-period mt-1">{edu.period}</p>
            </Entry>
          ))}
        </BentoTile>

        <BentoTile id="contact" title="Contact" filename="next.md">
          <div className="px-4 py-4">
            <h3 className="mb-3 text-[15px] font-bold leading-snug text-foreground">Let&apos;s work together.</h3>
            <a href={hero.socialLinks[1].href} target="_blank" rel="noopener noreferrer" className="workspace-contact-link">get in touch <ArrowUpRight className="h-3.5 w-3.5" /></a>
          </div>
        </BentoTile>

        <BentoTile id="skills" title="Skills" filename="toolbox.json" type="JS">
          <div className="px-4 py-4">
            <SortableTags className="flex flex-wrap gap-1.5" items={skills.map((skill) => {
              const Icon = skill.icon;
              return {
                key: skill.name,
                node: <Badge variant="outline" className="workspace-tag gap-1.5"><Icon className="h-3 w-3 text-brand" /><TextFlip>{skill.name}</TextFlip></Badge>,
              };
            })} />
          </div>
        </BentoTile>

        <BentoTile id="activity" title="Activity" filename="git.log" type="GIT">
          <div className="min-w-0 px-4 py-4"><GitHubActivity fit /></div>
        </BentoTile>
      </BentoWorkspace>
    </div>
  );
}
