import { NextResponse } from "next/server";
import { getFeaturedServiceKeys, saveFeaturedServiceKeys } from "../../../lib/featuredServices";
import { isValidFeatured, FEATURED_COUNT } from "../../../lib/services";

export async function GET() {
  const keys = await getFeaturedServiceKeys();
  return NextResponse.json({ keys });
}

export async function PUT(request: Request) {
  const body = await request.json();

  if (!isValidFeatured(body.keys)) {
    return NextResponse.json({ error: `لازم تختار ${FEATURED_COUNT} خدمات بالظبط، من غير تكرار` }, { status: 400 });
  }

  await saveFeaturedServiceKeys(body.keys);
  return NextResponse.json({ keys: body.keys });
}