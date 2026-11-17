import { prisma } from "../../lib/prisma";
import { NextResponse } from "next/server";

function extractYoutubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

// ?category=MAIN (أخبار النقابة العامة) أو ?category=BRANCH (أخبار النقابات الفرعية)
// من غير category بترجع كل الأخبار
export async function GET(request: Request) {
  const category = new URL(request.url).searchParams.get("category");
  const news = await prisma.news.findMany({
    where: category === "MAIN" || category === "BRANCH" ? { category } : undefined,
    orderBy: { order: "asc" },
  });
  return NextResponse.json(news);
}

export async function POST(request: Request) {
  const body = await request.json();

  let imageUrl = body.imageUrl || null;

  if (body.type === "YOUTUBE" && body.youtubeUrl) {
    const videoId = extractYoutubeId(body.youtubeUrl);
    if (videoId) {
      imageUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
  }

  const newItem = await prisma.news.create({
    data: {
      type: body.type,
      title: body.title,
      content: body.content || null,
      imageUrl,
      youtubeUrl: body.youtubeUrl || null,
      order: body.order ?? 0,
      category: body.category === "BRANCH" ? "BRANCH" : "MAIN",
      branchName: body.category === "BRANCH" ? body.branchName || null : null,
    },
  });

  return NextResponse.json(newItem);
}