import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../lib/auth";

// الهيدر بيسأل هنا: مين داخل دلوقتي؟
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ user: null });

  // بنرجع اللي الصفحة محتاجاه بس (من غير كلمة السر طبعًا)
  return NextResponse.json({
    user: {
      fullName: user.fullName,
      role: user.role,
      membershipNumber: user.membershipNumber,
    },
  });
}