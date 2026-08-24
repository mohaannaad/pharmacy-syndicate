import NewsCard from "./NewsCard";
import AdBanner from "./AdBanner";
import { prisma } from "../lib/prisma";

interface NewsSectionProps {
  title?: string;
  subtitle?: string;
  useRealData?: boolean;
}

export default async function NewsSection({ title = "أخر الاخبار", subtitle = "تابع اخر الاخبار والفعاليات", useRealData = true }: NewsSectionProps) {
  const news = useRealData
    ? await prisma.news.findMany({ orderBy: { order: "asc" } })
    : [];

  const firstGroup = news.slice(0, 4);
  const secondGroup = news.slice(4, 6);

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-right">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
          <p className="mt-2 text-gray-500">{subtitle}</p>
        </div>

        {useRealData ? (
          <>
            {firstGroup.length > 0 && (
              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                {firstGroup.map((item) => (
                  <NewsCard key={item.id} id={item.id} type={item.type} title={item.title} content={item.content} imageUrl={item.imageUrl} youtubeUrl={item.youtubeUrl} createdAt={item.createdAt.toString()} />
                ))}
              </div>
            )}

            <div className="mt-6">
              <AdBanner variant="dark" />
            </div>
            <div className="mt-6">
              <AdBanner variant="blue" />
            </div>

            {secondGroup.length > 0 && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {secondGroup.map((item) => (
                  <NewsCard key={item.id} id={item.id} type={item.type} title={item.title} content={item.content} imageUrl={item.imageUrl} youtubeUrl={item.youtubeUrl} createdAt={item.createdAt.toString()} />
                ))}
              </div>
            )}

            {news.length === 0 && <p className="mt-10 text-center text-gray-400">لا توجد أخبار حاليًا</p>}
          </>
        ) : (
          <p className="mt-10 text-center text-gray-400">قريبًا: أخبار النقابات الفرعية</p>
        )}
      </div>
    </section>
  );
}