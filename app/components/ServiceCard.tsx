import Image from "next/image";
import Link from "next/link";

interface ServiceCardProps {
  icon: string;
  title: string;
  desc: string;
  href?: string;
}

export default function ServiceCard({ icon, title, desc, href }: ServiceCardProps) {
  const content = (
    <div className="group bg-white rounded-3xl shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 ease-out p-6 flex flex-col items-center text-center gap-4 cursor-pointer h-full">
      <div className="w-12 h-12 flex items-center justify-center transition-transform duration-300 ease-out group-hover:scale-110">
        <Image src={icon} alt={title} width={64} height={64} className="w-full h-full object-contain" />
      </div>
      <div>
        <div className="font-bold text-gray-900 text-base">{title}</div>
        <div className="text-sm font-light text-gray-400 mt-1.5 leading-relaxed">{desc}</div>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}