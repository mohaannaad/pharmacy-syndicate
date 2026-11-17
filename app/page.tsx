import HeroSection from "./components/HeroSection";
import ServicesSection from "./components/ServicesSection";
import GraduateJourney from "./components/GraduateJourney";
import NewsSection from "./components/NewsSection";
import { getActiveHeroSlides } from "./lib/heroSlides";

// الصفحة بتتبني مع كل زيارة، عشان أي تغيير في الداشبورد يظهر فورًا
export const dynamic = "force-dynamic";

export default async function Home() {
  const heroSlides = await getActiveHeroSlides();

  return (
    <main className="bg-surface-muted">
      <HeroSection slides={heroSlides} />
      <ServicesSection />
      <GraduateJourney />
      <NewsSection />
      <NewsSection title="أخبار النقابات الفرعية" subtitle="من المحافظات" category="BRANCH" />
    </main>
  );
}
