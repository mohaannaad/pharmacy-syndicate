import { CircleDollarSign } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import { prisma } from "../../lib/prisma";

export default async function FeesPage() {
  const fees = await prisma.fee.findMany({ orderBy: { order: "asc" } });

  return (
    <main>
      <PageHeader title="الرسوم" subtitle="جميع الرسوم المعتمدة لخدمات النقابة" />
      <section className="bg-surface-muted py-14">
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100">
            {fees.map((fee) => (
              <div key={fee.id} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <CircleDollarSign className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <span className="text-gray-700 text-sm">{fee.name}</span>
                    {fee.note && <p className="text-xs text-gray-400 mt-0.5">{fee.note}</p>}
                  </div>
                </div>
                <span className="font-bold text-primary">{fee.price} جنيه</span>
              </div>
            ))}
            {fees.length === 0 && <p className="text-center text-gray-400 py-10">لا توجد رسوم متاحة حاليًا</p>}
          </div>
          <p className="text-center text-xs text-gray-400 mt-6">
            الأسعار قابلة للتحديث من قبل النقابة، ويمكن سداد أي رسم إلكترونيًا من صفحة الخدمة الخاصة به.
          </p>
        </div>
      </section>
    </main>
  );
}