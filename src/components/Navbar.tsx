"use client";

import Link from "next/link";
import { useState } from "react";
import { useCartStore } from "../store/cartStore";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const cartItems = useCartStore((state) => state.items);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="text-2xl font-bold text-[#4B2E83]">
          Bliss Bytes Bakery
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8 font-medium text-gray-700">
          <Link href="/cakes" className="hover:text-[#4B2E83]">
            Cakes
          </Link>

          <Link href="/customize-cake" className="hover:text-[#4B2E83]">
            Customize
          </Link>

          <Link
            href="/eggless-cakes-kolkata"
            className="hover:text-[#4B2E83]"
          >
            Eggless Cakes
          </Link>

          <Link
            href="/same-day-cake-delivery-kolkata"
            className="hover:text-[#4B2E83]"
          >
            Same-Day Delivery
          </Link>

          <Link href="/cart" className="relative hover:text-[#4B2E83]">
            Cart
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-[#FF6B6B] text-white text-xs px-2 py-0.5 rounded-full">
                {cartItems.length}
              </span>
            )}
          </Link>

          <Link
            href="/admin"
            className="text-sm text-gray-400 hover:text-[#4B2E83]"
          >
            Admin
          </Link>
        </div>

        {/* MOBILE BUTTON */}
        <button
          className="md:hidden text-[#4B2E83] text-2xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-white border-t px-6 py-4 space-y-4 font-medium">
          <Link href="/cakes" onClick={() => setOpen(false)}>
            Cakes
          </Link>
          <Link href="/customize-cake" onClick={() => setOpen(false)}>
            Customize
          </Link>
          <Link
            href="/eggless-cakes-kolkata"
            onClick={() => setOpen(false)}
          >
            Eggless Cakes
          </Link>
          <Link
            href="/same-day-cake-delivery-kolkata"
            onClick={() => setOpen(false)}
          >
            Same-Day Delivery
          </Link>
          <Link href="/cart" onClick={() => setOpen(false)}>
            Cart ({cartItems.length})
          </Link>
          <Link href="/admin" onClick={() => setOpen(false)}>
            Admin
          </Link>
        </div>
      )}
    </nav>
  );
}
