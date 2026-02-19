import { ArrowLeft, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { FadeIn } from "@/components/ui/fade-in";
import { TextFlip } from "@/components/ui/text-flip";
import { getAllPosts, getPostBySlug } from "@/lib/blog";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-grid-pattern crt min-h-screen">
      <div className="sticky top-0 z-50 h-1 w-full bg-brand" />

      <main className="mx-auto max-w-3xl px-8 py-20 sm:px-16">
        <FadeIn>
          <div>
            <Link
              href="/blogs"
              className="group/link mb-8 inline-flex items-center gap-2 font-space-mono text-sm text-zinc-400 transition-colors hover:text-brand"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover/link:-translate-x-1" />
              <TextFlip>All posts</TextFlip>
            </Link>

            <div className="mb-4 flex items-center gap-4 font-space-mono text-xs text-zinc-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {post.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.readTime}
              </span>
            </div>

            <h1 className="mb-6 font-space-mono text-2xl font-bold text-white sm:text-3xl">
              {post.title}
            </h1>

            <div className="mb-10 h-px w-full bg-zinc-800" />

            <article className="prose-blog font-space-mono text-sm leading-relaxed text-zinc-400">
              <MDXRemote source={post.content} />
            </article>
          </div>
        </FadeIn>
      </main>
    </div>
  );
}
