import Link from "next/link";

const columns = [
  {
    title: "Informations",
    links: [
      "Terms and conditions",
      "About us",
      "Sitemap",
      "Contact",
      "Return policy",
      "Suppliers",
    ],
  },
  {
    title: "My Account",
    links: [
      "Your Account",
      "Information",
      "Addresses",
      "Orders history",
      "Delivery Information",
      "Search Terms",
    ],
  },
  {
    title: "Help and More",
    links: ["New products", "Top sellers", "Manufacturers", "Suppliers", "Specials"],
  },
  {
    title: "Links",
    links: ["Delivery", "Service", "Gift Cards", "Mobile", "Manufacturers"],
  },
];

export const Footer = () => (
  <footer className="mt-14 border-t border-[#cbcbcb] bg-[linear-gradient(120deg,#dadada_0%,#efefef_48%,#d6d6d6_100%)]">
    <div className="mx-auto max-w-[1100px] rounded-b-[45px] border-x border-b border-[#bbbbbb] px-5 pb-8 pt-9 md:px-8">
      <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
        {columns.map((column) => (
          <div key={column.title}>
            <h3 className="mb-4 font-[var(--font-display)] text-[18px] font-semibold uppercase tracking-wide text-[#da821f]">
              {column.title}
            </h3>
            <ul className="space-y-2 text-[12px] text-[#393939]">
              {column.links.map((link) => (
                <li key={link}>
                  <Link href="/shop" className="hover:text-[#dc7d17]">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-10 border-t border-[#c8c8c8] pt-5 text-center text-[13px] text-[#565656]">
        {"\u00A9"} 2014 Rustik Plank Furniture . All Rights Reserved .
      </p>
    </div>
    <div className="h-2 bg-[#e27609]" />
  </footer>
);
