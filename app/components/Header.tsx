"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import LoginModal from "./LoginModal";
import RegisterDropdown from "./RegisterDropdown";
import UserMenu, { type CurrentUser } from "./UserMenu";

const navLinks = [
  { label: "الرئيسية", href: "/" },
  { label: "الخدمات", href: "/services" },
  { label: "نقابات فرعية", href: "/branches" },
  { label: "الصيدليات", href: "/services/pharmacies" },
];

export default function Header() {
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [underline, setUnderline] = useState({ left: 0, width: 0 });

 const activeIndex = (() => {
  const exactMatch = navLinks.findIndex((link) => link.href === pathname);
  if (exactMatch !== -1) return exactMatch;

  const partialMatches = navLinks
    .map((link, i) => ({ i, href: link.href }))
    .filter((link) => link.href !== "/" && pathname.startsWith(link.href));

  if (partialMatches.length === 0) return -1;

  return partialMatches.reduce((best, current) =>
    current.href.length > best.href.length ? current : best
  ).i;
})();

  // نسأل السيرفر: فيه حد داخل؟
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setUserLoaded(true));
  }, []);

  // مكان الخلفية البيضا تحت اللينك المفتوح.
  // بنستخدم offsetLeft/offsetWidth (مش getBoundingClientRect) عشان يفضل مظبوط
  // لما الموقع يتصغّر على اللابتوبات (site-zoom)، وبنعيد الحساب لو حجم الشاشة اتغير
  useEffect(() => {
    function place() {
      const activeLink = linkRefs.current[activeIndex];
      if (activeLink && navRef.current) {
        setUnderline({ left: activeLink.offsetLeft, width: activeLink.offsetWidth });
      }
    }
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [activeIndex, pathname]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/85 backdrop-blur-xl border-b border-line">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="shrink-0">
          <Image src="/logo.png" alt="النقابة العامة لصيادلة مصر" width={220} height={70} className="h-11 md:h-13 w-auto" priority />
        </Link>

        <nav ref={navRef} className="hidden lg:flex items-center gap-1 bg-[#F1F5F3] rounded-pill p-1.5 text-[15px] font-semibold relative">
          <span className="absolute top-1.5 bottom-1.5 bg-white rounded-pill shadow-[0_1px_3px_rgba(8,61,40,0.12)] transition-all duration-300 ease-out" style={{ left: underline.left, width: underline.width, opacity: activeIndex === -1 ? 0 : 1 }} />
          {navLinks.map((link, i) => (
            <Link key={link.label} href={link.href} ref={(el) => { linkRefs.current[i] = el; }} className={`relative px-4 py-2 rounded-pill transition-colors ${i === activeIndex ? "text-primary" : "text-[#3E4B44] hover:text-primary"}`}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {userLoaded && user && <UserMenu user={user} />}

          {userLoaded && !user && (
            <>
              <div className="hidden sm:block"><RegisterDropdown /></div>
              <button type="button" onClick={() => setShowLogin(true)} className="h-11 bg-primary hover:bg-primary-dark text-white px-5 rounded-pill text-sm md:text-[15px] font-bold whitespace-nowrap transition-colors">
                تسجيل الدخول
              </button>
            </>
          )}

          <button type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label="القائمة" className="lg:hidden w-11 h-11 rounded-pill border border-line bg-white flex items-center justify-center text-primary">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="lg:hidden border-t border-line bg-white px-4 py-3 flex flex-col gap-1">
          {navLinks.map((link, i) => (
            <Link key={link.label} href={link.href} onClick={() => setMenuOpen(false)} className={`px-4 py-3 rounded-2xl font-semibold ${i === activeIndex ? "bg-mint text-primary" : "text-[#3E4B44] hover:bg-surface-muted"}`}>
              {link.label}
            </Link>
          ))}
          {userLoaded && !user && (
            <div className="sm:hidden mt-2 pt-3 border-t border-line grid grid-cols-2 gap-2">
              <a href="/register/existing-member" className="text-center px-3 py-3 rounded-2xl border border-line font-semibold text-sm text-primary">تسجيل عضو حالي</a>
              <a href="/signup" className="text-center px-3 py-3 rounded-2xl border border-line font-semibold text-sm text-primary">تسجيل خريج جديد</a>
            </div>
          )}
        </nav>
      )}

      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} onSwitchToRegister={() => { window.location.href = "/signup"; }} />
      )}
    </header>
  );
}
