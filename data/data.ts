import {
  Code2,
  FileCode,
  Palette,
  Globe,
  Server,
  Database,
  Container,
  GitBranch,
  Figma,
  Braces,
  Layers,
  Zap,
  LucideIcon,
} from "lucide-react";

export interface Skill {
  name: string;
  icon: LucideIcon;
}

export interface WorkExperience {
  company: string;
  role: string;
  period: string;
  description: string;
  tags: string[];
  link: string;
}

export interface Project {
  title: string;
  description: string;
  tags: string[];
  link: string;
  featured?: boolean;
}

export const skills: Skill[] = [
  { name: "React", icon: Code2 },
  { name: "TypeScript", icon: FileCode },
  { name: "Tailwind CSS", icon: Palette },
  { name: "Next.js", icon: Globe },
  { name: "Node.js", icon: Server },
  { name: "Express", icon: Zap },
  { name: "PostgreSQL", icon: Database },
  { name: "Prisma", icon: Layers },
  { name: "Git", icon: GitBranch },
  { name: "Docker", icon: Container },
  { name: "VS Code", icon: Braces },
  { name: "Figma", icon: Figma },
];

export const workExperience: WorkExperience[] = [
  {
    company: "FGF Brands",
    role: "Software Developer",
    period: "2023 - Present",
    description:
      "Building internal tools and web applications to streamline manufacturing processes and improve operational efficiency.",
    tags: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    link: "https://fgfbrands.com",
  },
  {
    company: "Tech Startup",
    role: "Junior Developer",
    period: "2022 - 2023",
    description:
      "Developed and maintained client-facing web applications using modern frontend frameworks.",
    tags: ["React", "JavaScript", "Tailwind CSS"],
    link: "#",
  },
  {
    company: "Freelance",
    role: "Web Developer",
    period: "2021 - 2022",
    description:
      "Built custom websites and web applications for small businesses and startups.",
    tags: ["HTML", "CSS", "JavaScript", "WordPress"],
    link: "#",
  },
];

export const projects: Project[] = [
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
