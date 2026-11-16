import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Lock } from "lucide-react";
import ServiceCard from "./ServiceCard";
import Reveal from "./Reveal";
import { servicesByKeys, canUseService } from "../lib/services";
import { getServiceAccess } from "../lib/access";
import { getFeaturedServiceKeys } from "../lib/featuredServices";

// الخدمات الـ 5 بتتقري من قاعدة البيانات (الموظف بيختارها من الداشبورد)
// خدمة التجديد (لو موجودة) بتظهر في الكارت الكبير، وإلا أول خدمة في الترتيب
export default async function ServicesSection() {
  const services = servicesByKeys(await getFeaturedServiceKeys());
  const { role } = await getServiceAccess();
  const bigIndex = Math.max(0, services.findIndex((s) => s.key === "renewal"));
  const big = services[bigIndex];
  const rest = services.filter((_, i) => i !== bigIndex);
  const bigLocked = big ? !canUseService(big.key, role) : false;

  return (
    <section className="py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Reveal className="flex items-end justify-between gap-6 flex-wrap mb-9">
          <div className="text-right">
            <span className="text-[#3F8F2A] font-bold text-sm md:text-[15px]">الخدمات الإلكترونية</span>
            <h2 className="mt-1.5 text-3xl md:text-[38px] font-extrabold text-ink leading-tight">خدمات تسهّل معاملاتك النقابية</h2>
          </div>
          <Link href="/services" className="inline-flex items-center gap-2 font-bold text-primary hover:text-primary-dark">
            جميع الخدمات
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Reveal>

        {big && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Reveal className="sm:col-span-2 lg:row-span-2 h-full">
              {bigLocked ? (
                <div aria-disabled="true" title="هذه الخدمة متاحة لأعضاء النقابة فقط" className="relative overflow-hidden h-full min-h-[320px] lg:min-h-[380px] bg-primary rounded-[28px] p-8 md:p-9 text-white flex flex-col justify-between cursor-default">
                  <span className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full border-[40px] border-primary-light/20" />
                  <span className="relative w-[72px] h-[72px] rounded-[22px] bg-white flex items-center justify-center">
                    <Image src={big.icon} alt="" width={64} height={64} className="w-11 h-11 object-contain" />
                  </span>
                  <span className="relative flex flex-col gap-3 text-right">
                    <span className="text-2xl md:text-3xl font-extrabold leading-snug">{big.title}</span>
                    <span className="text-[#CFE3D8] leading-relaxed">{big.desc}</span>
                    <span className="mt-2 self-start inline-flex items-center gap-2 bg-gold-soft text-[#8A6C0E] font-bold px-5 py-3 rounded-pill text-[15px]">
                      <Lock className="w-4 h-4" />
                      للأعضاء فقط
                    </span>
                  </span>
                </div>
              ) : (
                <Link href={big.href} className="group relative overflow-hidden h-full min-h-[320px] lg:min-h-[380px] bg-primary rounded-[28px] p-8 md:p-9 text-white flex flex-col justify-between hover:-translate-y-1 hover:shadow-lift transition-all duration-300">
                  <span className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full border-[40px] border-primary-light/20" />
                  <span className="relative w-[72px] h-[72px] rounded-[22px] bg-white flex items-center justify-center">
                    <Image src={big.icon} alt="" width={64} height={64} className="w-11 h-11 object-contain" />
                  </span>
                  <span className="relative flex flex-col gap-3 text-right">
                    <span className="text-2xl md:text-3xl font-extrabold leading-snug">{big.title}</span>
                    <span className="text-[#CFE3D8] leading-relaxed">{big.desc}</span>
                    <span className="mt-2 self-start inline-flex items-center gap-2 bg-white text-primary font-extrabold px-5 py-3 rounded-pill text-[15px] group-hover:gap-3 transition-all">
                      ابدأ الخدمة
                      <ArrowLeft className="w-4 h-4" />
                    </span>
                  </span>
                </Link>
              )}
            </Reveal>

            {rest.map((service, i) => (
              <Reveal key={service.key} delay={(i + 1) * 90} className="h-full">
                <ServiceCard icon={service.icon} title={service.title} desc={service.desc} href={service.href} locked={!canUseService(service.key, role)} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
