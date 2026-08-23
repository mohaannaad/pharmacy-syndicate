import PageHeader from "../../components/PageHeader";
import SearchInput from "../../components/SearchInput";
import PharmacyCard from "../../components/PharmacyCard";

const pharmacy = { name: "صيدلية النور", address: "12 شارع الجمهورية، وسط البلد، القاهرة", hours: "يوميًا 9 صباحًا - 12 منتصف الليل" };
const pharmacies = Array.from({ length: 6 }, () => pharmacy);

export default function PharmaciesPage() {
  return (
    <main>
      <PageHeader title="الصيدليات" subtitle="ابحث عن أقرب صيدلية مرخّصة في محيطك" />
      <section className="bg-surface-muted py-14">
        <div className="max-w-7xl mx-auto px-6">
          <SearchInput placeholder="ابحث عن صيدلية باسمها أو منطقتها" />

          <div className="mt-8 rounded-2xl overflow-hidden shadow-sm h-80">
            <iframe
              src="https://www.google.com/maps?q=Cairo,Egypt&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {pharmacies.map((p, i) => (
              <PharmacyCard key={i} {...p} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}