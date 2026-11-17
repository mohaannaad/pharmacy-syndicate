"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useAutoRefresh } from "../lib/useAutoRefresh";
import { usePathname } from "next/navigation";
import { Newspaper, Megaphone, LayoutDashboard, Bell, User, AlertTriangle, CircleDollarSign, CalendarDays, FileText, GraduationCap, IdCard, LayoutGrid, UserCheck, Images, Menu, Users, Building } from "lucide-react";

// القايمة متقسمة مجموعات: الطلبات اللي محتاجة إجراء، ومحتوى الموقع
const menuGroups = [
  {
    title: "",
    items: [{ label: "لوحة التحكم", href: "/admin", icon: LayoutDashboard }],
  },
  {
    title: "الطلبات",
    items: [
      { label: "طلبات القيد", href: "/admin/graduates", icon: GraduationCap },
      { label: "تجديد الاشتراك والكارنيه", href: "/admin/renewals", icon: IdCard },
      { label: "حسابات الأعضاء", href: "/admin/member-accounts", icon: UserCheck },
      { label: "الشهادات", href: "/admin/certificates", icon: FileText },
      { label: "الشكاوى", href: "/admin/complaints", icon: AlertTriangle },
      { label: "الإعلانات", href: "/admin/ads", icon: Megaphone },
    ],
  },
  {
    title: "محتوى الموقع",
    items: [
      { label: "الشرائح الرئيسية", href: "/admin/hero", icon: Images },
      { label: "خدمات الرئيسية", href: "/admin/home-services", icon: LayoutGrid },
      { label: "الأخبار", href: "/admin/news", icon: Newspaper },
      { label: "أخبار النقابات الفرعية", href: "/admin/branch-news", icon: Building },
      { label: "الرسوم", href: "/admin/fees", icon: CircleDollarSign },
      { label: "الرحلات والفعاليات", href: "/admin/activities", icon: CalendarDays },
    ],
  },
  {
    title: "المستخدمون",
    items: [{ label: "حسابات المستخدمين", href: "/admin/users", icon: Users }],
  },
];

const menuItems = menuGroups.flatMap((g) => g.items);

// =====================================================================
// الإشعارات: نقطة دهبي جنب القسم لما يوصل فيه طلب جديد
// ---------------------------------------------------------------------
// بنحفظ في المتصفح آخر مرة الموظف فتح كل قسم،
// ولو فيه طلب وصل بعد الوقت ده بتظهر النقطة، وبتختفي أول ما يفتح القسم.
// =====================================================================
const SEEN_KEY = "adminSeenAt";

