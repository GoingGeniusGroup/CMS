import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { notFound } from "next/navigation";
import { getPublicBlogBySlug } from "@/app/actions/blogs";
import { TiptapRenderer } from "@/components/TiptapRenderer";
import type { JSONContent } from "@tiptap/react";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getPublicBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const publishDate = blog.publishedAt || blog.createdAt;

  return (
    <article className="bg-white">
      {/* Header */}
      <section className="border-b border-zinc-100 bg-[#f7f6f4] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/blogs"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          {blog.category && (
            <span className="mb-3 inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
              {blog.category}
            </span>
          )}

          <h1 className="text-3xl font-extrabold text-zinc-900 sm:text-4xl leading-tight">
            {blog.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-zinc-500">
            {blog.author && (
              <div className="flex items-center gap-2">
                {blog.author.image ? (
                  <Image
                    src={blog.author.image}
                    alt={blog.author.fullName}
                    width={28}
                    height={28}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-4 w-4" />
                )}
                <span className="font-medium text-zinc-700">{blog.author.fullName}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <time dateTime={publishDate.toISOString()}>
                {publishDate.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
          </div>
        </div>
      </section>

      {/* Thumbnail */}
      {blog.thumbnail && (
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-1 aspect-[16/9] overflow-hidden rounded-2xl shadow-lg">
            <Image
              src={blog.thumbnail}
              alt={blog.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      {/* Content */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {blog.content ? (
            <TiptapRenderer content={blog.content as JSONContent} />
          ) : (
            <p className="text-sm text-zinc-500 italic">No content available.</p>
          )}
        </div>
      </section>
    </article>
  );
}
