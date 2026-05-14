import Link from "next/link";
import { AddToCartButton } from "@/components/common/AddToCartButton";
import { getHomeData } from "@/lib/api";
import type { HomeData, Product } from "@/lib/types";

const fallbackCategory = {
  _id: "fallback-category",
  name: "Furniture",
  slug: "furniture",
};

const fallbackHomeData: HomeData = {
  hero: {
    title: "Wave Lounge Chair",
    description:
      "This is Photoshop's version of Lorem Ipsum. Proin gravida nibh vel velit auctor aliquet.",
    cta: "ADD TO CART",
    image: "/assets/crops/hero-chair.jpg",
    highlightPrice: 129.99,
  },
  categories: [
    {
      _id: "chairs",
      name: "Chairs",
      slug: "chairs",
      cardImage: "/assets/crops/collection-chair.jpg",
    },
    {
      _id: "beds",
      name: "Beds",
      slug: "beds",
      cardImage: "/assets/crops/collection-bed.jpg",
    },
    {
      _id: "tables",
      name: "Tables",
      slug: "tables",
      cardImage: "/assets/crops/collection-table.jpg",
    },
  ],
  spotlight: {
    featured: [],
    special: [],
    popular: [],
  },
  hotDeals: [
    {
      title: "Elite Collection",
      subtitle: "Design Furniture",
      image: "/assets/crops/hotdeal-left-full.jpg",
      discount: "35%",
    },
    {
      title: "Reclaimed and Hand Crafted",
      subtitle: "Sale Off",
      image: "/assets/crops/hotdeal-right-full.jpg",
      discount: "50%",
    },
  ],
  buyStripImage: "/assets/crops/buy-strip-full.jpg",
  partnerStripImage: "/assets/crops/partners-full.jpg",
  latestPosts: [],
};

const getSafeHomeData = async (): Promise<HomeData> => {
  try {
    return await getHomeData();
  } catch {
    return fallbackHomeData;
  }
};

const SpotlightColumn = ({
  title,
  linkLabel,
  items,
}: {
  title: "Featured" | "Special" | "Popular";
  linkLabel: string;
  items: Product[];
}) => (
  <section className="rustik-card border-[#dcdcdc]">
    <div className="px-6 pt-6">
      <h3 className="border-b border-[#e2e2e2] pb-3 font-[var(--font-display)] text-[24px] uppercase text-[#2f2f2f]">
        {title}
      </h3>
    </div>

    <div className="space-y-2 px-5 py-4">
      {items.map((product) => (
        <article key={product._id} className="flex items-center gap-4 border-b border-[#e8e8e8] py-4">
          <img src={product.image} alt={product.title} className="h-24 w-24 shrink-0 object-contain" />
          <div className="flex-1">
            <p className="line-clamp-2 text-[13px] text-[#595959]">{product.shortDescription}</p>
            <div className="mt-1 flex items-end gap-2">
              <p className="text-[18px] font-semibold leading-none text-[#e17610]">
                {"\u00A3"}
                {product.price.toFixed(2)}
              </p>
              {product.compareAtPrice && product.compareAtPrice > product.price ? (
                <p className="pb-1 text-[13px] text-[#888] line-through">
                  {"\u00A3"}
                  {product.compareAtPrice.toFixed(2)}
                </p>
              ) : null}
            </div>
            <Link href={`/products/${product.slug}`} className="ticket-button mt-2">
              Detail
            </Link>
          </div>
        </article>
      ))}
    </div>

    <div className="border-t border-[#e3e3e3] py-5 text-center">
      <Link href={`/shop?tag=${title.toLowerCase()}`} className="font-[var(--font-display)] text-[19px] hover:text-[#e07610]">
        {linkLabel}
      </Link>
    </div>
  </section>
);

