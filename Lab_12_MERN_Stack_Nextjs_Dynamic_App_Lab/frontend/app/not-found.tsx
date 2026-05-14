import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-[860px] px-4 py-16 text-center">
      <h1 className="text-[64px] leading-none text-[#2a2a2a]">404</h1>
      <p className="mt-2 text-[24px] text-[#595959]">The page you are looking for does not exist.</p>
      <Link href="/" className="mt-5 inline-block ticket-button">
        Back to Home
      </Link>
    </div>
  );
}
