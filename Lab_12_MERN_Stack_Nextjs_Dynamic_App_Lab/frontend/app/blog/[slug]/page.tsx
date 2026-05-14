import Link from "next/link";
import { getBlogBySlug, getBlogPosts } from "@/lib/api";

export default async function BlogDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const [post, latest] = await Promise.all([
    getBlogBySlug(params.slug),
    getBlogPosts({ limit: 3 }),
  ]);

  return (
    <div className="mx-auto max-w-[1160px] space-y-8 px-4 py-8 md:px-6">
      <article className="rustik-card overflow-hidden bg-white">
        <img src={post.coverImage} alt={post.title} className="h-[360px] w-full object-cover" />
        <div className="space-y-5 p-6 md:p-8">
          <h1 className="text-[50px] leading-none text-[#252525]">{post.title}</h1>
          <p className="text-[17px] text-[#7b7b7b]">
            {new Date(post.publishedAt).toLocaleDateString()} by {post.author}
          </p>
          <p className="text-[21px] leading-relaxed text-[#565656]">{post.content}</p>
          {post.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-[#d5d5d5] bg-[#f6f6f6] px-3 py-1 text-[14px] uppercase text-[#555]"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </article>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[56px] text-[#2d2d2d]">More Updates</h2>
          <Link href="/blog" className="text-[18px] text-[#5f5f5f] hover:text-[#d97814]">
            All Posts
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {latest.items
            .filter((item) => item.slug !== post.slug)
            .slice(0, 3)
            .map((item) => (
              <article key={item._id} className="rustik-card overflow-hidden bg-white">
                <img src={item.coverImage} alt={item.title} className="h-44 w-full object-cover" />
                <div className="space-y-2 p-4">
                  <h3 className="text-[34px] leading-tight text-[#2c2c2c]">{item.title}</h3>
                  <Link href={`/blog/${item.slug}`} className="ticket-button inline-block">
                    Read
                  </Link>
                </div>
              </article>
            ))}
        </div>
      </section>
    </div>
  );
}
