import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, ArrowRight } from "lucide-react";
import { prisma } from "../../lib/prisma";
import PageHeader from "../../components/PageHeader";

// الصفحة بتتبني مع كل زيارة، عشان أي تغيير في الداشبورد يظهر فورًا
export const dynamic = "force-dynamic";

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.news.findUnique({ where: { id } });

  if (!item) notFound();

  const date = new Date(item.createdAt).toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" });

  return (
    <main dir="rtl">
      <PageHeader title="الأخبار" subtitle="آخر أخبار ومقالات النقابة العامة لصيادلة مصر" />
      <section className="bg-surface-muted py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-dark mb-6">
            <ArrowRight className="w-4 h-4" />
            العودة للرئيسية
          </Link>

          {/* الصورة يمين والنص شمال (على الموبايل: الصورة فوق والنص تحت) */}
          <article className={`grid grid-cols-1 gap-8 lg:gap-12 items-start ${item.imageUrl ? "lg:grid-cols-2" : ""}`}>
            {item.imageUrl && (
              <div className="lg:sticky lg:top-28">
                <img src={item.imageUrl} alt={item.title} className="w-full aspect-[4/3] object-cover rounded-3xl border border-line shadow-card bg-white" />
              </div>
            )}

            <div className={`bg-white rounded-3xl border border-line shadow-card p-6 md:p-9 text-right ${item.imageUrl ? "" : "max-w-3xl mx-auto w-full"}`}>
              <span className="inline-flex items-center gap-2 text-sm text-ink-muted">
                <CalendarDays className="w-4 h-4 text-primary" />
                {date}
              </span>
              <h1 className="mt-3 text-2xl md:text-[34px] font-extrabold text-ink leading-snug">{item.title}</h1>
              <div className="mt-5 h-1 w-16 rounded-full bg-gold" />
              {item.content && <div className="mt-6 text-[#3E4B44] text-base md:text-[17px] leading-loose whitespace-pre-line">{item.content}</div>}
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
