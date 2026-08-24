import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { NextResponse } from "next/server";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export async function GET() {
  const news = await prisma.news.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json(news);
}

export async function POST(request: Request) {
  const body = await request.json();

  const newItem = await prisma.news.create({
    data: {
      title: body.title,
      description: body.description,
      imageUrl: body.imageUrl || null,
      youtubeUrl: body.youtubeUrl || null,
      order: body.order ?? 0,
    },
  });

  return NextResponse.json(newItem);
}