import Image from "next/image";
import { Headset, BadgeCheck, Users, UserPlus, UserCheck } from "lucide-react";

const stats = [
  { icon: Headset, value: "24 / 7", label: "دعم متواصل" },
  { icon: BadgeCheck, value: "+100K", label: "شهادة صادرة" },
  { icon: Users, value: "+50K", label: "عضو مسجل" },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-l from-primary-dark to-primary">
      <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="shrink-0 order-1">
          <Image src="/doctor.png" alt="طبيب صيدلي" width={420} height={480} className="w-72 md:w-96 h-auto" priority />
        </div>

        <div className="text-white text-right order-2 flex-1">
          <h1 className="text-3xl md:text-4xl font-bold leading-relaxed">النقابة العامة لصيادلة مصر</h1>
          <p className="mt-3 text-white/80 text-lg">منصة رقمية متكاملة لخدمة الصيادلة والخريجين الجدد</p>

          <div className="mt-6 flex flex-wrap gap-4 justify-end">
            <button className="flex items-center gap-2 bg-primary-dark border border-white/30 text-white px-6 py-3 rounded-pill font-medium">
              <UserCheck className="w-4 h-4" />
              تسجيل عضو حالي
            </button>
            <button className="flex items-center gap-2 bg-transparent border border-white text-white px-6 py-3 rounded-pill font-medium">
              <UserPlus className="w-4 h-4" />
              تسجيل خريج جديد
            </button>
          </div>

          <div className="mt-10 flex flex-wrap gap-8 justify-end">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{stat.value}</div>
                    <div className="text-sm text-white/70">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}