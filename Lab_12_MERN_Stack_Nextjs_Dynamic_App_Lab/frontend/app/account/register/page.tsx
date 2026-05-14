"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "");
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");
    const confirmPassword = String(form.get("confirmPassword") || "");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await register(name, email, password);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-[760px] px-4 py-10">
      <form onSubmit={handleSubmit} className="rustik-card space-y-4 bg-white p-8">
        <h1 className="text-[42px] text-[#262626]">Register</h1>
        <input type="text" name="name" required placeholder="Full Name" className="checkout-input" />
        <input type="email" name="email" required placeholder="Email" className="checkout-input" />
        <input
          type="password"
          name="password"
          required
          minLength={6}
          placeholder="Password"
          className="checkout-input"
        />
        <input
          type="password"
          name="confirmPassword"
          required
          minLength={6}
          placeholder="Confirm Password"
          className="checkout-input"
        />
        {error ? <p className="text-[16px] text-[#b64545]">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="ticket-button disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>
        <p className="text-[16px] text-[#565656]">
          Already have an account?{" "}
          <Link href="/account/login" className="text-[#d97814] hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
