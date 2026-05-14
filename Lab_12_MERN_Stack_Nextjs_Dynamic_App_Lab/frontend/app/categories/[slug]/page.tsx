import Link from "next/link";
import { ProductCard } from "@/components/common/ProductCard";
import { getCategoryBySlug, getProducts } from "@/lib/api";

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const [category, products] = await Promise.all([
    getCategoryBySlug(params.slug),
    getProducts({ category: params.slug, limit: 24 }),
  ]);

  return (
    <div className="mx-auto max-w-[1160px] px-4 py-8 md:px-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-[46px] leading-none text-[#262626]">{category.name}</h1>
          <p className="mt-2 text-[18px] text-[#5d5d5d]">{category.description}</p>
        </div>
        <Link
          href="/shop"
          className="border border-[#cfcfcf] bg-white px-4 py-2 text-[16px] text-[#4f4f4f] hover:text-[#d97814]"
        >
          View All Products
        </Link>
      </div>

      {products.items.length === 0 ? (
        <div className="rustik-card p-8 text-center text-[22px] text-[#555]">
          No products found in this category.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {products.items.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