function readSeen(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(SEEN_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeSeen(seen: Record<string, string>) {
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify(seen));
  } catch {}
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const activeItem =
    menuItems.find((item) => (item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href))) ??
    menuItems[0];

  const [menuOpen, setMenuOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [latest, setLatest] = useState<Record<string, string | null>>({});
  const [seen, setSeen] = useState<Record<string, string>>({});

  // القسم المفتوح حاليًا (بنحتاجه جوه التحديث الدوري)
  const activeHrefRef = useRef(activeItem.href);
  useEffect(() => {
    activeHrefRef.current = activeItem.href;
  }, [activeItem.href]);

  // كل 10 ثواني نسأل عن آخر طلب في كل قسم
  useAutoRefresh(async () => {
    const res = await fetch("/api/admin/activity");
    if (!res.ok) return;
    const data: Record<string, string | null> = await res.json();
    const now = new Date().toISOString();
    const next = readSeen();
    // أول مرة: أي قسم ملوش وقت محفوظ بنعتبره متشاف لحد دلوقتي (عشان النقط ما تنورش كلها مرة واحدة)
    for (const href of Object.keys(data)) {
      if (!next[href]) next[href] = now;
    }
    // القسم المفتوح حاليًا بيتعلّم إنه اتشاف، حتى لو وصل فيه جديد وإنت فاتحه
    if (activeHrefRef.current in data) next[activeHrefRef.current] = now;
    writeSeen(next);
    setSeen(next);
    setLatest(data);
  }, 10000);

  // لما الموظف يفتح قسم: النقطة اللي جنبه تختفي
  function markSeen(href: string) {
    const next = { ...readSeen(), [href]: new Date().toISOString() };
    writeSeen(next);
    setSeen(next);
  }

  const isNew = (href: string) => {
    const last = latest[href];
    return !!last && !!seen[href] && last > seen[href];
  };
  const newItems = menuItems.filter((item) => isNew(item.href));

  const nav = (
    <nav className="px-3 py-4 flex-1 overflow-y-auto">
      {menuGroups.map((group) => (
        <div key={group.title || "main"} className="mb-2">
          {group.title && <p className="px-3 pt-4 pb-1.5 text-xs font-bold text-[#7FA392]">{group.title}</p>}
          <div className="space-y-1">
            {group.items.map((item) => {
              const isActive = item.href === activeItem.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    setMenuOpen(false);
                    markSeen(item.href);
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive ? "bg-white text-primary-dark" : "text-[#C9DDD2] hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="w-[18px] h-[18px]" />
                  <span className="flex-1">{item.label}</span>
                  {isNew(item.href) && <span className="w-2.5 h-2.5 rounded-full bg-gold shadow-[0_0_0_3px_rgba(201,162,39,.25)] animate-pulse" aria-label="جديد" />}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  const brand = (
    <div className="p-6 pb-3">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/logo-white.png" alt="النقابة العامة لصيادلة مصر" width={160} height={50} className="h-10 w-auto" />
      </Link>
    </div>
  );

  return (
    <div dir="rtl" className="flex h-screen bg-[#F3F6F4] overflow-hidden">
      <aside className="w-[264px] bg-primary-dark shrink-0 hidden md:flex md:flex-col">
        {brand}
        {nav}
        <div className="p-4 m-3 rounded-2xl bg-white/[0.07] flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate">إدارة الحاسب الآلي</p>
            <p className="text-xs text-[#9DBBAB] truncate">مسؤول النظام</p>
          </div>
        </div>
      </aside>

      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <aside className="relative w-[264px] bg-primary-dark flex flex-col">
            {brand}
            {nav}
          </aside>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-line flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setMenuOpen(true)} aria-label="القائمة" className="relative md:hidden w-10 h-10 rounded-xl border border-line flex items-center justify-center text-primary">
              <Menu className="w-5 h-5" />
              {newItems.length > 0 && <span className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-gold border-2 border-white" />}
            </button>
            <div>
              <p className="text-xs text-ink-muted">لوحة التحكم</p>
              <h1 className="font-extrabold text-ink">{activeItem.label}</h1>
            </div>
          </div>
          {/* جرس الإشعارات: بيوضح الأقسام اللي فيها طلبات جديدة */}
          <div className="relative">
            <button type="button" onClick={() => setBellOpen((o) => !o)} aria-label="الإشعارات" className="relative w-10 h-10 rounded-full bg-[#F3F7F5] flex items-center justify-center text-ink-muted hover:bg-mint hover:text-primary transition-colors">
              <Bell className="w-[18px] h-[18px]" />
              {newItems.length > 0 && (
                <span className="absolute -top-1 -left-1 min-w-[18px] h-[18px] px-1 rounded-full bg-gold text-[#1B1A12] text-[10px] font-extrabold flex items-center justify-center border-2 border-white">{newItems.length}</span>
              )}
            </button>
            {bellOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setBellOpen(false)} />
                <div className="absolute left-0 top-12 z-50 w-72 bg-white border border-line rounded-2xl shadow-lift overflow-hidden">
                  <p className="px-4 py-3 text-sm font-extrabold text-ink border-b border-line">الإشعارات</p>
                  {newItems.length === 0 ? (
                    <p className="px-4 py-6 text-sm text-ink-muted text-center">لا توجد طلبات جديدة</p>
                  ) : (
                    newItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link key={item.href} href={item.href} onClick={() => { setBellOpen(false); markSeen(item.href); }} className="flex items-center gap-3 px-4 py-3 hover:bg-mint transition-colors">
                          <span className="w-9 h-9 rounded-xl bg-mint text-primary flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4" />
                          </span>
                          <span className="flex-1 text-sm">
                            <b className="block text-ink">{item.label}</b>
                            <span className="text-xs text-ink-muted">وصل طلب جديد</span>
                          </span>
                          <span className="w-2.5 h-2.5 rounded-full bg-gold" />
                        </Link>
                      );
                    })
                  )}
                </div>
              </>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">{children}</div>
      </div>
    </div>
  );
}
