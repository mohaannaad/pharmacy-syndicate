import NewsCard from "./NewsCard";
import AdBanner from "./AdBanner";
import Reveal from "./Reveal";
import { prisma } from "../lib/prisma";

interface NewsSectionProps {
  title?: string;
  subtitle?: string;
  useRealData?: boolean;
}

export default async function NewsSection({ title = "آخر الأخبار", subtitle = "تابع آخر الأخبار والفعاليات", useRealData = true }: NewsSectionProps) {
  const news = useRealData
    ? await prisma.news.findMany({ orderBy: { order: "asc" } })
    : [];

  const firstGroup = news.slice(0, 4);
  const secondGroup = news.slice(4, 6);

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal className="text-right">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
          <p className="mt-2 text-gray-500">{subtitle}</p>
        </Reveal>

        {useRealData ? (
          <>
            {firstGroup.length > 0 && (
              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                {firstGroup.map((item, i) => (
                  <Reveal key={item.id} delay={(i % 2) * 120}>
                  <NewsCard id={item.id} type={item.type} title={item.title} content={item.content} imageUrl={item.imageUrl} youtubeUrl={item.youtubeUrl} createdAt={item.createdAt.toString()} />
                  </Reveal>
                ))}
              </div>
            )}

            <Reveal className="mt-6">
              <AdBanner variant="dark" />
            </Reveal>
            <Reveal className="mt-6">
              <AdBanner variant="blue" />
            </Reveal>

            {secondGroup.length > 0 && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {secondGroup.map((item, i) => (
                  <Reveal key={item.id} delay={(i % 2) * 120}>
                  <NewsCard id={item.id} type={item.type} title={item.title} content={item.content} imageUrl={item.imageUrl} youtubeUrl={item.youtubeUrl} createdAt={item.createdAt.toString()} />
                  </Reveal>
                ))}
              </div>
            )}

            {news.length === 0 && <p className="mt-10 text-center text-gray-400">لا توجد أخبار حاليًا</p>}
          </>
        ) : (
          <Reveal>
            <p className="mt-10 text-center text-gray-400">قريبًا: أخبار النقابات الفرعية</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}