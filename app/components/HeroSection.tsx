import Image from "next/image";
import { Headset, BadgeCheck, Users, UserPlus, UserCheck } from "lucide-react";

const stats = [
  { icon: Headset, value: "24 / 7", label: "دعم متواصل" },
  { icon: BadgeCheck, value: "+100K", label: "شهادة صادرة" },
  { icon: Users, value: "+50K", label: "عضو مسجل" },
];

export default function HeroSection() {
  return (
    <div className="bg-white px-4 md:px-8 pt-4">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-dark to-primary-light">
        <div
          className="absolute inset-0 opacity-[0.10] bg-repeat"
          style={{ backgroundImage: "url('/hero-pattern.png')", backgroundSize: "180px" }}
        />

        <div className="relative max-w-7xl mx-auto px-6 md:px-10 pt-8 flex flex-col md:flex-row items-end justify-between gap-4">
          <div className="shrink-0 order-1 self-end">
            <Image src="/doctor.png" alt="طبيب صيدلي" width={340} height={380} className="w-56 md:w-72 h-auto block" priority />
          </div>

    {/* عمود الكلام */}
<div className="absolute top-1/2 -translate-y-1/2 left-[230px] w-[500px] text-white text-right flex flex-col items-end gap-4">

  <div>
    <h1 className="text-3xl md:text-4xl font-bold leading-relaxed">
      النقابة العامة لصيادلة مصر
    </h1>

    <p className="mt-2 text-white/80 text-base md:text-lg">
      منصة رقمية متكاملة لخدمة الصيادلة والخريجين الجدد
    </p>
  </div>

  <div className="flex flex-wrap gap-4 justify-end">
    <button className="flex items-center gap-2 bg-primary-light text-white px-7 py-3 rounded-full text-base font-bold">
      <UserCheck className="w-5 h-5" />
      تسجيل عضو حالي
    </button>

    <button className="flex items-center gap-2 bg-transparent border border-white text-white px-7 py-3 rounded-full text-base font-bold">
      <UserPlus className="w-5 h-5" />
      تسجيل خريج جديد
    </button>
  </div>

  <div className="mt-5 flex flex-wrap gap-8 justify-end">
    {stats.map((stat) => {
      const Icon = stat.icon;

      return (
        <div key={stat.label} className="flex items-center gap-2">
          <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-primary-dark" />
          </div>

          <div className="text-right">
            <div className="font-bold text-lg">
              {stat.value}
            </div>

            <div className="text-sm text-white/70">
              {stat.label}
            </div>
          </div>
        </div>
      );
    })}
  </div>

</div>
        </div>
      </section>
    </div>
  );
}