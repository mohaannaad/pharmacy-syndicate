import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import SiteChrome from "./components/SiteChrome";

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
});

// أيقونة التاب (favicon) وصورة المعاينة لما اللينك يتبعت (واتساب / فيسبوك ...)
// بتتاخد تلقائي من الملفات: app/favicon.ico و app/icon.png و app/apple-icon.png
// و app/opengraph-image.jpg و app/twitter-image.jpg
export const metadata: Metadata = {
  metadataBase: new URL("https://pharmacy-syndicate.vercel.app"),
  title: "النقابة العامة لصيادلة مصر",
  description: "منصة رقمية متكاملة لخدمة الصيادلة والخريجين الجدد",
  openGraph: {
    title: "النقابة العامة لصيادلة مصر",
    description: "خدمات النقابة كلها في مكان واحد: القيد، تجديد الاشتراك، والشهادات",
    siteName: "النقابة العامة لصيادلة مصر",
    locale: "ar_EG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "النقابة العامة لصيادلة مصر",
    description: "خدمات النقابة كلها في مكان واحد: القيد، تجديد الاشتراك، والشهادات",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} font-sans antialiased`}>
   <SiteChrome>{children}</SiteChrome>
</body>
    </html>
  );
}