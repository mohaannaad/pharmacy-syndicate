"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import type { HeroSlideData } from "../lib/heroSlides";

// الروابط الخارجية بتفتح في تاب جديد
function linkProps(link: string) {
  return link.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {};
}

export default function HeroSection({ slides }: { slides: HeroSlideData[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const current = slides[active] ?? slides[0];

  return (
    <div className="px-4 md:px-8 pt-4 md:pt-6">
      <section className="relative overflow-hidden rounded-[28px] md:rounded-[32px] h-[440px] md:h-[540px] bg-primary-dark animate-hero-in">
        {slides.map((slide, i) => (
          <div key={slide.id} className="absolute inset-0 transition-opacity duration-700" style={{ opacity: i === active ? 1 : 0, pointerEvents: i === active ? "auto" : "none" }}>
            <img src={slide.imageUrl} alt={slide.title || "النقابة العامة لصيادلة مصر"} className="absolute inset-0 w-full h-full object-cover" />
            {/* التعتيم بيظهر بس لو فيه كلام، عشان الصور اللي عليها كلام جاهز تفضل زي ما هي */}
            {slide.title && <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-primary-dark/95 via-primary-dark/75 to-primary-dark/10" />}
            {/* صورة من غير زرار بس ليها رابط → الصورة كلها بتبقى رابط */}
            {slide.link && !slide.buttonText && <a href={slide.link} {...linkProps(slide.link)} className="absolute inset-0" aria-label={slide.title || "عرض التفاصيل"} />}
          </div>
        ))}

        {(current.title || current.buttonText) && (
          <div key={active} className="absolute inset-0 flex items-end md:items-center justify-start pointer-events-none">
            <div className="max-w-2xl px-6 md:px-16 pb-16 md:pb-0 text-right animate-slide-fade pointer-events-auto">
              <span className="inline-flex items-center gap-2 bg-primary-light/20 text-[#BFE6AC] border border-primary-light/40 px-3.5 py-1.5 rounded-pill text-xs md:text-sm font-semibold">
                <span className="w-2 h-2 rounded-full bg-primary-light" />
                النقابة العامة لصيادلة مصر
              </span>
              {current.title && <h1 className="mt-4 text-3xl md:text-5xl font-extrabold text-white leading-[1.3]">{current.title}</h1>}
              {current.subtitle && <p className="mt-4 text-[#CFE3D8] text-base md:text-lg leading-relaxed">{current.subtitle}</p>}
              {current.buttonText && current.link && (
                <a href={current.link} {...linkProps(current.link)} className="inline-flex items-center gap-2 mt-7 bg-gold hover:bg-gold-dark text-[#1B1A12] px-7 py-3.5 rounded-pill text-base font-extrabold transition-colors">
                  {current.buttonText}
                  <ArrowLeft className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        )}

        {slides.length > 1 && (
          <div className="absolute bottom-7 right-6 md:right-16 flex items-center gap-2">
            {slides.map((slide, i) => (
              <button key={slide.id} type="button" onClick={() => setActive(i)} className={`h-1.5 rounded-full transition-all ${i === active ? "w-8 bg-gold" : "w-2.5 bg-white/45"}`} aria-label={`الانتقال إلى الشريحة ${i + 1}`} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
