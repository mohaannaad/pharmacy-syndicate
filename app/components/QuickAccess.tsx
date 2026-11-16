import { UserCheck, GraduationCap, CreditCard } from "lucide-react";

// =====================================================================
// اختصارات سريعة تحت الـ Hero: أهم 3 حاجات الزائر بيدور عليها
// =====================================================================
const items = [
  { title: "تسجيل عضو حالي", desc: "لديك رقم قيد؟ أنشئ حسابك برقم القيد", href: "/register/existing-member", icon: UserCheck, tone: "green" },
  { title: "خريج جديد", desc: "ابدأ إجراءات القيد بالنقابة", href: "/signup", icon: GraduationCap, tone: "green" },
  { title: "تجديد الاشتراك", desc: "سداد الاشتراك وتجديد الكارنيه", href: "/services/renew-card", icon: CreditCard, tone: "gold" },
];

export default function QuickAccess() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8">
      <div className="relative z-10 -mt-10 md:-mt-14 mx-2 md:mx-12 bg-white rounded-3xl shadow-lift border border-line grid grid-cols-1 md:grid-cols-3 overflow-hidden">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <a key={item.href} href={item.href} className={`group flex items-center gap-4 px-6 py-5 md:py-6 hover:bg-[#F0F7F3] transition-colors ${i < items.length - 1 ? "border-b md:border-b-0 md:border-l border-line" : ""}`}>
              <span className={`shrink-0 w-12 h-12 md:w-13 md:h-13 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${item.tone === "gold" ? "bg-gold-soft text-[#9A7A12]" : "bg-mint text-primary"}`}>
                <Icon className="w-6 h-6" />
              </span>
              <span className="flex flex-col text-right">
                <span className="font-bold text-ink text-base md:text-[17px]">{item.title}</span>
                <span className="text-sm text-ink-muted">{item.desc}</span>
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
