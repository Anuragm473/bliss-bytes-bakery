"use client";

import { useState, useRef, useEffect, type FC, type ChangeEvent, type FormEvent, type KeyboardEvent, JSX } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const OCCASIONS = ["Birthday", "Anniversary", "Wedding", "Baby Shower", "Engagement", "Farewell", "Corporate", "Other"] as const;
const BUDGETS   = ["₹500 – ₹800", "₹800 – ₹1200", "₹1200 – ₹2000", "₹2000 – ₹3500", "₹3500+"] as const;

type Occasion = (typeof OCCASIONS)[number] | "";
type Budget   = (typeof BUDGETS)[number]   | "";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormState {
  name: string;
  phone: string;
  email: string;
  occasion: Occasion;
  budget: Budget;
  deliveryDate: string;
  message: string;
}

interface FormErrors {
  phone?: string;
  email?: string;
}

interface TimeLeft {
  hours: number;
  minutes: number;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const GoogleFontsLoader: FC = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  `}</style>
);

// ─── Countdown Timer ──────────────────────────────────────────────────────────

const CountdownTimer: FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ hours: 0, minutes: 0 });

  useEffect(() => {
    const updateTimer = (): void => {
      const now    = new Date();
      const cutoff = new Date();
      cutoff.setHours(14, 0, 0, 0);
      if (now >= cutoff) cutoff.setDate(cutoff.getDate() + 1);
      const diff = cutoff.getTime() - now.getTime();
      setTimeLeft({
        hours:   Math.floor(diff / 3_600_000),
        minutes: Math.floor((diff % 3_600_000) / 60_000),
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60_000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number): string => String(n).padStart(2, "0");

  return (
    <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-4 border border-rose-200">
      <p className="font-sans text-xs text-rose-500 font-semibold mb-2 uppercase tracking-widest">
        Same-day order cutoff
      </p>
      <div className="flex items-center gap-2">
        <div className="bg-rose-500 text-white rounded-lg px-3 py-1.5 font-serif text-2xl font-bold">
          {pad(timeLeft.hours)}
        </div>
        <span className="font-serif text-2xl text-rose-500">:</span>
        <div className="bg-orange-400 text-white rounded-lg px-3 py-1.5 font-serif text-2xl font-bold">
          {pad(timeLeft.minutes)}
        </div>
        <span className="text-sm text-gray-400 ml-1">hrs left today</span>
      </div>
    </div>
  );
};

// ─── FAQ Accordion ────────────────────────────────────────────────────────────

interface FAQProps {
  q: string;
  a: string;
}

const FAQ: FC<FAQProps> = ({ q, a }) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="border-b border-rose-100 pb-4 mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="bg-transparent border-0 cursor-pointer flex justify-between items-center w-full p-0 text-left"
        aria-expanded={open}
      >
        <span className="font-sans font-semibold text-[15px] text-neutral-800">{q}</span>
        <span className="text-xl text-rose-500 ml-3 select-none">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <p className="mt-2.5 font-sans text-sm text-gray-500 leading-7">{a}</p>
      )}
    </div>
  );
};

// ─── How-It-Works Card ────────────────────────────────────────────────────────

interface StepCardProps {
  num: string;
  icon: string;
  title: string;
  desc: string;
}

const StepCard: FC<StepCardProps> = ({ num, icon, title, desc }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-100 relative">
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-orange-400 text-white flex items-center justify-center font-serif font-bold text-base mx-auto mb-4">
      {num}
    </div>
    <div className="text-3xl mb-2.5 text-center">{icon}</div>
    <h3 className="font-serif text-base text-neutral-900 text-center mb-2">{title}</h3>
    <p className="font-sans text-xs text-gray-400 text-center leading-relaxed">{desc}</p>
  </div>
);

// ─── JSON-LD schema ───────────────────────────────────────────────────────────

interface SchemaGraph {
  "@context": string;
  "@graph": object[];
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": "https://bliss-bites-bakery.vercel.app/#bakery",
      name: "Bliss Bites Bakery",
      image: "https://bliss-bites-bakery.vercel.app/og-custom-cake.jpg",
      telephone: "+91 9123743680",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kolkata",
        addressRegion: "West Bengal",
        addressCountry: "IN"
      },
      areaServed: "Kolkata",
      servesCuisine: "Bakery",
      priceRange: "₹500 - ₹3500",
      url: "https://bliss-bites-bakery.vercel.app",
      sameAs: []
    },
    {
      "@type": "Service",
      name: "Custom Cake Order Service",
      provider: {
        "@id": "https://bliss-bites-bakery.vercel.app/#bakery"
      },
      areaServed: {
        "@type": "City",
        name: "Kolkata"
      },
      description:
        "Custom eggless cake design service in Kolkata including photo cakes, birthday cakes, wedding cakes and theme cakes with same-day delivery."
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Do you make 100% eggless cakes?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, every cake at Bliss Bites Bakery is 100% eggless."
          }
        },
        {
          "@type": "Question",
          name: "Do you offer same-day custom cake delivery in Kolkata?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Order before 2 PM for same-day delivery across Kolkata."
          }
        }
      ]
    }
  ]
};


// ─── Default form state ───────────────────────────────────────────────────────

const DEFAULT_FORM: FormState = {
  name: "",
  phone: "",
  email: "",
  occasion: "",
  budget: "",
  deliveryDate: "",
  message: "",
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CustomizeCakePage(): JSX.Element {
  const [form, setForm]               = useState<FormState>(DEFAULT_FORM);
  const [imageUrl, setImageUrl]       = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading]     = useState<boolean>(false);
  const [loading, setLoading]         = useState<boolean>(false);
  const [success, setSuccess]         = useState<boolean>(false);
  const [errors, setErrors]           = useState<FormErrors>({});
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!form.phone) {
      e.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
      e.phone = "Enter a valid 10-digit Indian mobile number";
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Enter a valid email address";
    }
    return e;
  };

  // ── Image upload ────────────────────────────────────────────────────────────
  const handleUpload = async (file: File): Promise<void> => {
    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res  = await fetch("/api/upload", { method: "POST", body: formData });
      const data = (await res.json()) as { secure_url: string };
      setImageUrl(data.secure_url);
    } catch {
      alert("Image upload failed. Please try again.");
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) void handleUpload(file);
  };

  // ── Form submit ─────────────────────────────────────────────────────────────
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const res = await fetch("/api/customize-cake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, imageUrl }),
      });

      if (res.ok) {
        setSuccess(true);
        setForm(DEFAULT_FORM);
        setImageUrl(null);
        setImagePreview(null);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = (): void => setSuccess(false);

  // ── Upload zone keyboard handler ────────────────────────────────────────────
  const handleUploadKeyDown = (e: KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === "Enter") fileRef.current?.click();
  };

  const todayISO = new Date().toISOString().split("T")[0] as string;

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <>
      <GoogleFontsLoader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* BG blobs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-20 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(247,160,114,0.15)_0%,transparent_70%)]" />
        <div className="absolute -bottom-20 -left-16 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(232,87,122,0.1)_0%,transparent_70%)]" />
      </div>

      <main
        className="min-h-screen bg-[#FFFBF8] relative z-[1]"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="px-6 pt-[72px] pb-14 text-center max-w-[760px] mx-auto">
          <span className="inline-block bg-gradient-to-br from-rose-50 to-orange-50 text-rose-500 text-xs font-semibold tracking-[1.5px] uppercase px-[18px] py-1.5 rounded-full border border-rose-200 mb-6">
            Bliss Bites Bakery · Kolkata
          </span>
          <h1
            className="text-[clamp(32px,6vw,58px)] leading-[1.2] text-neutral-900 mb-5 font-bold"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Design Your{" "}
            <em className="text-rose-500 not-italic">Dream Cake</em>
            <br />
            in Kolkata
          </h1>
          <p className="text-[clamp(15px,2vw,18px)] text-gray-500 max-w-[520px] mx-auto mb-9 leading-7">
            Premium eggless custom cakes crafted to perfection — photo cakes, theme cakes, and
            designer creations delivered same day across Kolkata.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-3">
            {(
              [
                ["🥚", "100% Eggless"],
                ["⚡", "Same-Day Delivery"],
                ["💵", "COD Available"],
                ["🎨", "Custom Designs"],
              ] as [string, string][]
            ).map(([icon, text]) => (
              <div
                key={text}
                className="bg-white border border-rose-200 rounded-full px-[18px] py-2 flex items-center gap-2 text-sm font-medium text-gray-500 shadow-sm"
              >
                <span>{icon}</span> {text}
              </div>
            ))}
          </div>
        </section>

        {/* ── MAIN FORM SECTION ────────────────────────────────────────────── */}
        <section className="max-w-[1100px] mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">

            {/* Form card */}
            <div className="bg-white rounded-[28px] p-[clamp(24px,5vw,48px)] shadow-[0_8px_40px_rgba(232,87,122,0.08)] border border-rose-100">

              {success ? (
                <div className="text-center py-10 px-5">
                  <div className="text-6xl mb-5">🎂</div>
                  <h2
                    className="text-2xl text-rose-500 mb-3"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Request Received!
                  </h2>
                  <p className="text-gray-500 text-[15px] leading-7 max-w-[360px] mx-auto mb-7">
                    We've received your custom cake request and will call you within 30 minutes to
                    confirm the details.
                  </p>
                  <button
                    onClick={handleReset}
                    className="bg-gradient-to-br from-rose-500 to-orange-400 text-white border-0 rounded-2xl px-7 py-3 font-semibold text-[15px] cursor-pointer"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <>
                  <h2
                    className="text-2xl text-neutral-900 mb-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Customise Your Cake
                  </h2>
                  <p className="text-sm text-gray-400 mb-8">
                    Fill in your requirements and we'll create something magical ✨
                  </p>

                  <form onSubmit={(e) => void handleSubmit(e)} noValidate>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                      {/* Name */}
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-xs font-medium text-gray-500 mb-1.5"
                        >
                          Your Name
                        </label>
                        <input
                          id="name"
                          placeholder="e.g. Priya Sharma"
                          className="w-full border border-rose-200 bg-[#FFFBF8] px-4 py-3 rounded-xl text-sm text-neutral-800 outline-none focus:border-rose-400 transition-colors"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          aria-label="Your name"
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-xs font-medium text-gray-500 mb-1.5"
                        >
                          Phone Number <span className="text-rose-500">*</span>
                        </label>
                        <input
                          id="phone"
                          placeholder="10-digit mobile number"
                          className={`w-full border px-4 py-3 rounded-xl text-sm text-neutral-800 outline-none transition-colors ${
                            errors.phone
                              ? "border-rose-500 bg-rose-50"
                              : "border-rose-200 bg-[#FFFBF8] focus:border-rose-400"
                          }`}
                          value={form.phone}
                          onChange={(e) => {
                            setForm({ ...form, phone: e.target.value });
                            if (errors.phone) setErrors((p) => ({ ...p, phone: undefined }));
                          }}
                          required
                          aria-required="true"
                          aria-describedby={errors.phone ? "phone-error" : undefined}
                        />
                        {errors.phone && (
                          <p id="phone-error" className="text-xs text-rose-500 mt-1" role="alert">
                            {errors.phone}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-xs font-medium text-gray-500 mb-1.5"
                        >
                          Email Address
                        </label>
                        <input
                          id="email"
                          type="email"
                          placeholder="Optional – for order updates"
                          className={`w-full border px-4 py-3 rounded-xl text-sm text-neutral-800 outline-none transition-colors ${
                            errors.email
                              ? "border-rose-500 bg-rose-50"
                              : "border-rose-200 bg-[#FFFBF8] focus:border-rose-400"
                          }`}
                          value={form.email}
                          onChange={(e) => {
                            setForm({ ...form, email: e.target.value });
                            if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                          }}
                          aria-describedby={errors.email ? "email-error" : undefined}
                        />
                        {errors.email && (
                          <p id="email-error" className="text-xs text-rose-500 mt-1" role="alert">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      {/* Occasion */}
                      <div>
                        <label
                          htmlFor="occasion"
                          className="block text-xs font-medium text-gray-500 mb-1.5"
                        >
                          Occasion
                        </label>
                        <select
                          id="occasion"
                          className="w-full border border-rose-200 bg-[#FFFBF8] px-4 py-3 rounded-xl text-sm text-neutral-800 outline-none focus:border-rose-400 transition-colors appearance-none cursor-pointer"
                          value={form.occasion}
                          onChange={(e) =>
                            setForm({ ...form, occasion: e.target.value as Occasion })
                          }
                          aria-label="Select occasion"
                        >
                          <option value="">Select occasion</option>
                          {OCCASIONS.map((o) => (
                            <option key={o} value={o}>
                              {o}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Budget */}
                      <div>
                        <label
                          htmlFor="budget"
                          className="block text-xs font-medium text-gray-500 mb-1.5"
                        >
                          Budget Range
                        </label>
                        <select
                          id="budget"
                          className="w-full border border-rose-200 bg-[#FFFBF8] px-4 py-3 rounded-xl text-sm text-neutral-800 outline-none focus:border-rose-400 transition-colors appearance-none cursor-pointer"
                          value={form.budget}
                          onChange={(e) =>
                            setForm({ ...form, budget: e.target.value as Budget })
                          }
                          aria-label="Select budget range"
                        >
                          <option value="">Select budget</option>
                          {BUDGETS.map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Delivery Date */}
                      <div>
                        <label
                          htmlFor="deliveryDate"
                          className="block text-xs font-medium text-gray-500 mb-1.5"
                        >
                          Delivery Date
                        </label>
                        <input
                          id="deliveryDate"
                          type="date"
                          className="w-full border border-rose-200 bg-[#FFFBF8] px-4 py-3 rounded-xl text-sm text-neutral-800 outline-none focus:border-rose-400 transition-colors"
                          value={form.deliveryDate}
                          min={todayISO}
                          onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })}
                          aria-label="Delivery date"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mt-5">
                      <label
                        htmlFor="message"
                        className="block text-xs font-medium text-gray-500 mb-1.5"
                      >
                        Describe Your Cake Design
                      </label>
                      <textarea
                        id="message"
                        placeholder="Flavour, theme, colour, special message on cake, number of tiers, any reference you have in mind..."
                        rows={5}
                        className="w-full border border-rose-200 bg-[#FFFBF8] px-4 py-3 rounded-xl text-sm text-neutral-800 outline-none focus:border-rose-400 transition-colors resize-y leading-relaxed"
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        aria-label="Cake description"
                      />
                    </div>

                    {/* Image upload */}
                    <div className="mt-5">
                      <span className="block text-xs font-medium text-gray-500 mb-1.5">
                        Reference Image (optional)
                      </span>
                      <div
                        onClick={() => fileRef.current?.click()}
                        onKeyDown={handleUploadKeyDown}
                        className="border-2 border-dashed border-rose-200 rounded-2xl p-6 cursor-pointer text-center bg-[#FFFBF8] hover:border-rose-500 transition-colors"
                        role="button"
                        aria-label="Upload reference image"
                        tabIndex={0}
                      >
                        <input
                          ref={fileRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                          aria-label="File input"
                        />
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Uploaded reference"
                            className="max-h-40 rounded-xl mx-auto block"
                          />
                        ) : (
                          <>
                            <span className="text-3xl">📸</span>
                            <p className="mt-2 text-sm text-gray-400">
                              {uploading ? "Uploading..." : "Click to upload a reference image"}
                            </p>
                          </>
                        )}
                      </div>
                      {uploading && (
                        <p className="text-xs text-rose-500 mt-2" aria-live="polite">
                          Uploading image…
                        </p>
                      )}
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loading || uploading}
                      className={`mt-7 w-full text-white border-0 rounded-2xl py-4 font-semibold text-base transition-transform shadow-[0_4px_24px_rgba(232,87,122,0.25)] ${
                        loading || uploading
                          ? "bg-rose-200 cursor-not-allowed"
                          : "bg-gradient-to-br from-rose-500 to-orange-400 cursor-pointer hover:-translate-y-0.5"
                      }`}
                      aria-busy={loading}
                    >
                      {loading ? "Submitting your request…" : "Submit Custom Cake Request 🎂"}
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* ── SIDEBAR ─────────────────────────────────────────────────── */}
            <div className="flex flex-col gap-5">
              <CountdownTimer />

              {/* Why choose us */}
              <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_24px_rgba(232,87,122,0.07)] border border-rose-100">
                <h3
                  className="text-lg text-neutral-900 mb-4"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Why Choose Bliss Bites?
                </h3>
                {(
                  [
                    ["🌸", "100% Eggless",       "Every cake is made with finest eggless ingredients"],
                    ["⏱️", "Order by 2 PM",       "Get your custom cake the same day"],
                    ["📸", "Photo & Theme",        "Print any image or design on your cake"],
                    ["🚚", "Kolkata Delivery",     "We deliver across all of Kolkata"],
                    ["💯", "Satisfaction",         "Love it or we'll make it right"],
                  ] as [string, string, string][]
                ).map(([icon, title, desc]) => (
                  <div key={title} className="flex gap-3 mb-3.5 items-start">
                    <span className="text-xl">{icon}</span>
                    <div>
                      <p className="m-0 font-semibold text-[13px] text-neutral-800 mb-0.5">{title}</p>
                      <p className="m-0 text-xs text-gray-400">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/919999999999?text=Hi%20I%20want%20to%20order%20a%20custom%20cake"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 bg-[#25D366] text-white rounded-2xl py-3.5 px-5 no-underline font-semibold text-[15px] shadow-[0_4px_20px_rgba(37,211,102,0.3)] hover:opacity-90 transition-opacity"
              >
                <span className="text-[22px]">💬</span> Chat on WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
        <section className="bg-gradient-to-b from-[#FFFBF8] to-[#FFF5F0] px-6 py-16 text-center">
          <div className="max-w-[900px] mx-auto">
            <span className="inline-block bg-rose-50 text-rose-500 text-xs font-semibold tracking-[1.5px] uppercase px-4 py-1 rounded-full mb-5">
              How It Works
            </span>
            <h2
              className="text-[clamp(26px,4vw,40px)] text-neutral-900 mb-12"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Your Dream Cake in 4 Simple Steps
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(
                [
                  ["1", "📝", "Submit Request",    "Fill out the form with your cake details and preferences"],
                  ["2", "📞", "We Call You",       "Our cake expert will call you within 30 minutes"],
                  ["3", "✅", "Design Approval",   "We confirm design, flavour, and delivery time with you"],
                  ["4", "🎂", "Fresh & Delivered", "Your custom eggless cake is freshly baked and delivered"],
                ] as [string, string, string, string][]
              ).map(([num, icon, title, desc]) => (
                <StepCard key={num} num={num} icon={icon} title={title} desc={desc} />
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <section className="max-w-[720px] mx-auto px-6 py-16">
          <span className="inline-block bg-rose-50 text-rose-500 text-xs font-semibold tracking-[1.5px] uppercase px-4 py-1 rounded-full mb-5">
            FAQ
          </span>
          <h2
            className="text-[clamp(24px,4vw,36px)] text-neutral-900 mb-9"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Frequently Asked Questions
          </h2>
          <FAQ
            q="Do you make 100% eggless cakes?"
            a="Yes! Every single cake at Bliss Bites Bakery is 100% eggless. We never compromise on this — whether it's a basic sponge or a multi-tier wedding cake."
          />
          <FAQ
            q="Can I get a custom cake delivered same day in Kolkata?"
            a="Yes! Order before 2 PM and we'll deliver your custom eggless cake the same day anywhere in Kolkata. For highly detailed designs, next-day delivery is recommended."
          />
          <FAQ
            q="How do I get my photo printed on a cake?"
            a="Simply upload your favourite photo in the form above, or send it via WhatsApp. We use food-safe edible ink to print photos on the cake top layer."
          />
          <FAQ
            q="What are the minimum and maximum order amounts?"
            a="We accept custom cake orders starting from ₹500. Prices depend on size, design complexity, and tiers. Contact us for a custom quote on larger orders."
          />
          <FAQ
            q="Can I change my order after submitting?"
            a="Yes, changes can be made up to 12 hours before the delivery time. Please call us directly or message on WhatsApp to request changes."
          />
          <FAQ
            q="Do you offer Cash on Delivery?"
            a="Yes! We offer COD across Kolkata. You can also pay via UPI, net banking, or card when placing your order."
          />
        </section>

        {/* ── BOTTOM CTA ───────────────────────────────────────────────────── */}
        <section className="bg-gradient-to-br from-rose-500 to-orange-400 px-6 py-16 text-center">
          <h2
            className="text-[clamp(24px,4vw,40px)] text-white mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Need an Urgent Delivery?
          </h2>
          <p className="text-base text-white/85 mb-8">
            Chat with us directly on WhatsApp for instant order placement and same-day delivery.
          </p>
          <a
            href="https://wa.me/9123743680"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-white text-rose-500 rounded-2xl px-8 py-4 no-underline font-bold text-base shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:opacity-90 transition-opacity"
          >
            <span className="text-[22px]">💬</span> Chat on WhatsApp
          </a>
        </section>
        <section className="max-w-3xl mx-auto px-6 py-16">
  <h2 className="text-2xl font-bold mb-4">
    Custom Eggless Cakes Delivered Across Kolkata
  </h2>
  <p className="text-sm text-gray-600 leading-7">
    Bliss Bites Bakery specializes in custom eggless cakes in Kolkata including
    Salt Lake, New Town, Rajarhat, Dumdum, Gariahat, Howrah and surrounding areas.
    From birthday theme cakes to elegant wedding cakes and photo cakes,
    we design and deliver fresh creations with same-day service.
  </p>
</section>

      </main>
    </>
  );
}