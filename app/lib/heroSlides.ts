import { prisma } from "./prisma";

// =====================================================================
// شرائح الصورة الرئيسية (Hero)
// =====================================================================

export interface HeroSlideData {
  id: string;
  imageUrl: string;
  title: string | null;
  subtitle: string | null;
  buttonText: string | null;
  link: string | null;
}

// لو الموظف لسه مضافش أي شريحة، بنعرض الصور الافتراضية
const DEFAULT_SLIDES: HeroSlideData[] = [
  { id: "d1", imageUrl: "/banner-1.jpg", title: "خدمات نقابية إلكترونية… أسهل وأسرع", subtitle: "نحو تجربة رقمية متكاملة تتيح لأعضاء النقابة إنجاز العديد من الخدمات والاستعلامات إلكترونيًا بكل سهولة.", buttonText: "تصفح الخدمات", link: "/services" },
  { id: "d2", imageUrl: "/banner-2.jpg", title: "نطوّر خدماتنا لخدمة صيادلتنا", subtitle: "تعمل النقابة على تطوير خدماتها وتحسين تجربة الأعضاء، بما يواكب التحول الرقمي واحتياجات الصيادلة.", buttonText: null, link: null },
  { id: "d3", imageUrl: "/banner-3.jpg", title: "تابع أحدث أخبار وفعاليات النقابة", subtitle: "كن على اطلاع دائم بآخر قرارات النقابة، والفعاليات، والأنشطة، وكل ما يهم أعضاء نقابة صيادلة مصر.", buttonText: null, link: null },
];

// الصفحة الرئيسية: الشرائح الظاهرة بالترتيب
export async function getActiveHeroSlides(): Promise<HeroSlideData[]> {
  const total = await prisma.heroSlide.count();
  if (total === 0) return DEFAULT_SLIDES;

  return prisma.heroSlide.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
    select: { id: true, imageUrl: true, title: true, subtitle: true, buttonText: true, link: true },
  });
}

// الرابط لازم يبدأ بـ / (صفحة في الموقع) أو http (موقع خارجي)
export function isValidLink(link: string) {
  return link.startsWith("/") || /^https?:\/\//.test(link);
}

// تنظيف وفحص بيانات الشريحة اللي جاية من الداشبورد
export function parseSlideInput(body: Record<string, unknown>) {
  const clean = (value: unknown) => {
    const text = String(value ?? "").trim();
    return text ? text : null;
  };

  const imageUrl = clean(body.imageUrl);
  const title = clean(body.title);
  const subtitle = clean(body.subtitle);
  const buttonText = clean(body.buttonText);
  const link = clean(body.link);

  if (!imageUrl) return { error: "يرجى رفع صورة الشريحة" };
  if (subtitle && !title) return { error: "لا يمكن إضافة وصف بدون عنوان" };
  if (buttonText && !link) return { error: "يرجى إدخال الرابط الذي ينتقل إليه الزر" };
  if (link && !isValidLink(link)) return { error: "الرابط يجب أن يبدأ بـ / لصفحة داخل الموقع، أو بـ https:// لموقع خارجي" };

  return { data: { imageUrl, title, subtitle, buttonText, link } };
}