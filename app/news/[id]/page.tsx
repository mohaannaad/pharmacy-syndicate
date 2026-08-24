import { prisma } from "../../lib/prisma";
import { notFound } from "next/navigation";
import PageHeader from "../../components/PageHeader";

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.news.findUnique({ where: { id } });

  if (!item) notFound();

  const date = new Date(item.createdAt).toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" });

  return (
    <main dir="rtl">
      <PageHeader title={item.title} subtitle={date} />
      <section className="bg-surface-muted py-14">
        <div className="max-w-3xl mx-auto px-6">
          {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="w-full rounded-2xl shadow-sm mb-8" />}
          <div className="bg-white rounded-2xl shadow-sm p-8 text-gray-700 leading-loose whitespace-pre-line">{item.content}</div>
        </div>
      </section>
    </main>
  );
}