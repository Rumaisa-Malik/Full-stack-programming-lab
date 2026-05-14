import Link from "next/link";
import { getBlogPosts } from "@/lib/api";

type SearchValue = string | string[] | undefined;
const valueFrom = (value: SearchValue) => (Array.isArray(value) ? value[0] : value);

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { [key: string]: SearchValue };
}) {
  const page = Number(valueFrom(searchParams.page) || 1);
  const posts = await getBlogPosts({ page, limit: 6 });

  return (
    <div className="mx-auto max-w-[1160px] px-4 py-8 md:px-6">
      <h1 className="mb-6 text-[46px] text-[#262626]">Latest Updates</h1>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {posts.items.map((post) => (
          <article key={post._id} className="rustik-card overflow-hidden bg-white">
            <img src={post.coverImage} alt={post.title} className="h-52 w-full object-cover" />
            <div className="space-y-3 p-5">
              <h2 className="text-[42px] leading-tight text-[#282828]">{post.title}</h2>
              <p className="text-[16px] text-[#666]">{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className="ticket-button inline-block">
                Read More
              </Link>
            </div>
          </article>
        ))}
      </div>

      {posts.pagination.totalPages > 1 ? (
        <div className="mt-8 flex gap-2">
          {Array.from({ length: posts.pagination.totalPages }, (_, index) => index + 1).map(
            (num) => (
              <Link
                key={num}
                href={`/blog?page=${num}`}
                className={`border px-3 py-1 text-[16px] ${
                  num === page
                    ? "border-[#d97814] bg-[#d97814] text-white"
                    : "border-[#cbcbcb] bg-white text-[#535353]"
                }`}
              >
                {num}
              </Link>
            )
          )}
        </div>
      ) : null}
    </div>
  );
}