export default async function HomePage() {
  const home = await getSafeHomeData();
  const featuredItems = home.spotlight.featured
    .filter((item) => item.slug !== "wave-lounge-chair")
    .slice(0, 4);
  const heroProduct =
    home.spotlight.featured[0] ||
    home.spotlight.special[0] ||
    home.spotlight.popular[0] || {
      _id: "hero-fallback",
      title: home.hero.title,
      slug: "shop",
      shortDescription: home.hero.description,
      description: home.hero.description,
      price: home.hero.highlightPrice,
      image: home.hero.image,
      category: fallbackCategory,
      stock: 10,
    };

  const updatePosts = home.latestPosts.length
    ? home.latestPosts
    : [
        {
          _id: "1",
          slug: "designing-luxury-bedrooms-with-warm-wood-tones",
          title: "Lorem ipsum",
          excerpt:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          content: "",
          coverImage: "/assets/crops/latest-card-1-full.jpg",
          tags: [],
          author: "Rustik Team",
          isPublished: true,
          publishedAt: new Date().toISOString(),
        },
        {
          _id: "2",
          slug: "choosing-the-right-bed-size-for-urban-apartments",
          title: "Lorem ipsum",
          excerpt:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          content: "",
          coverImage: "/assets/crops/latest-card-2-full.jpg",
          tags: [],
          author: "Rustik Team",
          isPublished: true,
          publishedAt: new Date().toISOString(),
        },
        {
          _id: "3",
          slug: "modern-rustic-furniture-trends-for-2026",
          title: "Lorem ipsum",
          excerpt:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          content: "",
          coverImage: "/assets/crops/latest-card-3-full.jpg",
          tags: [],
          author: "Rustik Team",
          isPublished: true,
          publishedAt: new Date().toISOString(),
        },
      ];

  return (
    <div className="mx-auto max-w-[1100px] space-y-8 px-3 pb-8 pt-1">
      <section className="relative overflow-hidden border border-[#d5d5d5] bg-[linear-gradient(90deg,#ececec_0%,#dedede_52%,#ebebeb_100%)]">
        <div className="grid min-h-[510px] items-center gap-6 px-6 py-7 md:grid-cols-[58%_42%]">
          <div className="flex justify-center">
            <img src={home.hero.image} alt={home.hero.title} className="w-full max-w-[670px]" />
          </div>
          <div className="space-y-4 pr-2 md:pr-5">
            <p className="text-[17px] leading-relaxed text-[#3f3f3f]">
              This is Photoshop&apos;s version of Lorem Ipsum. Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor, nisi elit consequat ipsum, nec sagittis sem nibh id elit.
            </p>
            <div className="flex items-start gap-3">
              <p className="font-[var(--font-display)] text-[76px] leading-none text-[#e1760a]">
                {"\u00A3"}
                {home.hero.highlightPrice.toFixed(2)}
              </p>
              <p className="pt-4 font-[var(--font-display)] text-[30px] uppercase text-[#2f2f2f]">
                Our Price
              </p>
            </div>
            <AddToCartButton
              product={heroProduct}
              label="ADD TO"
              className="rounded-full border border-[#bcbcbc] bg-[#e7e7e7] px-9 py-2 text-[26px] font-semibold text-[#393939] hover:border-[#e1760a] hover:text-[#e1760a]"
            />
          </div>
        </div>

        <svg className="rustik-hero-curve" viewBox="0 0 1100 170" preserveAspectRatio="none">
          <path
            className="secondary"
            d="M0 26 C80 118 170 145 352 145 L614 145 C720 145 801 122 870 68 C942 12 1022 0 1100 2"
          />
          <path
            className="primary"
            d="M2 33 C83 126 170 151 350 151 L613 151 C721 151 804 126 874 72 C946 16 1024 5 1100 6"
          />
        </svg>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {home.categories.map((category) => (
          <Link
            href={`/categories/${category.slug}`}
            key={category._id}
            className="rustik-card flex h-[155px] items-center justify-between gap-3 px-4 py-2 hover:border-[#e07610]"
          >
            <div>
              <p className="font-[var(--font-display)] text-[26px] uppercase leading-none text-[#1f1f1f]">
                {category.name === "Tables" ? "Tabales" : category.name}
              </p>
              <p className="font-[var(--font-display)] text-[24px] uppercase leading-none text-[#dc7a15]">
                Collection
              </p>
            </div>
            <img
              src={category.cardImage || category.image}
              alt={category.name}
              className="h-28 w-40 object-contain"
            />
          </Link>
        ))}
        </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <SpotlightColumn title="Featured" linkLabel="See All Feature" items={featuredItems} />
        <SpotlightColumn title="Special" linkLabel="See All Special" items={home.spotlight.special} />
        <SpotlightColumn title="Popular" linkLabel="See All Popular" items={home.spotlight.popular} />
      </section>

      <section>
        <h2 className="mb-4 text-center font-[var(--font-display)] text-[26px] text-[#2a2a2a]">Hot Deal</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {home.hotDeals.map((deal, index) => (
            <article key={`${deal.title}-${index}`} className="rustik-card overflow-hidden p-[6px]">
              <img src={deal.image} alt={deal.title} className="h-[283px] w-full object-cover" />
            </article>
          ))}
        </div>
      </section>

      <section className="rustik-card overflow-hidden">
        <img src={home.buyStripImage} alt="Buy online banner" className="h-[105px] w-full object-cover" />
      </section>

      <section>
        <h2 className="mb-4 text-center font-[var(--font-display)] text-[26px] text-[#2a2a2a]">
          Latest Updates
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {updatePosts.map((post) => (
            <article key={post._id} className="rustik-card overflow-hidden bg-white">
              <img src={post.coverImage} alt={post.title} className="h-[170px] w-full object-cover" />
              <div className="space-y-3 p-3">
                <h3 className="line-clamp-1 font-[var(--font-display)] text-[16px] text-[#2f2f2f]">
                  {post.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-[#707070]">{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`} className="ticket-button inline-block">
                  Read More
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rustik-card overflow-hidden bg-[#ebebeb] p-0">
        <img
          src={home.partnerStripImage}
          alt="Partner logos"
          className="h-[94px] w-full object-cover object-center"
        />
      </section>
    </div>
  );
}
