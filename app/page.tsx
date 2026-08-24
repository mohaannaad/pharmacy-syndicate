import HeroSection from "./components/HeroSection";
import ServicesSection from "./components/ServicesSection";
import NewsSection from "./components/NewsSection";

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