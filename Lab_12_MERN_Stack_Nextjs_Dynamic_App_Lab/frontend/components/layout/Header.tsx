"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

const topLinks = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "About Us", href: "/blog" },
  { label: "Contact Us", href: "/checkout" },
];

const navLinks = [
  { label: "Beds", href: "/categories/beds" },
  { label: "Cabinets", href: "/categories/cabinets" },
  { label: "Bookcases", href: "/categories/bookcases" },
  { label: "Boxes", href: "/categories/boxes" },
  { label: "Chairs", href: "/categories/chairs" },
  { label: "Tables", href: "/categories/tables" },
];

export const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const cartText = `${itemCount} ${itemCount === 1 ? "Item" : "Items"}`;

  const accountHref = useMemo(() => {
    if (!user) return "/account/login";
    return user.role === "admin" ? "/admin" : "/account/login";
  }, [user]);

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    const value = search.trim();
    router.push(value ? `/shop?search=${encodeURIComponent(value)}` : "/shop");
    setMobileOpen(false);
  };

  const navClass = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`)
      ? "text-[#dc7d17]"
      : "text-[#4a4a4a] hover:text-[#dc7d17]";

  return (
    <header className="border-b border-[#d8d8d8] bg-[#ededed]">
      <div className="mx-auto max-w-[1100px] px-4 pb-3 pt-4 md:px-2">
        <div className="grid items-start gap-3 md:grid-cols-[1fr_auto]">
          <div className="flex flex-wrap items-start gap-7">
            <Link href="/" className="leading-none">
              <span className="font-[var(--font-display)] text-[52px] text-[#101010]">
                <span className="text-[#e27b12]">R</span>ustik Plank
              </span>
            </Link>
            <nav className="hidden items-center gap-5 pt-4 text-[15px] italic text-[#2f2f2f] md:flex">
              {topLinks.map((link) => (
                <Link key={link.href} href={link.href} className={navClass(link.href)}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex flex-col items-end gap-1 text-[#3b3b3b]">
            <div className="flex items-center gap-2 text-[14px] font-semibold">
              <span>Y</span>
              <span>g+</span>
              <span>t</span>
              <span>f</span>
              <span className="ml-8 text-[13px] font-normal">07584 031409</span>
            </div>
            <div className="flex items-center gap-3 text-[14px]">
              <Link href={accountHref} className="hover:text-[#dc7d17]">
                {user ? `${user.name} (${user.role})` : "My Account (Login/Register)"}
              </Link>
              {user ? (
                <button
                  type="button"
                  onClick={logout}
                  className="cursor-pointer text-[#444] hover:text-[#dc7d17]"
                >
                  Logout
                </button>
              ) : null}
              <Link href="/cart" className="hover:text-[#dc7d17]">
                {cartText}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-3 border-t border-[#dcdcdc] pt-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="inline-flex items-center rounded border border-[#b6b6b6] px-3 py-1 text-sm font-semibold text-[#555] md:hidden"
            >
              Menu
            </button>

            <nav className="hidden flex-wrap items-center justify-center gap-6 text-[14px] leading-none tracking-[0.08em] text-[#474747] md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${navClass(link.href)} font-light uppercase`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <form onSubmit={handleSearch} className="flex w-full max-w-[250px] items-center md:w-auto">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search"
                className="h-8 w-full border border-[#cfcfcf] bg-white px-3 text-[12px] outline-none focus:border-[#dc7d17]"
              />
              <button
                type="submit"
                className="h-8 border border-l-0 border-[#cfcfcf] bg-white px-3 text-[12px] text-[#444] hover:text-[#dc7d17]"
              >
                Search
              </button>
            </form>
          </div>

          <nav className={`${mobileOpen ? "flex" : "hidden"} flex-col gap-2 md:hidden`}>
            {topLinks.map((link) => (
              <Link
                key={`mobile-top-${link.href}`}
                href={link.href}
                className={navClass(link.href)}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {navLinks.map((link) => (
              <Link
                key={`mobile-main-${link.href}`}
                href={link.href}
                className={navClass(link.href)}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};
