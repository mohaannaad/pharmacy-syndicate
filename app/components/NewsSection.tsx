import NewsCard from "./NewsCard";
import AdBanner from "./AdBanner";

const newsItem = {
  title: "قرار هيئة الدواء بشأن صلاحية الأدوية المستوردة",
  desc: "هيئة الدواء أصدرت قرار (Decree No.39/2025) بشدد شروط الصلاحية للأدوية والمنتجات البيولوجية المستوردة، ويحدد قواعد استثناءات للحالات الطارئة.",
  date: "12 أكتوبر 2025",
  source: "موقع EDA الرسمي",
};

export default function NewsSection() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-right">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">أخر الاخبار</h2>
          <p className="mt-2 text-gray-500">تابع اخر الاخبار والفعاليات</p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <NewsCard {...newsItem} hasVideo />
          <NewsCard {...newsItem} />
          <NewsCard {...newsItem} />
          <NewsCard {...newsItem} />
        </div>

        <div className="mt-6">
          <AdBanner variant="dark" />
        </div>
        <div className="mt-6">
          <AdBanner variant="blue" />
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <NewsCard {...newsItem} />
          <NewsCard {...newsItem} />
        </div>
      </div>
    </section>
  );
}