import { CircleDollarSign } from "lucide-react";
import PageHeader from "../../components/PageHeader";

const fees = [
  { name: "تجديد الكارنيه السنوي", price: "150 جنيه" },
  { name: "شهادة عضوية النقابة", price: "50 جنيه" },
  { name: "شهادة مزاولة المهنة", price: "100 جنيه" },
  { name: "شهادة حسن سير وسلوك", price: "50 جنيه" },
  { name: "شهادة خبرة", price: "50 جنيه" },
  { name: "رسوم تسجيل عضو جديد", price: "300 جنيه" },
];

export default function FeesPage() {
  return (
    <main>
      <PageHeader title="الرسوم" subtitle="جميع الرسوم المعتمدة لخدمات النقابة" />
      <section className="bg-surface-muted py-14">
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100">
                      {fees.map((fee) => (
              <div key={fee.name} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <CircleDollarSign className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-gray-700 text-sm">{fee.name}</span>
                </div>
                <span className="font-bold text-primary">{fee.price}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-6">
            الأسعار قابلة للتحديث من قبل النقابة، ويمكن سداد أي رسم إلكترونيًا من صفحة الخدمة الخاصة به.
          </p>
        </div>
      </section>
    </main>
  );
}