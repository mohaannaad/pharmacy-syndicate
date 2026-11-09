import ServiceCard from "./ServiceCard";
import Link from "next/link";
import Reveal from "./Reveal";
import { servicesByKeys } from "../lib/services";
import { getFeaturedServiceKeys } from "../lib/featuredServices";

// الخدمات الـ 5 بتتقري من قاعدة البيانات (الموظف بيختارها من الداشبورد)
export default async function ServicesSection() {
  const services = servicesByKeys(await getFeaturedServiceKeys());

  return (
    <section className="bg-surface-muted py-16">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <Reveal>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">الخدمات</h2>
          <p className="mt-2 text-gray-500">خدمات إلكترونية لتسهيل معاملاتك النقابية</p>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-6">
          {services.map((service, i) => (
            <Reveal key={service.key} delay={i * 90} className="h-full">
              <ServiceCard icon={service.icon} title={service.title} desc={service.desc} href={service.href} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <Link href="/services" className="mt-12 inline-block bg-brand-green hover:bg-primary text-white px-8 py-3 rounded-pill font-medium transition-colors duration-300">
            جميع الخدمات
          </Link>
        </Reveal>
      </div>
    </section>
  );
}