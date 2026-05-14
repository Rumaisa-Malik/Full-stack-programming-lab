import Link from "next/link";
import { ProductCard } from "@/components/common/ProductCard";
import { getCategories, getProducts } from "@/lib/api";

type SearchValue = string | string[] | undefined;

const getValue = (value: SearchValue) => (Array.isArray(value) ? value[0] : value);

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { [key: string]: SearchValue };
}) {
  const page = Number(getValue(searchParams.page) || 1);
  const category = getValue(searchParams.category) || "";
  const search = getValue(searchParams.search) || "";
  const tag = getValue(searchParams.tag) || "";
  const sort = getValue(searchParams.sort) || "latest";

  const [productsResponse, categories] = await Promise.all([
    getProducts({
      page,
      limit: 9,
      category,
      search,
      tag,
      sort,
    }),
    getCategories(true),
  ]);

  const paginationLinks = Array.from(
    { length: productsResponse.pagination.totalPages },
    (_, index) => index + 1
  );

  const createQuery = (overrides: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (tag) params.set("tag", tag);
    if (sort) params.set("sort", sort);
    params.set("page", String(page));

    Object.entries(overrides).forEach(([key, value]) => {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    return `/shop?${params.toString()}`;
  };

  return (
    <div className="mx-auto max-w-[1160px] px-4 py-8 md:px-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[46px] text-[#262626]">Shop Furniture</h1>
        <Link
          href="/"
          className="border border-[#d5d5d5] bg-white px-4 py-2 text-[16px] text-[#4d4d4d] hover:text-[#d97814]"
        >
          Back to Home
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-6">
          <section className="rustik-card p-5">
            <h2 className="mb-3 text-[44px] text-[#2e2e2e]">Categories</h2>
            <ul className="space-y-2">
              <li>
                <Link
                  href={createQuery({ category: undefined, page: 1 })}
                  className={`text-[20px] ${!category ? "text-[#d97814]" : "text-[#444]"}`}
                >
                  All Products
                </Link>
              </li>
              {categories.map((item) => (
                <li key={item._id} className="flex items-center justify-between">
                  <Link
                    href={createQuery({ category: item.slug, page: 1 })}
                    className={`text-[20px] ${
                      category === item.slug ? "text-[#d97814]" : "text-[#444]"
                    }`}
                  >
                    {item.name}
                  </Link>
                  <span className="text-[15px] text-[#777]">({item.productCount || 0})</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rustik-card p-5">
            <h2 className="mb-3 text-[44px] text-[#2e2e2e]">Sort</h2>
            <div className="space-y-2 text-[18px]">
              <Link
                href={createQuery({ sort: "latest", page: 1 })}
                className={sort === "latest" ? "text-[#d97814]" : "text-[#4f4f4f]"}
              >
                Latest
              </Link>
              <Link
                href={createQuery({ sort: "price_asc", page: 1 })}
                className={sort === "price_asc" ? "text-[#d97814]" : "text-[#4f4f4f]"}
              >
                Price: Low to High
              </Link>
              <Link
                href={createQuery({ sort: "price_desc", page: 1 })}
                className={sort === "price_desc" ? "text-[#d97814]" : "text-[#4f4f4f]"}
              >
                Price: High to Low
              </Link>
            </div>
          </section>
        </aside>

        <section className="space-y-6">
          {productsResponse.items.length === 0 ? (
            <div className="rustik-card p-8 text-center text-[22px] text-[#565656]">
              No products found for the selected filters.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {productsResponse.items.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {paginationLinks.length > 1 ? (
            <div className="flex flex-wrap gap-2">
              {paginationLinks.map((pageNumber) => (
                <Link
                  key={pageNumber}
                  href={createQuery({ page: pageNumber })}
                  className={`border px-3 py-1 text-[16px] ${
                    pageNumber === page
                      ? "border-[#d97814] bg-[#d97814] text-white"
                      : "border-[#cfcfcf] bg-white text-[#555]"
                  }`}
                >
                  {pageNumber}
                </Link>
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
