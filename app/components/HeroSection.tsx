"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const slides = [
  { image: "/banner-1.jpg", title: "خدمات نقابية إلكترونية… أسهل وأسرع", subtitle: "نحو تجربة رقمية متكاملة تتيح لأعضاء النقابة إنجاز العديد من الخدمات والاستعلامات إلكترونيًا بكل سهولة." },
  { image: "/banner-2.jpg", title: "نطوّر خدماتنا لخدمة صيادلتنا", subtitle: "تعمل النقابة على تطوير خدماتها وتحسين تجربة الأعضاء، بما يواكب التحول الرقمي واحتياجات الصيادلة." },
  { image: "/banner-3.jpg", title: "تابع أحدث أخبار وفعاليات النقابة", subtitle: "كن على اطلاع دائم بآخر قرارات النقابة، والفعاليات، والأنشطة، وكل ما يهم أعضاء نقابة صيادلة مصر." },
];

export default function HeroSection() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white px-4 md:px-8 pt-4">
      <section className="relative overflow-hidden rounded-3xl h-[420px] md:h-[480px]">
        {slides.map((slide, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === active ? 1 : 0, pointerEvents: i === active ? "auto" : "none" }}
          >
            <Image src={slide.image} alt={slide.title} fill priority={i === 0} className="object-cover" />
            <div className="absolute inset-0 bg-black/30" />
          </div>
        ))}

        <div key={active} className="absolute inset-0 flex items-center justify-start">
          <div className="max-w-xl ps-8 md:ps-50 pe-6 text-right animate-slide-fade">
            <h1 className="text-2xl md:text-4xl font-bold text-white leading-relaxed">{slides[active].title}</h1>
            <p className="mt-3 text-white/85 text-sm md:text-base">{slides[active].subtitle}</p>
            <button className="mt-5 bg-[#D1AA43] text-white px-6 py-2.5 rounded-pill text-sm font-medium">
              اقرأ المزيد
            </button>
          </div>
        </div>

        <div className="absolute bottom-6 inset-x-0 flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-1.5 rounded-full transition-all ${i === active ? "w-6 bg-white" : "w-1.5 bg-white/40"}`}
              aria-label={`الانتقال للبانر ${i + 1}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}