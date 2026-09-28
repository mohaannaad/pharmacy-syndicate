"use client";

import { useEffect, useRef } from "react";

// بتنادي على الدالة أول ما الصفحة تفتح، وبعدين كل فترة (افتراضيًا كل 10 ثواني).
// لو الموظف فاتح تاب تاني بتوقف، وأول ما يرجع بتحدّث فورًا.
export function useAutoRefresh(callback: () => void | Promise<void>, intervalMs = 10000) {
  const savedCallback = useRef(callback);

  // نحتفظ دايمًا بآخر نسخة من الدالة
  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      if (document.visibilityState !== "visible") return;
      // لو النت فصل لحظة، منوقعش الصفحة، نستنى المحاولة الجاية
      Promise.resolve(savedCallback.current()).catch(() => {});
    }

    tick();
    const id = setInterval(tick, intervalMs);
    document.addEventListener("visibilitychange", tick);

    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [intervalMs]);
}