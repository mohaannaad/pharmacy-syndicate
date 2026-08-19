import ServiceCard from "./ServiceCard";

const services = [
  { icon: "/service-ad.png", title: "اضافة اعلان", desc: "انشاء وادارة إعلاناتك داخل المنصة" },
  { icon: "/service-certificate.png", title: "استخراج شهادة", desc: "طلب الشهادات الرسمية ومتابعتها بشكل فوري" },
  { icon: "/service-complaint.png", title: "تقديم شكوى", desc: "إرسال الشكاوى ومتابعتها إلكترونيًا" },
  { icon: "/service-fees.png", title: "رسوم", desc: "جميع الرسوم المعتمدة لخدمات النقابة" },
  { icon: "/service-card.png", title: "تجديد الكارنيه", desc: "تجديد بطاقة العضوية بسهولة وسرعة" },
  { icon: "/service-bmi.png", title: "كتلة الجسم", desc: "طلب الشهادات الرسمية ومتابعتها بشكل فوري" },
  { icon: "/service-refund.png", title: "الاسترداد", desc: "إرسال الشكاوى ومتابعتها إلكترونيًا" },
  { icon: "/service-pharmacy-location.png", title: "موقع الصيدليات", desc: "ابحث عن أقرب صيدلية في محيطك بسهولة" },
  { icon: "/service-new-member.png", title: "عضو جديد", desc: "بدء إجراءات الانضمام لنقابة الصيادلة" },
];

export default function AllServicesGrid() {
  return (
    <section className="bg-surface-muted py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>

        <p className="mt-16 text-center text-gray-500 leading-loose max-w-3xl mx-auto">
          في حال واجهت أي مشكلة أثناء استخدام أي خدمة، يمكنك التواصل مع فريق الدعم الفني الخاص بالنقابة. والمتوفر للرد على الاستفسارات ومتابعة الطلبات خطوة بخطوة.
        </p>
      </div>
    </section>
  );
}