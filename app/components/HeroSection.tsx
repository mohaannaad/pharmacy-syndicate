"use client";

import { useState, useEffect } from "react";
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
    <div className="bg-white px-4 md:px-8 pt-4">
      <section className="relative overflow-hidden rounded-3xl h-[420px] md:h-[480px]">
        {slides.map((slide, i) => (
          <div key={slide.id} className="absolute inset-0 transition-opacity duration-700" style={{ opacity: i === active ? 1 : 0, pointerEvents: i === active ? "auto" : "none" }}>
            <img src={slide.imageUrl} alt={slide.title || "النقابة العامة لصيادلة مصر"} className="absolute inset-0 w-full h-full object-cover" />
            {/* التعتيم بيظهر بس لو فيه كلام، عشان الصور اللي عليها كلام جاهز تفضل زي ما هي */}
            {slide.title && <div className="absolute inset-0 bg-black/30" />}
            {/* صورة من غير زرار بس ليها رابط → الصورة كلها بتبقى رابط */}
            {slide.link && !slide.buttonText && <a href={slide.link} {...linkProps(slide.link)} className="absolute inset-0" aria-label={slide.title || "عرض التفاصيل"} />}
          </div>
        ))}

        {(current.title || current.buttonText) && (
          <div key={active} className="absolute inset-0 flex items-center justify-start pointer-events-none">
            <div className="max-w-xl ps-8 md:ps-50 pe-6 text-right animate-slide-fade pointer-events-auto">
              {current.title && <h1 className="text-2xl md:text-4xl font-bold text-white leading-relaxed">{current.title}</h1>}
              {current.subtitle && <p className="mt-3 text-white/85 text-sm md:text-base">{current.subtitle}</p>}
              {current.buttonText && current.link && (
                <a href={current.link} {...linkProps(current.link)} className="inline-block mt-5 bg-[#D1AA43] hover:bg-[#bf9a38] text-white px-6 py-2.5 rounded-pill text-sm font-medium transition-colors">
                  {current.buttonText}
                </a>
              )}
            </div>
          </div>
        )}

        {slides.length > 1 && (
          <div className="absolute bottom-6 inset-x-0 flex items-center justify-center gap-2">
            {slides.map((slide, i) => (
              <button key={slide.id} type="button" onClick={() => setActive(i)} className={`h-1.5 rounded-full transition-all ${i === active ? "w-6 bg-white" : "w-1.5 bg-white/40"}`} aria-label={`الانتقال إلى الشريحة ${i + 1}`} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}