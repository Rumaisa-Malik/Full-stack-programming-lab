import Link from "next/link";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => (
  <article className="group overflow-hidden border border-[#d9d9d9] bg-white shadow-sm">
    <Link href={`/products/${product.slug}`} className="block bg-[#f4f4f4] p-3">
      <div className="flex h-56 items-center justify-center">
        <img
          src={product.image}
          alt={product.title}
          className="h-full max-h-52 w-full max-w-52 object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    </Link>

    <div className="space-y-3 p-4">
      <h3 className="text-[26px] font-semibold leading-tight text-[#242424]">
        <Link href={`/products/${product.slug}`} className="hover:text-[#d97714]">
          {product.title}
        </Link>
      </h3>

      <p className="line-clamp-2 text-[15px] text-[#5d5d5d]">{product.shortDescription}</p>

      <div className="flex items-end gap-2">
        <p className="text-[30px] font-semibold text-[#e07109]">£{product.price.toFixed(2)}</p>
        {product.compareAtPrice && product.compareAtPrice > product.price ? (
          <p className="pb-1 text-[15px] text-[#8b8b8b] line-through">
            £{product.compareAtPrice.toFixed(2)}
          </p>
        ) : null}
      </div>

      <Link
        href={`/products/${product.slug}`}
        className="inline-block border border-[#d0d0d0] bg-[#f5f5f5] px-6 py-2 text-[15px] font-semibold text-[#3b3b3b] transition hover:border-[#e07109] hover:text-[#e07109]"
      >
        Detail
      </Link>
    </div>
  </article>
);
