import HeroSection from "./components/HeroSection";
import ServicesSection from "./components/ServicesSection";
import NewsSection from "./components/NewsSection";
import { getActiveHeroSlides } from "./lib/heroSlides";

// الصفحة بتتبني مع كل زيارة، عشان أي تغيير في الداشبورد يظهر فورًا
export const dynamic = "force-dynamic";

export default async function Home() {
  const heroSlides = await getActiveHeroSlides();

  return (
    <main>
            <HeroSection slides={heroSlides} />
      <ServicesSection />
      <NewsSection />
            <NewsSection
        title="اخبار النقابات الفرعية"
        subtitle="تابع مستجدات وأنشطة نقابات الصيادلة الفرعية في جميع المحافظات"
        useRealData={false}
      />
    </main>
  );
}