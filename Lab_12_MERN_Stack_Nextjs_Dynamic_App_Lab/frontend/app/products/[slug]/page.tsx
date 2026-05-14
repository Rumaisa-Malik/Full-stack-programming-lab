import Link from "next/link";
import { AddToCartButton } from "@/components/common/AddToCartButton";
import { ProductCard } from "@/components/common/ProductCard";
import { getProductBySlug, getRelatedProducts } from "@/lib/api";

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const [product, related] = await Promise.all([
    getProductBySlug(params.slug),
    getRelatedProducts(params.slug),
  ]);

  return (
    <div className="mx-auto max-w-[1160px] space-y-8 px-4 py-8 md:px-6">
      <section className="rustik-card p-6 md:p-8">
        <div className="grid gap-7 md:grid-cols-[1fr_1.1fr]">
          <div className="flex items-center justify-center bg-[#f5f5f5] p-4">
            <img src={product.image} alt={product.title} className="max-h-[430px] w-full object-contain" />
          </div>

          <div className="space-y-5">
            <p className="text-[16px] uppercase tracking-wide text-[#767676]">
              {product.category?.name || "Category"}
            </p>
            <h1 className="text-[50px] leading-none text-[#262626]">{product.title}</h1>
            <p className="text-[19px] leading-relaxed text-[#5a5a5a]">{product.description}</p>

            <div className="flex flex-wrap items-center gap-4">
              <p className="text-[56px] leading-none text-[#e1760a]">£{product.price.toFixed(2)}</p>
              {product.compareAtPrice && product.compareAtPrice > product.price ? (
                <p className="text-[28px] text-[#8f8f8f] line-through">
                  £{product.compareAtPrice.toFixed(2)}
                </p>
              ) : null}
            </div>

            <p className="text-[16px] text-[#555]">
              {product.stock > 0 ? `${product.stock} items in stock` : "Currently out of stock"}
            </p>

            <AddToCartButton
              product={product}
              className="rounded-full border border-[#bcbcbc] bg-[#ececec] px-8 py-3 text-[24px] font-semibold text-[#333] hover:border-[#e1760a] hover:text-[#e1760a]"
              label="Add to Cart"
            />

            <div className="border-t border-[#dbdbdb] pt-4">
              <h2 className="mb-3 text-[38px] text-[#2f2f2f]">Specifications</h2>
              <dl className="space-y-2 text-[17px] text-[#575757]">
                {(product.specifications || []).map((spec) => (
                  <div key={`${spec.label}-${spec.value}`} className="grid grid-cols-[170px_1fr] gap-2">
                    <dt className="font-semibold">{spec.label}</dt>
                    <dd>{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[58px] text-[#252525]">Related Products</h2>
            <Link href="/shop" className="text-[18px] text-[#5f5f5f] hover:text-[#e1760a]">
              View Shop
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
