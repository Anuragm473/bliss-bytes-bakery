"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/src/store/cartStore";

const CAKE_CATEGORIES = [
  { href: "/cakes/category/birthday", label: "Birthday Cakes" },
  { href: "/cakes/category/anniversary", label: "Anniversary Cakes" },
  { href: "/cakes/category/photo", label: "Photo Cakes" },
  { href: "/cakes/category/kids", label: "Kids Cakes" },
  { href: "/cakes/category/wedding", label: "Wedding Cakes" },
];


const NAV_LINKS = [
  { href: "/cakes", label: "Cakes", hasDropdown: true },
  { href: "/customize-cake", label: "Customize" },
  { href: "/my-orders", label: "My Orders" },
  { href: "/about-us", label: "About Us" },
];


export default function Navbar() {
  const [open, setOpen] = useState<boolean | "cakes">(false);
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

        {/* ── Logo + Brand ── */}
        <Link href="/" className="flex-shrink-0 no-underline leading-none flex items-center gap-2.5">
          {/* Cake icon SVG logo */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#c1440e] to-[#f4a261]
                          flex items-center justify-center shadow-[0_2px_12px_rgba(193,68,14,0.28)]
                          flex-shrink-0">
           <img src="logo.jpg"/>
          </div>

          <div>
            <span className="block font-serif text-[21px] font-bold text-[#c1440e] tracking-tight leading-tight">
              Bliss Bites
            </span>
            <span className="block text-[9px] font-semibold tracking-[2.5px] uppercase text-[#b8977a] -mt-0.5">
              Bakery
            </span>
          </div>
        </Link>

        {/* ── Desktop center links ── */}
        <div className="hidden md:flex items-center gap-7 absolute left-1/2 -translate-x-1/2">
  {NAV_LINKS.map(({ href, label, hasDropdown }) => (
    <div key={href} className="relative group">
      
      <Link
        href={href}
        className="relative text-[13.5px] font-semibold text-[#5c3d2e] tracking-wide
                   hover:text-[#c1440e] transition-colors duration-200
                   whitespace-nowrap flex items-center gap-1"
      >
        {label}
        {hasDropdown && <span className="text-xs">▾</span>}
      </Link>

      {/* Dropdown */}
      {hasDropdown && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-4 w-56
                        bg-white rounded-2xl shadow-xl border border-[#f3e8df]
                        opacity-0 invisible group-hover:opacity-100 group-hover:visible
                        transition-all duration-200 z-50">
          
          <div className="py-3">
            {CAKE_CATEGORIES.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="block px-5 py-2.5 text-sm font-semibold text-[#5c3d2e]
                           hover:bg-[#fde2e4] hover:text-[#c1440e]
                           transition-colors duration-200"
              >
                {cat.label}
              </Link>
            ))}
          </div>

        </div>
      )}
    </div>
  ))}
</div>


        {/* ── Desktop right actions ── */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">

          {/* WhatsApp CTA */}
          <Link
            href="https://wa.me/919123743680?text=Hey%2C%20I%20have%20a%20requirement%20for%20customized%20cake"
            target="_blank"
            className="flex items-center gap-1.5 bg-gradient-to-r from-[#25D366] to-[#128C7E]
                       text-white text-[13px] font-bold px-4 py-2.5 rounded-full
                       shadow hover:-translate-y-0.5 hover:shadow-lg
                       transition-all duration-200"
          >
            {/* WhatsApp icon */}
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 flex-shrink-0">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.089.534 4.053 1.474 5.764L.057 23.077a.75.75 0 0 0 .916.94l5.44-1.426A11.946 11.946 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-4.989-1.362l-.357-.213-3.704.972.988-3.607-.233-.372A9.818 9.818 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
            </svg>
            <span>WhatsApp</span>
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative flex items-center gap-1.5 bg-gradient-to-r from-[#c1440e] to-[#f4a261]
                       text-white text-[13px] font-bold px-4 py-2.5 rounded-full
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
          ${open ? "max-h-[460px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="bg-[#fffbf8] border-t border-[#f3e8df] px-6 py-2 flex flex-col">
          {NAV_LINKS.map(({ href, label, hasDropdown }) =>
  hasDropdown ? (
    <div key={href} className="border-b border-[#f3e8df]">
      
      <button
        onClick={() => setOpen(open === "cakes" ? false : "cakes")}
        className="w-full flex justify-between items-center py-3.5
                   text-[15px] font-semibold text-[#2d1b0e]"
      >
        <span>{label}</span>
        <span className="text-sm">▾</span>
      </button>

      {/* Category links */}
      <div className="pl-4 pb-2">
        {CAKE_CATEGORIES.map((cat) => (
          <Link
            key={cat.href}
            href={cat.href}
            onClick={() => setOpen(false)}
            className="block py-2 text-[14px] text-[#5c3d2e]
                       hover:text-[#c1440e] transition-colors duration-200"
          >
            {cat.label}
          </Link>
        ))}
      </div>
    </div>
  ) : (
    <Link
      key={href}
      href={href}
      onClick={() => setOpen(false)}
      className="py-3.5 text-[15px] font-semibold text-[#2d1b0e]
                 border-b border-[#f3e8df]
                 hover:text-[#c1440e] transition-colors duration-200"
    >
      {label}
    </Link>
  )
)}


          {/* Mobile WhatsApp */}
          <Link
            href="https://wa.me/919123743680?text=Hey%2C%20I%20have%20a%20requirement%20for%20customized%20cake"
            target="_blank"
            onClick={() => setOpen(false)}
            className="mt-3 flex items-center justify-center gap-2
                       bg-gradient-to-r from-[#25D366] to-[#128C7E]
                       text-white text-[14px] font-bold py-3 rounded-xl
                       shadow"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.089.534 4.053 1.474 5.764L.057 23.077a.75.75 0 0 0 .916.94l5.44-1.426A11.946 11.946 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-4.989-1.362l-.357-.213-3.704.972.988-3.607-.233-.372A9.818 9.818 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
            </svg>
            <span>WhatsApp</span>
          </Link>

          {/* Mobile cart */}
          <Link
            href="/cart"
            onClick={() => setOpen(false)}
            className="mt-2 mb-2 flex items-center justify-center gap-2
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
        </div>
      </div>

    </nav>
  );
}