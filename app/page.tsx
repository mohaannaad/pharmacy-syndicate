import HeroSection from "./components/HeroSection";
import ServicesSection from "./components/ServicesSection";
import NewsSection from "./components/NewsSection";

// الصفحة بتتبني مع كل زيارة، عشان أي تغيير في الداشبورد يظهر فورًا
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main>
      <HeroSection />
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