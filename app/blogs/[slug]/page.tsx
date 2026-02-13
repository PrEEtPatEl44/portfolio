import { ArrowLeft, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FadeIn } from "@/components/ui/fade-in";
import { TextFlip } from "@/components/ui/text-flip";
import { blogPosts } from "@/data/data";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

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

            <article className="prose-blog space-y-6 font-space-mono text-sm leading-relaxed text-zinc-400">
              {post.content.split("\n\n").map((block, i) => {
                if (block.startsWith("## ")) {
                  return (
                    <h2
                      key={i}
                      className="mt-8 text-lg font-bold text-white"
                    >
                      {block.replace("## ", "")}
                    </h2>
                  );
                }
                if (block.startsWith("1. ") || block.match(/^\d+\.\s/)) {
                  const items = block.split("\n").filter(Boolean);
                  return (
                    <ol key={i} className="list-decimal space-y-2 pl-5">
                      {items.map((item, j) => (
                        <li key={j}>
                          {item.replace(/^\d+\.\s/, "").split("**").map((part, k) =>
                            k % 2 === 1 ? (
                              <strong key={k} className="text-white">
                                {part}
                              </strong>
                            ) : (
                              part
                            )
                          )}
                        </li>
                      ))}
                    </ol>
                  );
                }
                return (
                  <p key={i}>
                    {block.split("**").map((part, k) =>
                      k % 2 === 1 ? (
                        <strong key={k} className="text-white">
                          {part}
                        </strong>
                      ) : (
                        part
                      )
                    )}
                  </p>
                );
              })}
            </article>
          </div>
        </FadeIn>
      </main>
    </div>
  );
}
