import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

  const metrics = await prisma.metric.findMany({
    where: { userId: parseInt(session.user.id as string) },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(metrics);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

  const body = await req.json();
  const { date, weight, height, waist, chest, hips } = body;

  if (!date) return NextResponse.json({ error: "Укажите дату" }, { status: 400 });

  const metric = await prisma.metric.create({
    data: {
      userId: parseInt(session.user.id as string),
      date,
      weight: weight ? parseFloat(weight) : null,
      height: height ? parseFloat(height) : null,
      waist: waist ? parseFloat(waist) : null,
      chest: chest ? parseFloat(chest) : null,
      hips: hips ? parseFloat(hips) : null,
    },
  });

  return NextResponse.json({ success: true, metric });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID обязателен" }, { status: 400 });

  await prisma.metric.deleteMany({
    where: { id: parseInt(id), userId: parseInt(session.user.id as string) },
  });

  return NextResponse.json({ success: true });
}
