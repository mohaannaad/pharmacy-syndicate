import Image from "next/image";

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

        <div className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-8">
          {services.map((service) => (
            <div key={service.title} className="flex flex-col items-center text-center gap-4">
              <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center">
                <Image src={service.icon} alt={service.title} width={40} height={40} className="w-9 h-9 object-contain" />
              </div>
              <div>
                <div className="font-bold text-gray-900">{service.title}</div>
                <div className="text-sm text-gray-500 mt-1">{service.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <button className="mt-12 bg-brand-green text-white px-8 py-3 rounded-pill font-medium">
          جميع الخدمات
        </button>
      </div>
    </section>
  );
}