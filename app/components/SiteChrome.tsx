"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  // site-zoom: بيصغّر الموقع على اللابتوبات اللي شاشتها متكبّرة (التفاصيل في globals.css)
  return (
    <div className="site-zoom">
      <Header />
      {children}
      <Footer />
    </div>
  );
}