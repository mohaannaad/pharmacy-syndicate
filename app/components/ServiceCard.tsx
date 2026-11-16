import Image from "next/image";
import Link from "next/link";
import { Lock } from "lucide-react";

interface ServiceCardProps {
  icon: string;
  title: string;
  desc: string;
  href?: string;
  // locked = الخدمة للأعضاء بس والزائر مش عضو → الكارت بيظهر عادي بس مش بيفتح
  locked?: boolean;
}

export default function ServiceCard({ icon, title, desc, href, locked = false }: ServiceCardProps) {
  // الكارت المقفول بنفس الشكل العادي، بس مش بيفتح وعليه علامة "للأعضاء فقط"
  if (locked) {
    return (
      <div aria-disabled="true" title="هذه الخدمة متاحة لأعضاء النقابة فقط" className="relative bg-white border border-line rounded-3xl p-6 flex flex-col items-start text-right gap-4 h-full cursor-default">
        <span className="absolute top-5 left-5 inline-flex items-center gap-1 text-xs font-bold text-[#8A6C0E] bg-gold-soft px-2.5 py-1 rounded-pill">
          <Lock className="w-3.5 h-3.5" />
          للأعضاء فقط
        </span>
        <div className="w-14 h-14 rounded-[18px] bg-mint flex items-center justify-center">
          <Image src={icon} alt="" width={64} height={64} className="w-8 h-8 object-contain" />
        </div>
        <div>
          <div className="font-bold text-ink text-lg leading-snug">{title}</div>
          <div className="text-sm text-ink-muted mt-1.5 leading-relaxed">{desc}</div>
        </div>
      </div>
    );
  }

  const content = (
    <div className="group bg-white border border-line rounded-3xl hover:-translate-y-1 hover:shadow-lift hover:border-[#BFDCCB] transition-all duration-300 ease-out p-6 flex flex-col items-start text-right gap-4 cursor-pointer h-full">
      <div className="w-14 h-14 rounded-[18px] bg-mint flex items-center justify-center transition-transform duration-300 ease-out group-hover:scale-105">
        <Image src={icon} alt="" width={64} height={64} className="w-8 h-8 object-contain" />
      </div>
      <div>
        <div className="font-bold text-ink text-lg leading-snug">{title}</div>
        <div className="text-sm text-ink-muted mt-1.5 leading-relaxed">{desc}</div>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href} className="block h-full">{content}</Link>;
  }

  return content;
}
