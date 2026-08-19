"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import LoginModal from "./LoginModal";
import RegisterDropdown from "./RegisterDropdown";

const navLinks = [
  { label: "الرئيسية", href: "/" },
  { label: "الشهادات", href: "/certificates" },
  { label: "الخدمات", href: "/services" },
  { label: "نقابات فرعية", href: "/branches" },
  { label: "الصيدليات", href: "/pharmacies" },
];

export default function Header() {
  const [showLogin, setShowLogin] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [underline, setUnderline] = useState({ left: 0, width: 0 });

  const activeIndex = navLinks.findIndex((link) =>
    link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)
  );

  useEffect(() => {
    const activeLink = linkRefs.current[activeIndex];
    const nav = navRef.current;
    if (activeLink && nav) {
      const linkRect = activeLink.getBoundingClientRect();
      const navRect = nav.getBoundingClientRect();
      setUnderline({ left: linkRect.left - navRect.left, width: linkRect.width });
    }
  }, [activeIndex, pathname]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        <Link href="/" className="shrink-0">
          <Image src="/logo.png" alt="النقابة العامة لصيادلة مصر" width={220} height={70} className="h-14 w-auto" priority />
        </Link>

        <nav ref={navRef} className="hidden md:flex items-center gap-8 text-sm font-medium relative">
          {navLinks.map((link, i) => (
            <Link key={link.label} href={link.href} ref={(el) => { linkRefs.current[i] = el; }} className={i === activeIndex ? "text-primary pb-1" : "text-gray-600 hover:text-primary transition-colors pb-1"}>
              {link.label}
            </Link>
          ))}
          <span
            className="absolute bottom-0 h-0.5 bg-primary-light transition-all duration-300 ease-out"
            style={{ left: underline.left, width: underline.width }}
          />
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center bg-gray-100 rounded-pill px-4 py-2 gap-2 w-64">
            <input type="text" placeholder="ابحث عن صيدلية" className="bg-transparent outline-none text-sm w-full text-right" />
            <Search className="w-4 h-4 text-primary shrink-0" />
          </div>

          <RegisterDropdown />

          <button
            onClick={() => setShowLogin(true)}
            className="bg-primary text-white px-5 py-2 rounded-pill text-sm font-medium whitespace-nowrap"
          >
            تسجيل دخول
          </button>
        </div>
      </div>

      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} onSwitchToRegister={() => setShowLogin(false)} />
      )}
    </header>
  );
}