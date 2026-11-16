import PageHeader from "../components/PageHeader";
import AllServicesGrid from "../components/AllServicesGrid";
import { getServiceAccess } from "../lib/access";

// الصفحة بتتبني مع كل زيارة عشان تعرف مين داخل (عضو ولا زائر)
export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const { role, loggedIn } = await getServiceAccess();

  return (
    <main>
      <PageHeader title="الخدمات" subtitle="خدمات إلكترونية لتسهيل معاملاتك النقابية" />
      <AllServicesGrid role={role} loggedIn={loggedIn} />
    </main>
  );
}
