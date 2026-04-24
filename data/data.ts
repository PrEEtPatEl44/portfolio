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
  Github,
  Linkedin,
  Cloud,
  Brain,
  Eye,
  TestTube,
  MousePointerClick,
  Bot,
  Search,
  Link as LinkIcon,
  Network,
  Users,
  LucideIcon,
} from "lucide-react";

export interface SocialLink {
  name: string;
  href: string;
  icon: LucideIcon;
}

export interface Hero {
  name: string;
  location: string;
  position: string;
  description: string;
  socialLinks: SocialLink[];
}

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

export interface Education {
  school: string;
  program: string;
  period: string;
  link?: string;
}

export interface Project {
  title: string;
  description: string;
  tags: string[];
  link: string;
  featured?: boolean;
}

export const hero: Hero = {
  name: "PREET PATEL",
  location: "Toronto, Ontario",
  position: "Software Developer @ FGF Brands",
  description: "Shipping agents before they ship me.",
  socialLinks: [
    {
      name: "GITHUB",
      href: "https://github.com/PrEEtPatEl44",
      icon: Github,
    },
    {
      name: "LINKEDIN",
      href: "https://www.linkedin.com/in/preet-patel44/",
      icon: Linkedin,
    },
  ],
};

export const skills: Skill[] = [
  { name: "React", icon: Code2 },
  { name: "TypeScript", icon: FileCode },
  { name: "Next.js", icon: Globe },
  { name: "Node.js", icon: Server },
  { name: "Express", icon: Zap },
  { name: "Python", icon: Braces },
  { name: "C# / .NET", icon: Layers },
  { name: "PostgreSQL", icon: Database },
  { name: "SQL Server", icon: Database },
  { name: "Azure", icon: Cloud },
  { name: "AWS", icon: Cloud },
  { name: "Docker", icon: Container },
  { name: "Git", icon: GitBranch },
  { name: "TensorFlow", icon: Brain },
  { name: "OpenCV", icon: Eye },
  { name: "Jest", icon: TestTube },
  { name: "Tailwind CSS", icon: Palette },
  { name: "Figma", icon: Figma },
  { name: "Cursor", icon: MousePointerClick },
  { name: "Claude Code", icon: Bot },
  { name: "RAG", icon: Search },
  { name: "LangChain", icon: LinkIcon },
  { name: "LangGraph", icon: Network },
  { name: "DeepAgents", icon: Users },
];

export const education: Education[] = [
  {
    school: "Seneca Polytechnic",
    program: "Computer Programming and Analysis",
    period: "May 2023 - Dec. 2025",
    link: "https://www.senecapolytechnic.ca",
  },
];

export const workExperience: WorkExperience[] = [
  {
    company: "FGF Brands",
    role: "Software Developer Intern",
    period: "Present",
    description:
      "Shipping Internal AI tools with AI tools at light speed.",
    tags: [
      "Python",
      "TypeScript",
      "Node.js",
      "Azure",
      ".NET",
      "C#",
      "PostgreSQL",
      "SQL Server"
    ],
    link: "https://fgfbrands.com",
  },
  // {
  //   company: "Tech Startup",
  //   role: "Junior Developer",
  //   period: "2022 - 2023",
  //   description:
  //     "Developed and maintained client-facing web applications using modern frontend frameworks.",
  //   tags: ["React", "JavaScript", "Tailwind CSS"],
  //   link: "#",
  // },
  // {
  //   company: "Freelance",
  //   role: "Web Developer",
  //   period: "2021 - 2022",
  //   description:
  //     "Built custom websites and web applications for small businesses and startups.",
  //   tags: ["HTML", "CSS", "JavaScript", "WordPress"],
  //   link: "#",
  // },
];

export const projects: Project[] = [
  {
    title: "Prepify",
    description:
      "RAG-powered job-search copilot. Résumé in, interviews out.",
    tags: [
      "React",
      "TypeScript",
      "OpenAI API",
      "LangChain",
      "Supabase",
      "PostgreSQL",
    ],
    link: "https://github.com/PrEEtPatEl44/prepify",
  },
  {
    title: "Fragments",
    description:
      "Stateless REST API for chunked data on S3. Dockerized, Hurl-tested.",
    tags: [
      "Next.js",
      "Node.js",
      "Express",
      "TypeScript",
      "Jest",
      "Hurl",
      "Docker",
      "AWS",
      "S3",
      "EC2",
    ],
    link: "#",
  },
  {
    title: "Self-Driving Car CNN",
    description:
      "CNN that steers from raw camera frames — pixels to angles, end-to-end.",
    tags: ["Python", "TensorFlow", "Keras", "OpenCV"],
    link: "https://github.com/PrEEtPatEl44/CarSimProject",
    featured: true,
  },
  {
    title: "DevOps Companion",
    description:
      "Agentic bot for PM workflows on Azure DevOps. Won FGF Case Comp 2024.",
    tags: [
      "PostgreSQL",
      "OpenAI API",
      "Python",
      "TypeScript",
      "React",
      "Azure DevOps",
    ],
    link: "#",
  },
  {
    title: "Reels DeepAgents",
    description:
      "Multi-agent pipeline that scripts, scores, and stitches short-form reels.",
    tags: ["Python", "DeepAgents", "LangGraph", "LLMs"],
    link: "https://github.com/PrEEtPatEl44/reels-deepagents/",
  },
];
