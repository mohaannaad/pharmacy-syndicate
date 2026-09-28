import Image from "next/image";
import { ALL_SERVICES } from "../lib/services";

export default function AllServicesGrid() {
  return (
    <section className="bg-surface-muted py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {ALL_SERVICES.map((service) => (
            <ServiceCardInline key={service.key} icon={service.icon} title={service.title} desc={service.desc} href={service.href} />
          ))}
        </div>

        <p className="mt-16 text-center text-gray-500 leading-loose max-w-3xl mx-auto">
          في حال واجهت أي مشكلة أثناء استخدام أي خدمة، يمكنك التواصل مع فريق الدعم الفني الخاص بالنقابة. والمتوفر للرد على الاستفسارات ومتابعة الطلبات خطوة بخطوة.
        </p>
      </div>
    </section>
  );
}

function ServiceCardInline({ icon, title, desc, href }: { icon: string; title: string; desc: string; href: string }) {
  return (
    <a href={href} className="group bg-white rounded-3xl shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 ease-out p-6 flex flex-col items-center text-center gap-4 cursor-pointer">
      <div className="w-12 h-12 flex items-center justify-center transition-transform duration-300 ease-out group-hover:scale-110">
        <Image src={icon} alt={title} width={64} height={64} className="w-full h-full object-contain" />
      </div>
      <div>
        <div className="font-bold text-gray-900 text-base">{title}</div>
        <div className="text-sm font-light text-gray-400 mt-1.5 leading-relaxed">{desc}</div>
      </div>
    </a>
  );
}