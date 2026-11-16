import MembersOnly from "../../components/MembersOnly";
import { getServiceAccess } from "../../lib/access";

// الخدمة دي لأعضاء النقابة بس: الزائر والخريج بيشوفوا شاشة "للأعضاء فقط"
export const dynamic = "force-dynamic";

export default async function MembersOnlyLayout({ children }: { children: React.ReactNode }) {
  const access = await getServiceAccess();
  if (!access.isMember) return <MembersOnly loggedIn={access.loggedIn} />;
  return <>{children}</>;
}
