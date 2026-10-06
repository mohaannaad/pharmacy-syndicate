import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

// لوحة التحكم: كل طلبات حسابات الأعضاء اللي غيّروا أرقامهم (الأحدث الأول)
export async function GET() {
  const requests = await prisma.memberAccountRequest.findMany({
    orderBy: { createdAt: "desc" },
    omit: { passwordHash: true }, // كلمة السر (حتى المتشفرة) مبتطلعش برّه السيرفر
  });
  return NextResponse.json(requests);
}