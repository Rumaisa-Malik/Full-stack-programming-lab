"use client";

import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();

  return (
    <div className="mx-auto max-w-[1160px] px-4 py-8 md:px-6">
      <h1 className="mb-6 text-[46px] text-[#252525]">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="rustik-card p-8 text-center">
          <p className="text-[22px] text-[#545454]">Your cart is empty.</p>
          <Link href="/shop" className="mt-4 inline-block ticket-button">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <section className="rustik-card overflow-hidden bg-white">
            <table className="w-full text-left">
              <thead className="bg-[#f3f3f3] text-[17px] uppercase text-[#505050]">
                <tr>
                  <th className="p-3">Product</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Qty</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Remove</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.productId} className="border-t border-[#e8e8e8] align-middle">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.title} className="h-16 w-16 object-contain" />
                        <Link
                          href={`/products/${item.slug}`}
                          className="text-[20px] text-[#333] hover:text-[#d97814]"
                        >
                          {item.title}
                        </Link>
                      </div>
                    </td>
                    <td className="p-3 text-[18px]">£{item.price.toFixed(2)}</td>
                    <td className="p-3">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="h-8 w-8 border border-[#cfcfcf] bg-white text-[#555]"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-[18px]">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="h-8 w-8 border border-[#cfcfcf] bg-white text-[#555]"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="p-3 text-[20px] font-semibold text-[#e1760a]">
                      £{(item.price * item.quantity).toFixed(2)}
                    </td>
                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="text-[16px] text-[#a04747] hover:text-[#d65f5f]"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <aside className="space-y-4">
            <section className="rustik-card bg-white p-5">
              <h2 className="mb-3 text-[44px] text-[#2c2c2c]">Summary</h2>
              <div className="space-y-2 text-[18px] text-[#565656]">
                <p className="flex justify-between">
                  <span>Subtotal</span>
                  <strong>£{subtotal.toFixed(2)}</strong>
                </p>
                <p className="flex justify-between">
                  <span>Shipping</span>
                  <strong>£20.00</strong>
                </p>
                <p className="flex justify-between border-t border-[#dddddd] pt-2 text-[22px] text-[#2f2f2f]">
                  <span>Total</span>
                  <strong>£{(subtotal + 20).toFixed(2)}</strong>
                </p>
              </div>
              <Link href="/checkout" className="mt-4 inline-block w-full text-center ticket-button">
                Checkout
              </Link>
            </section>

            <button
              type="button"
              onClick={clearCart}
              className="w-full border border-[#cfcfcf] bg-white px-4 py-2 text-[17px] text-[#555] hover:text-[#d97814]"
            >
              Clear Cart
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}
