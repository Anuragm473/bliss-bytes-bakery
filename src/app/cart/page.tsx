"use client";

import { useCartStore } from "@/src/store/cartStore";
import Link from "next/link";

export default function CartPage() {
  const {
    items,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
    getTotal,
  } = useCartStore();

  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-10">
        <h1 className="text-3xl font-bold text-[#4B2E83]">
          Your Cart is Empty
        </h1>
        <Link
          href="/cakes"
          className="mt-6 inline-block bg-[#FF6B6B] text-white px-6 py-3 rounded-lg"
        >
          Shop Cakes
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-10">
      <h1 className="text-3xl font-bold text-[#4B2E83] mb-8">
        Your Cart
      </h1>

      {items.map((item, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-xl shadow mb-6"
        >
          <h2 className="text-xl font-semibold">
            {item.title}
          </h2>

          <p className="text-gray-600">
            {item.size} | {item.flavor}
          </p>

          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={() => decreaseQuantity(index)}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              -
            </button>

            <span>{item.quantity}</span>

            <button
              onClick={() => increaseQuantity(index)}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              +
            </button>
          </div>

          <p className="mt-4 font-bold">
            ₹{item.price * item.quantity}
          </p>

          <button
            onClick={() => removeItem(index)}
            className="mt-4 text-red-500"
          >
            Remove
          </button>
        </div>
      ))}

      <div className="text-2xl font-bold mt-8">
        Total: ₹{total}
      </div>

      <Link
        href="/checkout"
        className="block mt-6 bg-[#4B2E83] text-white text-center py-3 rounded-lg"
      >
        Proceed to Checkout
      </Link>
    </div>
  );
}
