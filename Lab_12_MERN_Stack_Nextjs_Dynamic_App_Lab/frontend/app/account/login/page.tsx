"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (user) {
    return (
      <div className="mx-auto max-w-[760px] px-4 py-10">
        <div className="rustik-card space-y-3 bg-white p-8 text-center">
          <h1 className="text-[54px] text-[#262626]">Welcome, {user.name}</h1>
          <p className="text-[18px] text-[#575757]">You are logged in as {user.role}.</p>
          <div className="flex justify-center gap-3">
            <Link href="/shop" className="ticket-button">
              Shop
            </Link>
            {user.role === "admin" ? (
              <Link href="/admin" className="ticket-button">
                Admin Panel
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");

    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-[760px] px-4 py-10">
      <form onSubmit={handleSubmit} className="rustik-card space-y-4 bg-white p-8">
        <h1 className="text-[42px] text-[#262626]">Login</h1>
        <input type="email" name="email" required placeholder="Email" className="checkout-input" />
        <input
          type="password"
          name="password"
          required
          placeholder="Password"
          className="checkout-input"
        />
        {error ? <p className="text-[16px] text-[#b64545]">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="ticket-button disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="text-[16px] text-[#565656]">
          No account?{" "}
          <Link href="/account/register" className="text-[#d97814] hover:underline">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}
