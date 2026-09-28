// =====================================================================
// قائمة كل خدمات الموقع في مكان واحد
// ---------------------------------------------------------------------
// صفحة "الخدمات" والصفحة الرئيسية والداشبورد بيقروا من هنا.
// لو ضفت خدمة جديدة للموقع، ضيفها هنا بس وهتظهر في كل الأماكن.
// key = اسم ثابت بالإنجليزي للخدمة (متغيروش بعد ما يتحفظ)
// =====================================================================

export interface SiteService {
  key: string;
  icon: string;
  title: string;
  desc: string;
  href: string;
}

export const ALL_SERVICES: SiteService[] = [
  { key: "ad", icon: "/service-ad.png", title: "اضافة اعلان", desc: "انشاء وادارة إعلاناتك داخل المنصة", href: "/services/ad" },
  { key: "certificate", icon: "/service-certificate.png", title: "استخراج شهادة", desc: "طلب الشهادات الرسمية ومتابعتها بشكل فوري", href: "/certificates" },
  { key: "complaint", icon: "/service-complaint.png", title: "تقديم شكوى", desc: "إرسال الشكاوى ومتابعتها إلكترونيًا", href: "/services/complaint" },
  { key: "fees", icon: "/service-fees.png", title: "رسوم", desc: "جميع الرسوم المعتمدة لخدمات النقابة", href: "/services/fees" },
  { key: "renewal", icon: "/service-card.png", title: "تجديد الاشتراك وتجديد الكارنيه", desc: "سداد الاشتراك السنوي وتجديد بطاقة العضوية", href: "/services/renew-card" },
  { key: "pharmacies", icon: "/service-pharmacy-location.png", title: "موقع الصيدليات", desc: "ابحث عن أقرب صيدلية في محيطك بسهولة", href: "/services/pharmacies" },
  { key: "new-member", icon: "/service-new-member.png", title: "عضو جديد", desc: "بدء إجراءات الانضمام لنقابة الصيادلة", href: "/register/new-graduate" },
  { key: "activities", icon: "/service-activities.png", title: "الرحلات والفعاليات", desc: "احجز في الرحلات والكورسات والفعاليات القادمة", href: "/services/activities" },
];

// عدد الخدمات اللي بتظهر في الصفحة الرئيسية
export const FEATURED_COUNT = 5;

// الخدمات اللي بتظهر لو الموظف لسه ما اختارش
export const DEFAULT_FEATURED = ["ad", "certificate", "complaint", "fees", "renewal"];

// بتاخد قائمة keys وترجع الخدمات بنفس الترتيب (وبتتجاهل أي key مش موجود)
export function servicesByKeys(keys: string[]) {
  return keys.map((key) => ALL_SERVICES.find((s) => s.key === key)).filter((s): s is SiteService => !!s);
}

// بتتأكد إن القائمة فيها 5 خدمات بالظبط، موجودين فعلًا، ومفيش تكرار
export function isValidFeatured(keys: unknown): keys is string[] {
  return (
    Array.isArray(keys) &&
    keys.length === FEATURED_COUNT &&
    new Set(keys).size === keys.length &&
    keys.every((k) => typeof k === "string" && ALL_SERVICES.some((s) => s.key === k))
  );
}