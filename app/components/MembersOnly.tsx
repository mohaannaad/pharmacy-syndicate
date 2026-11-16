"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, LogIn, UserCheck, ArrowLeft } from "lucide-react";
import PageHeader from "./PageHeader";
import LoginModal from "./LoginModal";

// =====================================================================
// الشاشة اللي بتظهر لو زائر أو خريج فتح خدمة خاصة بالأعضاء
// =====================================================================
export default function MembersOnly({ loggedIn }: { loggedIn: boolean }) {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <main>
      <PageHeader title="خدمة خاصة بأعضاء النقابة" subtitle="هذه الخدمة متاحة لأعضاء النقابة المقيدين فقط" />
      <section className="bg-surface-muted py-14 md:py-20">
        <div className="max-w-xl mx-auto px-4">
          <div className="bg-white rounded-3xl border border-line shadow-card p-8 md:p-10 text-center">
            <span className="mx-auto w-16 h-16 rounded-[20px] bg-gold-soft text-[#9A7A12] flex items-center justify-center">
              <Lock className="w-8 h-8" />
            </span>
            <h2 className="mt-5 text-2xl font-extrabold text-ink">هذه الخدمة للأعضاء فقط</h2>
            <p className="mt-3 text-ink-muted leading-relaxed">
              {loggedIn
                ? "حسابك الحالي ليس حساب عضو مقيد بالنقابة، لذلك لا يمكنك استخدام هذه الخدمة. بعد إتمام القيد يمكنك استخدام جميع الخدمات."
                : "سجّل الدخول بحساب عضو للوصول إلى هذه الخدمة، أو أنشئ حسابك برقم القيد إذا كنت عضوًا بالنقابة."}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              {!loggedIn && (
                <button type="button" onClick={() => setShowLogin(true)} className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-pill bg-primary hover:bg-primary-dark text-white font-bold transition-colors">
                  <LogIn className="w-5 h-5" />
                  تسجيل الدخول
                </button>
              )}
              {!loggedIn && (
                <Link href="/register/existing-member" className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-pill border border-line text-primary font-bold hover:border-primary transition-colors">
                  <UserCheck className="w-5 h-5" />
                  إنشاء حساب عضو
                </Link>
              )}
              <Link href="/services" className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-pill border border-line text-ink font-bold hover:border-primary transition-colors">
                الخدمات المتاحة لك
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onSwitchToRegister={() => { window.location.href = "/register/existing-member"; }} />}
    </main>
  );
}
