"use client";

import Link from "next/link";

export default function FloatingWhatsApp() {
  return (
    <Link
      href="https://wa.me/919123743680?text=Hey%2C%20I%20have%20a%20requirement%20for%20customized%20cake"
      target="_blank"
      aria-label="Chat on WhatsApp"
      className="
        fixed bottom-5 right-5
        md:hidden
        z-[999]
        group
      "
    >
      <div
        className="
          w-14 h-14
          rounded-full
          bg-[#25D366]
          shadow-xl
          flex items-center justify-center
          text-white text-2xl
          transition-all duration-300
          group-hover:scale-110
        "
      >
        <svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  fill="white"
  className="w-6 h-6"
>
  <path d="M20.52 3.48A11.82 11.82 0 0012.01 0C5.38 0 .01 5.37.01 12c0 2.11.55 4.17 1.6 6L0 24l6.17-1.61A11.94 11.94 0 0012 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52z"/>
</svg>

      </div>

      {/* Pulse Ring */}
      <span
        className="
          absolute inset-0
          rounded-full
          bg-[#25D366]
          opacity-30
          animate-ping
        "
      />
    </Link>
  );
}
