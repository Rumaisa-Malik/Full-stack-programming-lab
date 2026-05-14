"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { createOrder } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const shippingFee = useMemo(() => (items.length > 0 ? 20 : 0), [items.length]);
  const total = subtotal + shippingFee;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    const form = new FormData(event.currentTarget);
    const customer = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      address: String(form.get("address") || ""),
      city: String(form.get("city") || ""),
      country: String(form.get("country") || ""),
    };

    try {
      setSubmitting(true);
      const order = await createOrder({
        customer,
        shippingFee,
        paymentMethod: String(form.get("paymentMethod") || "Cash on Delivery"),
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });
      clearCart();
      setMessage(`Order ${order._id} placed successfully. Status: ${order.status}`);
      event.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1160px] px-4 py-8 md:px-6">
      <h1 className="mb-6 text-[46px] text-[#262626]">Checkout</h1>

      {items.length === 0 ? (
        <div className="rustik-card p-8 text-center">
          <p className="text-[22px] text-[#545454]">
            Add products to your cart before checking out.
          </p>
          <Link href="/shop" className="mt-4 inline-block ticket-button">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <form onSubmit={handleSubmit} className="rustik-card space-y-4 bg-white p-6">
            <h2 className="text-[48px] text-[#2c2c2c]">Customer Details</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <input name="name" required placeholder="Full Name" className="checkout-input" />
              <input name="email" type="email" required placeholder="Email" className="checkout-input" />
              <input name="phone" required placeholder="Phone" className="checkout-input" />
              <input name="city" required placeholder="City" className="checkout-input" />
              <input
                name="country"
                required
                placeholder="Country"
                className="checkout-input md:col-span-1"
                defaultValue="Pakistan"
              />
              <select name="paymentMethod" className="checkout-input">
                <option>Cash on Delivery</option>
                <option>Bank Transfer</option>
                <option>Card on Delivery</option>
              </select>
              <textarea
                name="address"
                required
                placeholder="Address"
                className="checkout-input min-h-24 md:col-span-2"
              />
            </div>

            {error ? <p className="text-[16px] text-[#b34545]">{error}</p> : null}
            {message ? <p className="text-[16px] text-[#2f6f3c]">{message}</p> : null}

            <button
              type="submit"
              disabled={submitting}
              className="ticket-button disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Placing..." : "Place Order"}
            </button>
          </form>

          <aside className="rustik-card bg-white p-5">
            <h2 className="mb-3 text-[44px] text-[#2d2d2d]">Order Summary</h2>
            <ul className="space-y-2 border-b border-[#e0e0e0] pb-3 text-[16px] text-[#565656]">
              {items.map((item) => (
                <li key={item.productId} className="flex justify-between gap-3">
                  <span>
                    {item.title} x {item.quantity}
                  </span>
                  <span>£{(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 space-y-2 text-[18px] text-[#4f4f4f]">
              <p className="flex justify-between">
                <span>Subtotal</span>
                <strong>£{subtotal.toFixed(2)}</strong>
              </p>
              <p className="flex justify-between">
                <span>Shipping</span>
                <strong>£{shippingFee.toFixed(2)}</strong>
              </p>
              <p className="flex justify-between border-t border-[#dddddd] pt-2 text-[22px] text-[#242424]">
                <span>Total</span>
                <strong>£{total.toFixed(2)}</strong>
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
