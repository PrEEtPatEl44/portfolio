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
  Twitter,
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

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  content: string;
}

export const hero: Hero = {
  name: "PREET PATEL",
  location: "Toronto, Ontario",
  position: "Software Developer @ FGF Brands",
  description:
    "I love building things and solving problems. Since starting CS in 2022, I’ve been constantly experimenting and learning by doing. These days, I’m focused on discovering and running local AI models, tweaking setups, and understanding the tradeoffs between performance, memory, and hardware. When I’m not doing that, I’m probably watching movies or working on side projects.",
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
      name: "X",
      href: "https://x.com/prabornn",
      icon: Twitter,
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

export const blogPosts: BlogPost[] = [
  {
    slug: "running-local-llms",
    title: "Running Local LLMs: What I've Learned So Far",
    description:
      "A practical look at running open-source language models locally — the hardware tradeoffs, quantization tricks, and why I think local AI is worth the effort.",
    date: "Feb 8, 2026",
    readTime: "5 min read",
    content: `Over the past few months, I've been deep into running large language models locally on my own hardware. It started as curiosity — could I actually run something useful without relying on cloud APIs? Turns out, the answer is yes, but with caveats.

## Why Local?

The appeal is simple: privacy, no API costs, and the ability to experiment freely. When you're iterating on prompts or fine-tuning workflows, not having to worry about rate limits or per-token pricing is liberating.

## Hardware Reality Check

I'm running a desktop with 32GB RAM and an RTX 3080 (10GB VRAM). That's enough to run 7B–13B parameter models comfortably with quantization. Anything larger requires offloading layers to CPU, which tanks performance.

The key insight: **VRAM is the bottleneck**, not CPU or system RAM. A model that fits entirely in VRAM will run 5–10x faster than one that spills over.

## Quantization is Your Friend

Running a full-precision 13B model requires ~26GB of VRAM. With 4-bit quantization (GPTQ or GGUF), that drops to ~7GB. The quality loss is surprisingly minimal for most tasks — coding assistance, summarization, and general Q&A work great.

Tools like llama.cpp and ollama have made this incredibly accessible. A single command can download and run a quantized model.

## What Actually Works

For coding tasks, CodeLlama 13B quantized to 4-bit has been my daily driver. It handles autocomplete, refactoring suggestions, and explaining code well enough that I rarely reach for cloud APIs anymore.

For general conversation and writing, Mistral 7B punches way above its weight class. Fast inference and genuinely useful outputs.

## The Tradeoffs

Local models aren't replacing GPT-4 or Claude for complex reasoning tasks. They struggle with nuanced instructions, long-context problems, and tasks requiring broad world knowledge. But for focused, domain-specific work? They're more than good enough.

The ecosystem is moving fast. What required a PhD and a cluster two years ago now runs on a gaming PC. I'm excited to see where this goes.`,
  },
  {
    slug: "why-i-build-side-projects",
    title: "Why I Build Side Projects (Even When No One Uses Them)",
    description:
      "Side projects aren't about going viral — they're about learning faster, staying curious, and building the muscle memory that makes you better at your day job.",
    date: "Jan 22, 2026",
    readTime: "4 min read",
    content: `I have a graveyard of side projects. Unfinished apps, abandoned repos, half-baked ideas that never saw the light of day. And honestly? I don't regret a single one.

## The Real Value

Every side project teaches you something your day job won't. At work, you operate within constraints — existing codebases, team conventions, established tech stacks. Side projects let you break free from all of that.

Want to try Rust? Build something in Rust. Curious about WebSockets? Build a real-time app. The best way to learn a technology is to use it to solve a problem you actually care about.

## Learning by Doing > Tutorials

I've watched countless tutorial videos and read dozens of "Getting Started" guides. They help with the basics, but real understanding comes from hitting errors, debugging weird edge cases, and figuring out why your code doesn't work at 2 AM.

My self-driving car CNN project started as "I wonder if I can make a car drive itself in a simulator." The answer was yes, but getting there meant learning about image preprocessing, data augmentation, neural network architectures, and a whole lot of TensorFlow debugging.

## The Portfolio Effect

Here's a practical benefit: side projects are the best thing on your resume when you're early in your career. Anyone can list "React" as a skill. But linking to a project where you actually built something meaningful? That tells a story.

When I interview candidates, I'm way more interested in someone who built a janky but functional app than someone who completed 50 LeetCode problems. Building things demonstrates initiative, problem-solving, and follow-through.

## Shipping is Optional

Not every project needs to be finished. Not every project needs users. Some of my most valuable learning experiences came from projects I abandoned after a few weeks. The point isn't the destination — it's what you learn along the way.

That said, finishing things is a skill too. If you can push through the boring middle part and actually ship something, that's worth celebrating.

## My Advice

Start small. Pick a problem that annoys you personally. Use a technology you want to learn. Don't worry about making it perfect — just make it work. The rest will follow.`,
  },
  {
    slug: "dotnet-to-nextjs",
    title: "From .NET to Next.js: Lessons from Switching Stacks",
    description:
      "What building with C# and .NET at work taught me about JavaScript frameworks, and how jumping between stacks made me a better developer.",
    date: "Jan 5, 2026",
    readTime: "6 min read",
    content: `At my day job, I write C# and .NET. My personal projects are all TypeScript and Next.js. Switching between these two worlds daily has taught me more about software development than sticking with either one alone.

## Two Different Philosophies

.NET is opinionated and structured. You get dependency injection out of the box, strong typing everywhere, and a clear way to organize your code. The framework makes decisions for you, and that's mostly a good thing in a team environment.

Next.js (and the React ecosystem) is the opposite. You choose your state management, your data fetching strategy, your styling approach, your folder structure. The flexibility is powerful but can lead to decision fatigue.

## What .NET Taught Me About JavaScript

Working with C#'s type system made me appreciate TypeScript on a deeper level. Once you've experienced the safety of compile-time checks catching bugs before they reach production, going back to untyped JavaScript feels reckless.

.NET's middleware pipeline also gave me a mental model for understanding Next.js middleware and API routes. The concepts transfer even when the syntax doesn't.

## What Next.js Taught Me About .NET

React's component model changed how I think about UI code everywhere. The idea of composable, reusable pieces of UI that manage their own state is universal. I've started applying similar patterns in Razor components.

The JavaScript ecosystem's speed of iteration also pushed me to stay current with .NET updates. Both worlds are evolving fast.

## The Polyglot Advantage

The biggest lesson: **learning multiple stacks makes you better at each individual one.** You start seeing patterns that transcend any single language or framework. Error handling, state management, authentication flows — the concepts are the same everywhere. Only the syntax changes.

If you're early in your career, I'd strongly recommend working in at least two different tech stacks. It'll accelerate your growth more than going deep in just one.

## Practical Tips for Stack Switching

1. **Don't fight the conventions.** Use C# naming conventions in C# and JavaScript conventions in JS. Trying to write C#-style JavaScript (or vice versa) just creates confusing code.
2. **Leverage the type system.** TypeScript and C# both have great type systems. Use them fully — they catch bugs for free.
3. **Learn the debugging tools.** Visual Studio's debugger is incredible for .NET. Chrome DevTools is incredible for JS. Master both.
4. **Keep a cheat sheet.** When switching contexts, having a quick reference for common patterns saves time and reduces mental load.`,
  },
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
