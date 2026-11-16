import NewsCard from "./NewsCard";
import AdBanner from "./AdBanner";
import Reveal from "./Reveal";
import { prisma } from "../lib/prisma";

interface NewsSectionProps {
  title?: string;
  subtitle?: string;
  useRealData?: boolean;
}

export default async function NewsSection({ title = "آخر الأخبار والفعاليات", subtitle = "المركز الإعلامي", useRealData = true }: NewsSectionProps) {
  const news = useRealData
    ? await prisma.news.findMany({ orderBy: { order: "asc" } })
    : [];

  // أول خبر كبير، وجنبه 3 أخبار صغيرة، والباقي كروت عادية تحت الإعلان
  const featured = news[0];
  const side = news.slice(1, 4);
  const more = news.slice(4, 7);

  const card = (item: (typeof news)[number], variant: "featured" | "compact" | "default") => (
    <NewsCard id={item.id} type={item.type} title={item.title} content={item.content} imageUrl={item.imageUrl} youtubeUrl={item.youtubeUrl} createdAt={item.createdAt.toString()} variant={variant} />
  );

  return (
    <section className="pb-20 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Reveal className="flex items-end justify-between gap-6 flex-wrap mb-8">
          <div className="text-right">
            <span className="text-[#3F8F2A] font-bold text-sm md:text-[15px]">{subtitle}</span>
            <h2 className="mt-1.5 text-3xl md:text-[38px] font-extrabold text-ink leading-tight">{title}</h2>
          </div>
        </Reveal>

        {useRealData ? (
          <>
            {featured && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <Reveal className={side.length > 0 ? "lg:col-span-2" : "lg:col-span-3"}>{card(featured, "featured")}</Reveal>
                {side.length > 0 && (
                  <div className="grid grid-rows-none gap-5 content-start">
                    {side.map((item, i) => (
                      <Reveal key={item.id} delay={(i + 1) * 100}>{card(item, "compact")}</Reveal>
                    ))}
                  </div>
                )}
              </div>
            )}

            <Reveal className="mt-10">
              <AdBanner />
            </Reveal>

            {more.length > 0 && (
              <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
                {more.map((item, i) => (
                  <Reveal key={item.id} delay={i * 100}>{card(item, "default")}</Reveal>
                ))}
              </div>
            )}

            {news.length === 0 && <p className="mt-10 text-center text-ink-muted">لا توجد أخبار حاليًا</p>}
          </>
        ) : (
          <Reveal>
            <div className="bg-white border border-dashed border-[#BFDCCB] rounded-3xl py-12 text-center text-ink-muted">قريبًا: أخبار النقابات الفرعية</div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
