import { getCurrentUser } from "./auth";
import { isMemberRole } from "./services";

// بترجع: فيه حد داخل؟ وهل هو عضو (يقدر يستخدم كل الخدمات)؟
export async function getServiceAccess() {
  const user = await getCurrentUser();
  return {
    loggedIn: !!user,
    role: user?.role ?? null,
    isMember: isMemberRole(user?.role),
  };
}
