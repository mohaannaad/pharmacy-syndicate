import ServiceCard from "./ServiceCard";
import Link from "next/link";
import { servicesByKeys } from "../lib/services";
import { getFeaturedServiceKeys } from "../lib/featuredServices";

// الخدمات الـ 5 بتتقري من قاعدة البيانات (الموظف بيختارها من الداشبورد)
export default async function ServicesSection() {
  const services = servicesByKeys(await getFeaturedServiceKeys());

  return (
    <section className="bg-surface-muted py-16">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">الخدمات</h2>
        <p className="mt-2 text-gray-500">خدمات إلكترونية لتسهيل معاملاتك النقابية</p>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.key} icon={service.icon} title={service.title} desc={service.desc} href={service.href} />
          ))}
        </div>

        <Link href="/services" className="mt-12 inline-block bg-brand-green text-white px-8 py-3 rounded-pill font-medium">
          جميع الخدمات
        </Link>
      </div>
    </section>
  );
}