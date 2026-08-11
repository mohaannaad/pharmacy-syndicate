import PageHeader from "../components/PageHeader";
import AllServicesGrid from "../components/AllServicesGrid";

export default function ServicesPage() {
  return (
    <main>
      <PageHeader title="الخدمات" subtitle="خدمات إلكترونية لتسهيل معاملاتك النقابية" />
      <AllServicesGrid />
    </main>
  );
}