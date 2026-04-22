import Link from "next/link";

export default function Header() {
  return (
    <div className="bg-black text-white p-4 flex justify-center gap-6">
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/contact">Contact</Link>
    </div>
  );
}