import { Plus } from "lucide-react";
import PageHeader from "../components/PageHeader";
import SearchInput from "../components/SearchInput";
import CertificateCard from "../components/CertificateCard";

const certificates = [
  { title: "شهادة عضوية النقابة", date: "15/01/2025", number: "CERT-2025-001", price: "50 جنيه", status: "pending" as const },
  { title: "شهادة حسن السير والسلوك", date: "15/01/2025", number: "CERT-2025-001", price: "50 جنيه", status: "rejected" as const },
  { title: "شهادة مزاولة المهنة", date: "15/01/2025", number: "CERT-2025-001", price: "50 جنيه", status: "approved" as const },
  { title: "شهادة خبرة", date: "15/01/2025", number: "CERT-2025-001", price: "50 جنيه", status: "approved" as const },
];

export default function CertificatesPage() {
  return (
    <main>
      <PageHeader
        title="الشهادات"
        subtitle="تتبع طلباتك واحصل على طلبات جديدة"
        action={
         <button className="flex items-center gap-2 bg-brand-green text-white px-5 py-2.5 rounded-pill text-sm font-medium">
            <Plus className="w-4 h-4" />
            طلب شهادة جديدة
          </button>
        }
      />

      <section className="bg-surface-muted py-14">
        <div className="max-w-7xl mx-auto px-6">
          <SearchInput placeholder="ابحث عن شهادة" />

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {certificates.map((cert, i) => (
              <CertificateCard key={i} {...cert} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}