"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Newspaper, Megaphone, LayoutDashboard, Bell, User, AlertTriangle, CircleDollarSign, CalendarDays } from "lucide-react";

const menuItems = [
  { label: "لوحة التحكم", href: "/admin", icon: LayoutDashboard },
  { label: "الأخبار", href: "/admin/news", icon: Newspaper },
  { label: "الإعلانات", href: "/admin/ads", icon: Megaphone },
   { label: "الشكاوى", href: "/admin/complaints", icon: AlertTriangle },
   { label: "الرسوم", href: "/admin/fees", icon: CircleDollarSign },
   { label: "الرحلات والفعاليات", href: "/admin/activities", icon: CalendarDays },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const activeItem =
    menuItems.find((item) => (item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href))) ??
    menuItems[0];

  return (
    <div dir="rtl" className="flex h-screen bg-surface-muted overflow-hidden">
      <aside className="w-64 bg-white border-l border-gray-100 shrink-0 hidden md:flex md:flex-col">
        <div className="p-6 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="النقابة العامة لصيادلة مصر" width={160} height={50} className="h-10 w-auto" />
          </Link>
          <p className="text-xs text-gray-400 mt-2">لوحة التحكم</p>
        </div>

        <nav className="px-3 py-4 space-y-1 flex-1">
          {menuItems.map((item) => {
            const isActive = item.href === activeItem.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">إدارة الحاسب الآلي</p>
            <p className="text-xs text-gray-400 truncate">مسؤول النظام</p>
          </div>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0">
          <div>
            <p className="text-xs text-gray-400">لوحة التحكم</p>
            <h1 className="font-bold text-gray-900">{activeItem.label}</h1>
          </div>
          <button className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
            <Bell className="w-4 h-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}