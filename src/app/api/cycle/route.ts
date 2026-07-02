import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

  const entries = await prisma.cycleDiary.findMany({
    where: { userId: parseInt(session.user.id as string) },
    orderBy: { date: "asc" },
  });

  return NextResponse.json(entries.map((e: { date: string }) => e.date));
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

  const body = await req.json();
  const { date, action } = body;
  const userId = parseInt(session.user.id as string);

  if (action === "remove") {
    await prisma.cycleDiary.deleteMany({ where: { userId, date } });
    return NextResponse.json({ success: true });
  }

  await prisma.cycleDiary.upsert({
    where: { userId_date: { userId, date } },
    create: { userId, date },
    update: {},
  });

  return NextResponse.json({ success: true });
}
