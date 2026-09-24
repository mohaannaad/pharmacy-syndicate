import { prisma } from "../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const activities = await prisma.activity.findMany({
    orderBy: { date: "asc" },
  });
  return NextResponse.json(activities);
}

export async function POST(request: Request) {
  const body = await request.json();

  const newActivity = await prisma.activity.create({
    data: {
      category: body.category,
      title: body.title,
      description: body.description,
      imageUrl: body.imageUrl || null,
      date: new Date(body.date),
      location: body.location,
      bookingDeadline: new Date(body.bookingDeadline),
      price: body.price ?? 0,
      capacity: body.capacity,
    },
  });

  return NextResponse.json(newActivity);
}