import { redirect } from "next/navigation";
import MembersOnly from "../components/MembersOnly";
import { getServiceAccess } from "../lib/access";

// «طلباتي» للأعضاء المقيدين بس.
// الخريج بيتابع طلبه من صفحة «طلب القيد»، والزائر بيشوف شاشة "للأعضاء فقط"
export const dynamic = "force-dynamic";

export default async function MyRequestsLayout({ children }: { children: React.ReactNode }) {
  const access = await getServiceAccess();
  if (access.role === "GRADUATE") redirect("/register/new-graduate");
  if (!access.isMember) return <MembersOnly loggedIn={access.loggedIn} />;
  return <>{children}</>;
}
