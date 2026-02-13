"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/src/store/cartStore";

const NAV_LINKS = [
  { href: "/cakes",                          label: "Cakes"        },
  { href: "/cakes/category/birthday",                 label: "Birthday"     },
  { href: "/photo-cakes",                    label: "Photo Cakes"  },
  { href: "/customize-cake",                 label: "Customize"    },
  { href: "/same-day-cake-delivery-kolkata", label: "Same‑Day"     },
];

export default function Navbar() {
  const [open,     setOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cartItems = useCartStore((state) => state.items);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300
        ${scrolled
          ? "bg-[#fffcf9]/95 backdrop-blur-md shadow-[0_2px_24px_rgba(244,162,97,0.13)] border-b border-[#f3e8df]"
          : "bg-[#fffcf9]/80 backdrop-blur-sm border-b border-transparent"
        }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-[68px] flex items-center justify-between gap-6">

        {/* ── Logo ── */}
        <Link href="/" className="flex-shrink-0 no-underline leading-none">
          <span className="block font-serif text-[22px] font-bold text-[#c1440e] tracking-tight">
            Bliss bites
          </span>
          <span className="block text-[10px] font-semibold tracking-[2.5px] uppercase text-[#b8977a] -mt-0.5">
            Bakery
          </span>
        </Link>

        {/* ── Desktop links ── */}
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="relative text-[13.5px] font-semibold text-[#5c3d2e] tracking-wide
                         after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:w-0
                         after:bg-[#f4a261] after:rounded-full after:transition-all after:duration-300
                         hover:text-[#c1440e] hover:after:w-full transition-colors duration-200"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* ── Desktop right actions ── */}
        <div className="hidden md:flex items-center gap-3">

  {/* WhatsApp Primary CTA */}
  <Link
    href="https://wa.me/91XXXXXXXXXX?text=Hey%2C%20I%20have%20a%20requirement%20for%20customized%20cake"
    target="_blank"
    className="bg-gradient-to-r from-[#25D366] to-[#128C7E]
               text-white text-[13px] font-bold px-5 py-2.5 rounded-full
               shadow hover:-translate-y-0.5 hover:shadow-lg
               transition-all duration-200"
  >
    WhatsApp
  </Link>

  {/* Cart */}
  <Link
    href="/cart"
    className="relative flex items-center gap-1.5 bg-gradient-to-r from-[#c1440e] to-[#f4a261]
               text-white text-[13px] font-bold px-5 py-2.5 rounded-full
               shadow-[0_4px_16px_rgba(193,68,14,0.25)]
               hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(193,68,14,0.32)]
               transition-all duration-300"
  >
    <span>🛒</span>
    <span>Cart</span>
    {cartItems.length > 0 && (
      <span className="flex items-center justify-center w-[18px] h-[18px] rounded-full
                       bg-[#2d1b0e] text-white text-[10px] font-extrabold">
        {cartItems.length}
      </span>
    )}
  </Link>

</div>


        {/* ── Mobile hamburger ── */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-[5px] rounded-lg
                     hover:bg-[#fde2e4] transition-colors duration-200"
        >
          <span
            className={`block w-5 h-[2px] bg-[#c1440e] rounded-full transition-all duration-300
              ${open ? "rotate-45 translate-y-[7px]" : ""}`}
          />
          <span
            className={`block w-5 h-[2px] bg-[#c1440e] rounded-full transition-all duration-300
              ${open ? "opacity-0 scale-x-0" : ""}`}
          />
          <span
            className={`block w-5 h-[2px] bg-[#c1440e] rounded-full transition-all duration-300
              ${open ? "-rotate-45 -translate-y-[7px]" : ""}`}
          />
        </button>
      </div>

      {/* ── Mobile menu (slide-down) ── */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out
          ${open ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="bg-[#fffbf8] border-t border-[#f3e8df] px-6 py-2 flex flex-col">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="py-3.5 text-[15px] font-semibold text-[#2d1b0e] border-b border-[#f3e8df]
                         hover:text-[#c1440e] transition-colors duration-200 last:border-b-0"
            >
              {label}
            </Link>
          ))}

          {/* Mobile cart */}
          <Link
            href="/cart"
            onClick={() => setOpen(false)}
            className="mt-4 mb-2 flex items-center justify-center gap-2
                       bg-gradient-to-r from-[#c1440e] to-[#f4a261]
                       text-white text-[14px] font-bold py-3 rounded-xl
                       shadow-[0_4px_16px_rgba(193,68,14,0.22)]"
          >
            <span>🛒</span>
            <span>Cart</span>
            {cartItems.length > 0 && (
              <span className="flex items-center justify-center w-5 h-5 rounded-full
                               bg-[#2d1b0e] text-white text-[10px] font-extrabold">
                {cartItems.length}
              </span>
            )}
          </Link>

          <Link
            href="/admin"
            onClick={() => setOpen(false)}
            className="py-2.5 text-[13px] text-center text-[#b8977a] hover:text-[#c1440e]
                       transition-colors duration-200"
          >
            Admin
          </Link>
        </div>
      </div>
      
    </nav>
  );
}