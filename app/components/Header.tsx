import Image from "next/image";
import { Search } from "lucide-react";

const navLinks = [
  { label: "الرئيسية", href: "/", active: true },
  { label: "الشهادات", href: "/certificates" },
  { label: "الخدمات", href: "/services" },
  { label: "الفروع", href: "/branches" },
  { label: "الصيدليات", href: "/pharmacies" },
];

export default function Header() {
  return (
    <header className="w-full bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        <a href="/" className="shrink-0">
          <Image src="/logo.png" alt="النقابة العامة لصيادلة مصر" width={220} height={70} className="h-14 w-auto" priority />
        </a>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => {
            const activeClass = "text-primary border-b-2 border-primary-light pb-1";
            const inactiveClass = "text-gray-600 hover:text-primary transition-colors";
            return (
              <a key={link.label} href={link.href} className={link.active ? activeClass : inactiveClass}>
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center bg-gray-100 rounded-pill px-4 py-2 gap-2 w-64">
            <input type="text" placeholder="ابحث عن صيدلية" className="bg-transparent outline-none text-sm w-full text-right" />
            <Search className="w-4 h-4 text-primary shrink-0" />
          </div>
          <button className="bg-primary text-white px-5 py-2 rounded-pill text-sm font-medium whitespace-nowrap">
            تسجيل دخول
          </button>
        </div>
      </div>
    </header>
  );
}