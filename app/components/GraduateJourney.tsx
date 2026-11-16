import Reveal from "./Reveal";

// =====================================================================
// رحلة الخريج: نفس مراحل طلب القيد الحقيقية، معروضة كخطوات
// =====================================================================
const steps = [
  { title: "إنشاء حساب", desc: "بالرقم القومي والهاتف", tone: "done" },
  { title: "طلب القيد", desc: "البيانات والمستندات", tone: "done" },
  { title: "مراجعة النقابة", desc: "ومتابعة الحالة", tone: "next" },
  { title: "تسليم الأصول", desc: "في مقر النقابة", tone: "next" },
  { title: "رقم القيد", desc: "وتصبح عضوًا", tone: "goal" },
];

const circle = {
  done: "bg-primary text-white",
  next: "bg-mint text-primary",
  goal: "bg-gold-soft text-[#9A7A12]",
};
const bar = {
  done: "bg-primary",
  next: "bg-[#D7E7DD]",
  goal: "bg-[#EFE3B8]",
};

export default function GraduateJourney() {
  return (
    <section className="pb-20 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Reveal>
          <div className="bg-white border border-line rounded-[32px] p-7 md:p-12 flex flex-col lg:flex-row gap-10 lg:gap-12 lg:items-center">
            <div className="lg:w-[34%] flex flex-col gap-3 text-right">
              <span className="text-[#3F8F2A] font-bold text-sm md:text-[15px]">للخريجين الجدد</span>
              <h2 className="text-2xl md:text-[34px] font-extrabold text-ink leading-snug">من التخرج إلى رقم القيد خطوة بخطوة</h2>
              <p className="text-ink-muted leading-relaxed">قدّم طلب القيد إلكترونيًا، وتابع كل مرحلة من صفحة «طلباتي» حتى تحصل على رقم القيد.</p>
              <a href="/signup" className="mt-2 self-start bg-primary hover:bg-primary-dark text-white font-bold px-6 py-3 rounded-pill transition-colors">ابدأ طلب القيد</a>
            </div>
            <ol className="flex-1 grid grid-cols-2 sm:grid-cols-5 gap-4">
              {steps.map((step, i) => (
                <li key={step.title} className="flex flex-col gap-2.5 text-right">
                  <span className={`w-11 h-11 rounded-full font-extrabold flex items-center justify-center ${circle[step.tone as keyof typeof circle]}`}>{(i + 1).toLocaleString("ar-EG")}</span>
                  <span className={`h-[3px] rounded ${bar[step.tone as keyof typeof bar]}`} />
                  <span className="font-bold text-ink text-[15px]">{step.title}</span>
                  <span className="text-[13px] text-ink-muted">{step.desc}</span>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
