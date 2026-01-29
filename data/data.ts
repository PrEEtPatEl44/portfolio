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
  Mail,
  Cloud,
  Brain,
  Eye,
  TestTube,
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
  name: "Preet Patel",
  location: "Toronto, Ontario",
  position: "Software Developer @ FGF Brands",
  description:
    "i love building things and solving problems. since starting CS in 2022, i've been diving deep into everything from web development to algorithms, always chasing that feeling when code finally clicks into place. when i'm not trying to vibe-code my life. i'm probably watching movies or obsessing over mechanical keyboards.",
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
    {
      name: "EMAIL",
      href: "mailto:preetp4404@gmail.com",
      icon: Mail,
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
];

export const education: Education[] = [
  {
    school: "Seneca Polytechnic",
    program: "Computer Programming and Analysis, Advanced Diploma",
    period: "May 2023 - Dec. 2025",
    link: "https://www.senecapolytechnic.ca",
  },
];

export const workExperience: WorkExperience[] = [
  {
    company: "FGF Brands",
    role: "Software Developer Intern",
    period: "Sept. 2024 - May. 2025, Jan. 2026 - Present",
    description:
      "Building internal tools and web applications to streamline manufacturing processes and improve operational efficiency.",
    tags: [
      ".NET",
      "C#",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "SQL Server",
      "Azure",
      "Python",
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
      "An AI Based Job Search helper which helps users through every step of the job search journey.",
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
      "A lightweight Node.js/Express-based backend REST API for managing fragments of data hosted on AWS S3.",
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
      "A self-driving car simulation using deep learning. It covers the full workflow from data preprocessing and image augmentation to training a convolutional neural network to predict steering angles from camera images.",
    tags: ["Python", "TensorFlow", "Keras", "OpenCV"],
    link: "https://github.com/PrEEtPatEl44/CarSimProject",
    featured: true,
  },
  {
    title: "DevOps Companion",
    description:
      "An AI powered bot that assists project managers for their daily workflows That won FGF Case Competition 2024.",
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
];
