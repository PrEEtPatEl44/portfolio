import {
  Github,
  Linkedin,
  Mail,
  ArrowUpRight,
  Terminal,
  Cpu,
  MapPin,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const skills = {
  frontend: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
  backend: ["Node.js", "Express", "PostgreSQL", "Prisma"],
  tools: ["Git", "Docker", "VS Code", "Figma"],
  soft: ["Problem Solving", "Communication", "Teamwork", "Agile"],
};

const projects = [
  {
    title: "E-Commerce Dashboard",
    description:
      "A minimal dashboard for tracking sales and inventory with real-time updates.",
    tags: ["React", "TypeScript", "Tailwind"],
    link: "#",
    featured: true,
  },
  {
    title: "Task Manager API",
    description:
      "RESTful API for a collaborative task management tool with authentication.",
    tags: ["Node.js", "Express", "PostgreSQL"],
    link: "#",
  },
  {
    title: "Portfolio V1",
    description:
      "First iteration of my personal portfolio using vanilla JavaScript and CSS.",
    tags: ["HTML", "CSS", "JavaScript"],
    link: "#",
  },
  {
    title: "Weather App",
    description:
      "Location-based weather application utilizing external weather APIs.",
    tags: ["React", "OpenWeatherAPI"],
    link: "#",
  },
];

export default function Home() {
  return (
    <div className="bg-grid-pattern min-h-screen">
      {/* Top accent line - sticky */}
      <div className="sticky top-0 z-50 h-1 w-full bg-brand" />

      <main className="mx-auto max-w-5xl space-y-24 px-8 py-20 sm:px-16">
        {/* Hero Section */}
        <section>
          {/* Name */}
          <h1 className="mb-6 font-[family-name:var(--font-space-mono)] text-5xl font-bold uppercase tracking-tight sm:text-6xl md:text-7xl">
            <span className="text-outline">Alex Dev</span>
            <span className="text-white">.</span>
          </h1>

          {/* Location & Position */}
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:gap-6">
            <div className="flex items-center gap-2 text-zinc-400">
              <MapPin className="h-4 w-4 text-brand" />
              <span className="font-[family-name:var(--font-inter)] text-sm">
                Toronto, Ontario
              </span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400">
              <Building2 className="h-4 w-4 text-brand" />
              <span className="font-[family-name:var(--font-inter)] text-sm">
                Software Developer @ FGF Brands
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="mb-6 max-w-2xl font-[family-name:var(--font-inter)] text-lg leading-relaxed text-zinc-400 sm:text-xl">
            I build accessible, pixel-perfect, performant web experiences.
            Currently focused on <span className="text-brand">React</span> and
            modern frontend ecosystems.
          </p>

          {/* Social links */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-zinc-400 hover:bg-transparent hover:text-brand"
              asChild
            >
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4" />
                <span className="font-[family-name:var(--font-space-mono)] text-xs tracking-wider">
                  GITHUB
                </span>
              </a>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-zinc-400 hover:bg-transparent hover:text-brand"
              asChild
            >
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-4 w-4" />
                <span className="font-[family-name:var(--font-space-mono)] text-xs tracking-wider">
                  LINKEDIN
                </span>
              </a>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-zinc-400 hover:bg-transparent hover:text-brand"
              asChild
            >
              <a href="mailto:hello@example.com">
                <Mail className="h-4 w-4" />
                <span className="font-[family-name:var(--font-space-mono)] text-xs tracking-wider">
                  EMAIL
                </span>
              </a>
            </Button>
          </div>
        </section>

        {/* Projects Section */}
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
                    <h3 className="font-[family-name:var(--font-space-mono)] text-lg font-medium text-white underline-offset-4 transition-all group-hover/link:text-brand group-hover/link:underline">
                      {project.title}
                    </h3>
                    <ArrowUpRight className="h-4 w-4 text-zinc-500 transition-colors group-hover/link:text-brand" />
                  </a>
                  <span className="font-[family-name:var(--font-space-mono)] text-sm text-zinc-600">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Description */}
                <p className="mb-3 font-[family-name:var(--font-inter)] text-sm leading-relaxed text-zinc-400">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="rounded border-zinc-700 bg-transparent font-[family-name:var(--font-space-mono)] text-xs text-zinc-400"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section>
          {/* Section header */}
          <div className="mb-10 flex items-center gap-3">
            <Cpu className="h-5 w-5 text-brand" />
            <h2 className="font-[family-name:var(--font-space-mono)] text-xl tracking-wider text-brand">
              SKILLS
            </h2>
          </div>

          {/* Skills grid */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Frontend */}
            <div>
              <h3 className="mb-3 font-[family-name:var(--font-space-mono)] text-xs font-medium tracking-wider text-brand">
                FRONTEND
              </h3>
              <ul className="space-y-2">
                {skills.frontend.map((skill) => (
                  <li
                    key={skill}
                    className="flex items-center gap-2 font-[family-name:var(--font-inter)] text-sm text-zinc-300"
                  >
                    <span className="h-1 w-1 rounded-full bg-zinc-600" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>

            {/* Backend */}
            <div>
              <h3 className="mb-3 font-[family-name:var(--font-space-mono)] text-xs font-medium tracking-wider text-brand">
                BACKEND
              </h3>
              <ul className="space-y-2">
                {skills.backend.map((skill) => (
                  <li
                    key={skill}
                    className="flex items-center gap-2 font-[family-name:var(--font-inter)] text-sm text-zinc-300"
                  >
                    <span className="h-1 w-1 rounded-full bg-zinc-600" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tools */}
            <div>
              <h3 className="mb-3 font-[family-name:var(--font-space-mono)] text-xs font-medium tracking-wider text-brand">
                TOOLS
              </h3>
              <ul className="space-y-2">
                {skills.tools.map((skill) => (
                  <li
                    key={skill}
                    className="flex items-center gap-2 font-[family-name:var(--font-inter)] text-sm text-zinc-300"
                  >
                    <span className="h-1 w-1 rounded-full bg-zinc-600" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>

            {/* Soft Skills */}
            <div>
              <h3 className="mb-3 font-[family-name:var(--font-space-mono)] text-xs font-medium tracking-wider text-brand">
                SOFT SKILLS
              </h3>
              <ul className="space-y-2">
                {skills.soft.map((skill) => (
                  <li
                    key={skill}
                    className="flex items-center gap-2 font-[family-name:var(--font-inter)] text-sm text-zinc-300"
                  >
                    <span className="h-1 w-1 rounded-full bg-zinc-600" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section>
          <div className="flex flex-col items-center justify-center rounded border border-zinc-800 px-8 py-12 text-center">
            <h2 className="mb-3 font-[family-name:var(--font-space-mono)] text-2xl font-bold text-white sm:text-3xl">
              Let&apos;s work together.
            </h2>
            <p className="mb-6 max-w-md font-[family-name:var(--font-inter)] text-sm text-zinc-400">
              Currently open for new opportunities and interesting projects.
            </p>
            <Button
              className="bg-brand font-[family-name:var(--font-space-mono)] text-white hover:bg-brand/90"
              asChild
            >
              <a href="mailto:hello@example.com">Get in Touch</a>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
