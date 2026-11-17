"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const activeItem =
    menuItems.find((item) => (item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href))) ??
    menuItems[0];

  const [menuOpen, setMenuOpen] = useState(false);

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
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive ? "bg-white text-primary-dark" : "text-[#C9DDD2] hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="w-[18px] h-[18px]" />
                  {item.label}
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
            <button type="button" onClick={() => setMenuOpen(true)} aria-label="القائمة" className="md:hidden w-10 h-10 rounded-xl border border-line flex items-center justify-center text-primary">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <p className="text-xs text-ink-muted">لوحة التحكم</p>
              <h1 className="font-extrabold text-ink">{activeItem.label}</h1>
            </div>
          </div>
          <button type="button" aria-label="الإشعارات" className="w-10 h-10 rounded-full bg-[#F3F7F5] flex items-center justify-center text-ink-muted hover:bg-mint hover:text-primary transition-colors">
            <Bell className="w-[18px] h-[18px]" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">{children}</div>
      </div>
    </div>
  );
}
