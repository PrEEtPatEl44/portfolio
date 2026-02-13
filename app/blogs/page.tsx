import { ArrowLeft, Calendar, Clock, FileText } from "lucide-react";
import Link from "next/link";
import { FadeIn } from "@/components/ui/fade-in";
import { TextFlip } from "@/components/ui/text-flip";
import { blogPosts } from "@/data/data";

export default function BlogsPage() {
  return (
    <div className="bg-grid-pattern crt min-h-screen">
      <div className="sticky top-0 z-50 h-1 w-full bg-brand" />

      <main className="mx-auto max-w-5xl space-y-16 px-8 py-20 sm:px-16">
        <FadeIn>
          <div>
            <Link
              href="/"
              className="group/link mb-8 inline-flex items-center gap-2 font-space-mono text-sm text-zinc-400 transition-colors hover:text-brand"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover/link:-translate-x-1" />
              <TextFlip>Back</TextFlip>
            </Link>

            <div className="mb-10 flex items-center gap-3">
              <FileText className="h-5 w-5 text-brand" />
              <h1 className="font-space-mono text-2xl font-bold tracking-wider text-brand">
                ALL POSTS
              </h1>
            </div>
          </div>
        </FadeIn>

        <div className="space-y-6">
          {blogPosts.map((post) => (
            <FadeIn key={post.slug}>
              <Link
                href={`/blogs/${post.slug}`}
                className="group block border border-zinc-800 bg-black/50 p-5 transition-colors hover:border-brand/50"
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
                <h2 className="mb-1 font-space-mono text-base font-medium text-white transition-colors group-hover:text-brand">
                  {post.title}
                </h2>
                <p className="font-space-mono text-sm text-zinc-400">
                  {post.description}
                </p>
              </Link>
            </FadeIn>
          ))}
        </div>
      </main>
    </div>
  );
}
