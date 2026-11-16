"use client";

import Image from "next/image";
import { ArrowLeft, Lock, Info } from "lucide-react";
import { ALL_SERVICES, canUseService } from "../lib/services";

// role = نوع الحساب الداخل حاليًا (null لو زائر)
// العضو بيشوف كل الخدمات شغالة، والزائر/الخريج بيشوف الخدمات الخاصة بالأعضاء مقفولة
export default function AllServicesGrid({ role, loggedIn }: { role: string | null; loggedIn: boolean }) {
  const services = ALL_SERVICES;
  const hasLocked = ALL_SERVICES.some((s) => !canUseService(s.key, role));

  return (
    <section className="bg-surface-muted pt-10 md:pt-12 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {hasLocked && (
          <div className="mb-8 flex items-start gap-3 bg-gold-soft border border-[#EADBA8] rounded-2xl px-5 py-4 text-right">
            <Info className="w-5 h-5 text-[#9A7A12] shrink-0 mt-0.5" />
            <p className="text-sm text-[#5C4A0B] leading-relaxed">
              {loggedIn
                ? "بعض الخدمات متاحة لأعضاء النقابة المقيدين فقط، وستصبح متاحة لك بعد إتمام القيد."
                : "بعض الخدمات متاحة لأعضاء النقابة فقط. سجّل الدخول بحساب عضو لاستخدام جميع الخدمات."}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((service) => {
            if (!canUseService(service.key, role)) {
              return (
                <div key={service.key} aria-disabled="true" title="هذه الخدمة متاحة لأعضاء النقابة فقط" className="bg-[#F7F9F8] border border-dashed border-[#D5DFD9] rounded-3xl p-6 flex flex-col gap-4 text-right cursor-not-allowed select-none">
                  <span className="flex items-start justify-between">
                    <span className="w-[60px] h-[60px] rounded-[18px] bg-[#EDF1EF] flex items-center justify-center">
                      <Image src={service.icon} alt="" width={64} height={64} className="w-9 h-9 object-contain grayscale opacity-50" />
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#8A6C0E] bg-gold-soft px-2.5 py-1 rounded-pill">
                      <Lock className="w-3.5 h-3.5" />
                      للأعضاء فقط
                    </span>
                  </span>
                  <span className="font-bold text-[#7A877F] text-lg leading-snug">{service.title}</span>
                  <span className="text-sm text-[#9AA59F] leading-relaxed flex-1">{service.desc}</span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#9AA59F]">
                    <Lock className="w-4 h-4" />
                    غير متاحة لحسابك
                  </span>
                </div>
              );
            }

            return (
              <a key={service.key} href={service.href} className="group bg-white border border-line rounded-3xl p-6 flex flex-col gap-4 text-right hover:-translate-y-1 hover:shadow-lift hover:border-[#BFDCCB] transition-all duration-300">
                <span className="w-[60px] h-[60px] rounded-[18px] bg-mint flex items-center justify-center transition-transform group-hover:scale-105">
                  <Image src={service.icon} alt="" width={64} height={64} className="w-9 h-9 object-contain" />
                </span>
                <span className="font-bold text-ink text-lg leading-snug">{service.title}</span>
                <span className="text-sm text-ink-muted leading-relaxed flex-1">{service.desc}</span>
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary group-hover:gap-2.5 transition-all">
                  ابدأ الخدمة
                  <ArrowLeft className="w-4 h-4" />
                </span>
              </a>
            );
          })}
        </div>

        <p className="mt-14 text-center text-ink-muted leading-loose max-w-3xl mx-auto">
          في حال واجهت أي مشكلة أثناء استخدام أي خدمة، يمكنك التواصل مع فريق الدعم الفني الخاص بالنقابة. والمتوفر للرد على الاستفسارات ومتابعة الطلبات خطوة بخطوة.
        </p>
      </div>
    </section>
  );
}
