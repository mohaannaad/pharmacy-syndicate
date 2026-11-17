import { UserPlus, FileText, SquareCheckBig, Building2, GraduationCap, ArrowLeft } from "lucide-react";
import Reveal from "./Reveal";

// =====================================================================
// رحلة الخريج («المسار الأخضر» — النسخة البيضا): نفس مراحل طلب القيد الحقيقية، معروضة كخطوات
// =====================================================================
const steps = [
  { title: "إنشاء حساب", desc: "بالرقم القومي ورقم الهاتف", icon: UserPlus },
  { title: "طلب القيد", desc: "البيانات ورفع المستندات", icon: FileText },
  { title: "مراجعة النقابة", desc: "تابع حالة طلبك أولًا بأول", icon: SquareCheckBig },
  { title: "تسليم الأصول", desc: "في مقر النقابة", icon: Building2 },
  { title: "رقم القيد", desc: "وتصبح عضوًا رسميًا", icon: GraduationCap },
];

// الخط الدهبي المتقطع اللي بيوصل الخطوات (أفقي على الكمبيوتر، رأسي على الموبايل)
const dashedH = { background: "repeating-linear-gradient(90deg, rgba(201,162,39,.7) 0 10px, transparent 10px 18px)" };
const dashedV = { background: "repeating-linear-gradient(180deg, rgba(201,162,39,.7) 0 10px, transparent 10px 18px)" };

export default function GraduateJourney() {
  return (
    <section className="pb-20 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[36px] bg-white border border-line text-ink px-6 py-10 md:px-14 md:py-14 shadow-[0_30px_60px_-40px_rgba(8,61,40,.35)]">
            {/* دواير الخلفية */}
            <span className="pointer-events-none absolute -left-32 -top-36 w-[420px] h-[420px] rounded-full border-[70px] border-primary/5" />
            <span className="pointer-events-none absolute -right-24 -bottom-40 w-[340px] h-[340px] rounded-full border-[56px] border-gold/10" />

            {/* العنوان والزرار */}
            <div className="relative flex flex-col lg:flex-row lg:items-end justify-between gap-8">
              <div className="text-right max-w-xl">
                <span className="inline-flex items-center gap-2 bg-gold-soft text-[#8A6C0E] font-extrabold text-sm px-3.5 py-1.5 rounded-pill">
                  <GraduationCap className="w-4 h-4" />
                  للخريجين الجدد
                </span>
                <h2 className="mt-4 text-3xl md:text-[44px] font-black leading-tight">
                  من التخرج إلى <span className="text-primary">رقم القيد</span>
                  <br />
                  في ٥ خطوات
                </h2>
                <p className="mt-3 text-ink-muted text-base md:text-[17px] leading-loose">قدّم طلب القيد إلكترونيًا وتابع كل مرحلة من صفحة «طلب القيد» حتى تحصل على رقم القيد.</p>
              </div>
              <a href="/signup" className="self-start lg:self-auto inline-flex items-center gap-2.5 bg-primary hover:bg-primary-dark text-white font-black text-base md:text-[17px] px-7 py-4 rounded-pill whitespace-nowrap shadow-[0_18px_40px_-18px_rgba(11,93,59,.6)] transition-colors">
                ابدأ طلب القيد
                <ArrowLeft className="w-[18px] h-[18px]" />
              </a>
            </div>

            {/* الخطوات */}
            <div className="relative mt-10 md:mt-12 grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-[18px]">
              <span className="hidden lg:block absolute top-[31px] right-[9%] left-[9%] h-0.5" style={dashedH} />
              <span className="lg:hidden absolute top-8 bottom-8 right-[31px] w-0.5" style={dashedV} />

              {steps.map((step, i) => {
                const Icon = step.icon;
                const isGoal = i === steps.length - 1;
                return (
                  <Reveal key={step.title} delay={i * 100}>
                    <div className="relative flex lg:flex-col items-center gap-4 lg:gap-0">
                      <span className={`relative z-[1] shrink-0 w-16 h-16 rounded-[22px] flex items-center justify-center border-[1.5px] shadow-[0_0_0_8px_#fff] ${isGoal ? "bg-gold border-gold text-[#1B1A12]" : "bg-mint border-[#D3E6DA] text-primary"}`}>
                        <Icon className="w-[26px] h-[26px]" />
                      </span>
                      <div className={`flex-1 w-full lg:mt-[18px] rounded-[22px] border px-4 py-4 lg:pt-[18px] lg:pb-5 text-right lg:text-center ${isGoal ? "border-[#EADBA8] bg-gold-soft" : "border-line bg-[#F7FAF8]"}`}>
                        <p className="text-xs font-extrabold text-[#3F8F2A] tracking-wide">الخطوة {(i + 1).toLocaleString("ar-EG")}</p>
                        <p className="mt-1 text-lg font-extrabold text-ink">{step.title}</p>
                        <p className="mt-1.5 text-sm text-ink-muted leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
