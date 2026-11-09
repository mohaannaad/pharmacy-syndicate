"use client";

import { useEffect, useRef, useState } from "react";

// =====================================================================
// Reveal — أي حاجة جواه بتظهر بنعومة (fade + طلوع لفوق) أول ما توصل لها وإنت بتنزل في الصفحة
// delay: تأخير بالمللي ثانية، عشان الكروت تظهر ورا بعض واحدة واحدة
// =====================================================================
export default function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // بتظهر مرة واحدة بس
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${visible ? "is-visible" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}
