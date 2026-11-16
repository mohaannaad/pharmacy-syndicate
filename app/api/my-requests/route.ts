import { NextResponse } from "next/server";
import { getCurrentUser } from "../../lib/auth";
import { isMemberRole } from "../../lib/services";
import { getMyRequests } from "../../lib/myRequests";

// «طلباتي»: كل طلبات العضو للخدمات (للأعضاء المقيدين فقط)
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "يجب تسجيل الدخول أولًا" }, { status: 401 });
  if (!isMemberRole(user.role)) {
    return NextResponse.json({ error: "صفحة «طلباتي» متاحة لأعضاء النقابة فقط" }, { status: 403 });
  }

  const requests = await getMyRequests(user);
  return NextResponse.json({ requests });
}
