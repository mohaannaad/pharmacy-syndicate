import Link from "next/link";
import { Plus } from "lucide-react";
import PageHeader from "../components/PageHeader";
import SearchInput from "../components/SearchInput";
import CertificateCard from "../components/CertificateCard";
import { prisma } from "../lib/prisma";

const TYPE_LABELS: Record<string, string> = {
  GOOD_CONDUCT_AR: "شهادة حسن سير وسلوك (عربي)",
  GOOD_CONDUCT_EN: "شهادة حسن سير وسلوك (إنجليزي)",
  MBA_ISLESCA: "MBA من جامعة إسلسكا",
  DBA_ISLESCA: "DBA من جامعة إسلسكا",
  MBA_NAVAL_ACADEMY: "MBA من الأكاديمية البحرية",
  DBA_NAVAL_ACADEMY: "DBA من الأكاديمية البحرية",
  DIPLOMA_NAVAL_ACADEMY: "دبلوم من الأكاديمية البحرية",
  MBA_ARAB_ACADEMY: "MBA من الأكاديمية العربية الإدارية والمصرفية",
  DBA_ARAB_ACADEMY: "DBA من الأكاديمية العربية الإدارية والمصرفية",
};

export default async function CertificatesPage() {
  const requests = await prisma.certificateRequest.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main>
      <PageHeader
        title="الشهادات"
        subtitle="تتبع طلباتك واحصل على طلبات جديدة"
        action={
          <Link href="/certificates/new" className="flex items-center gap-2 bg-brand-green text-white px-5 py-2.5 rounded-pill text-sm font-medium">
            <Plus className="w-4 h-4" />
            طلب شهادة جديدة
          </Link>
        }
      />

      <section className="bg-surface-muted py-14">
        <div className="max-w-7xl mx-auto px-6">
          <SearchInput placeholder="ابحث عن شهادة" />

          {requests.length === 0 ? (
            <p className="mt-10 text-center text-gray-400">لا توجد طلبات شهادات حتى الآن</p>
          ) : (
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {requests.map((req) => (
                <CertificateCard
                  key={req.id}
                  title={TYPE_LABELS[req.type]}
                  date={new Date(req.createdAt).toLocaleDateString("ar-EG")}
                  number={req.id.slice(0, 8).toUpperCase()}
                  price={`${req.price} جنيه`}
                  status={req.status as any}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}