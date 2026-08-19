import PageHeader from "../components/PageHeader";
import SearchInput from "../components/SearchInput";
import BranchCard from "../components/BranchCard";
const branch = {
  name: "فرع القاهره الرئيسي",
  address: "15 شارع الطيران، مدينة نصر، القاهرة",
  phone: "+20 212345678",
  hours: "السبت - الخميس 09:00 صباحا - 05:00 مساء",
  representative: "د. أحمد محمود",
  council: "مجلس نقابة القاهرة",
};

const branches = Array.from({ length: 11 }, () => branch);

export default function BranchesPage() {
  return (
    <main>
      <PageHeader title="نقابات فرعية" subtitle="تعرف على مواقع وعناوين فروع النقابة في جميع أنحاء مصر" />
      <section className="bg-surface-muted py-14">
        <div className="max-w-7xl mx-auto px-6">
          <SearchInput placeholder="ابحث عن فرع" />

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {branches.map((b, i) => (
              <BranchCard key={i} {...b} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}