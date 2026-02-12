"use client";

import { useState } from "react";
import { useCartStore } from "@/src/store/cartStore";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore();
  const router = useRouter();

  const total = getTotal();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    area: "",
    deliveryDate: "",
    deliverySlot: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) return;

    const res = await fetch("/api/orders", {
      method: "POST",
      body: JSON.stringify({
        ...form,
        items,
        totalPrice: total,
      }),
    });

    if (res.ok) {
      clearCart();
      router.push("/success");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-10">
      <h1 className="text-3xl font-bold text-[#4B2E83] mb-8">
        Checkout (Cash on Delivery)
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          required
          placeholder="Full Name"
          className="w-full border p-3 rounded"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          required
          placeholder="Phone Number"
          className="w-full border p-3 rounded"
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />

        <textarea
          required
          placeholder="Full Address"
          className="w-full border p-3 rounded"
          onChange={(e) =>
            setForm({ ...form, address: e.target.value })
          }
        />

        <input
          required
          placeholder="Area (Salt Lake, Dumdum...)"
          className="w-full border p-3 rounded"
          onChange={(e) =>
            setForm({ ...form, area: e.target.value })
          }
        />

        <input
          required
          type="date"
          className="w-full border p-3 rounded"
          onChange={(e) =>
            setForm({ ...form, deliveryDate: e.target.value })
          }
        />

        <input
          required
          placeholder="Delivery Slot (3 PM - 6 PM)"
          className="w-full border p-3 rounded"
          onChange={(e) =>
            setForm({ ...form, deliverySlot: e.target.value })
          }
        />

        <div className="text-xl font-bold">
          Total: ₹{total}
        </div>

        <button
          type="submit"
          className="w-full bg-[#4B2E83] text-white py-3 rounded-lg font-semibold"
        >
          Place Order
        </button>
      </form>
    </div>
  );
}
