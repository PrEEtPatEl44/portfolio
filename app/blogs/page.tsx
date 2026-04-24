import { ArrowLeft, Calendar, Clock, FileText } from "lucide-react";
import Link from "next/link";
import { FadeIn } from "@/components/ui/fade-in";
import { TextFlip } from "@/components/ui/text-flip";
import { TerminalBox } from "@/components/ui/terminal-box";
import { getAllPosts } from "@/lib/blog";

export default function BlogsPage() {
  const blogPosts = getAllPosts();

  return (
    <div className="bg-grid-pattern crt min-h-screen">
      <div className="sticky top-0 z-50 h-1 w-full bg-brand" />

      <main className="mx-auto max-w-3xl space-y-8 px-6 py-12 sm:px-8">
        <FadeIn>
          <div>
            <Link
              href="/"
              className="group/link mb-8 inline-flex items-center gap-2 font-space-mono text-xs text-zinc-400 transition-colors hover:text-brand"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover/link:-translate-x-1" />
              <TextFlip>Back</TextFlip>
            </Link>

            <div className="mb-5 flex items-center gap-3">
              <FileText className="h-5 w-5 text-brand" />
              <h1 className="font-space-mono text-xl font-bold tracking-wider text-brand">
                ALL POSTS
              </h1>
            </div>
          </div>
        </FadeIn>

        <div className="space-y-3">
          {blogPosts.map((post) => (
            <FadeIn key={post.slug}>
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
                  <h2 className="mb-1 font-space-mono text-sm font-medium text-white transition-colors group-hover:text-brand">
                    {post.title}
                  </h2>
                  <p className="font-space-mono text-xs text-zinc-400">
                    {post.description}
                  </p>
                </TerminalBox>
              </Link>
            </FadeIn>
          ))}
        </div>
      </main>
    </div>
  );
}
