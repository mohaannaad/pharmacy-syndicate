import ServiceCard from "./ServiceCard";
import Link from "next/link";

const services = [
  { icon: "/service-ad.png", title: "اضافة اعلان", desc: "انشاء وادارة إعلاناتك داخل المنصة" },
  { icon: "/service-certificate.png", title: "استخراج شهادة", desc: "طلب الشهادات الرسمية ومتابعتها بشكل فوري" },
  { icon: "/service-complaint.png", title: "تقديم شكوى", desc: "إرسال الشكاوى ومتابعتها إلكترونيًا" },
  { icon: "/service-fees.png", title: "رسوم", desc: "جميع الرسوم المعتمدة لخدمات النقابة" },
  { icon: "/service-card.png", title: "تجديد الكارنيه", desc: "تجديد بطاقة العضوية بسهولة وسرعة" },
];

export default function ServicesSection() {
  return (
    <section className="bg-surface-muted py-16">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">الخدمات</h2>
        <p className="mt-2 text-gray-500">خدمات إلكترونية لتسهيل معاملاتك النقابية</p>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>

      <Link href="/services" className="mt-12 inline-block bg-brand-green text-white px-8 py-3 rounded-pill font-medium">
  جميع الخدمات
</Link>
      </div>
    </section>
  );
}