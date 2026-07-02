import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function today() {
  return new Date().toISOString().split("T")[0];
}

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

  const userId = parseInt(session.user.id as string);
  const date = today();

  const record = await prisma.waterIntake.findUnique({ where: { userId_date: { userId, date } } });

  if (!record) {
    const created = await prisma.waterIntake.create({ data: { userId, date, goalMl: 2000, consumed: 0 } });
    return NextResponse.json(created);
  }

  return NextResponse.json(record);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

  const userId = parseInt(session.user.id as string);
  const body = await req.json();
  const { action, goalMl } = body;

  const date = today();

  const record = await prisma.waterIntake.upsert({
    where: { userId_date: { userId, date } },
    create: { userId, date, goalMl: goalMl || 2000, consumed: 0 },
    update: goalMl ? { goalMl } : {},
  });

  if (action === "add") {
    const updated = await prisma.waterIntake.update({
      where: { id: record.id },
      data: { consumed: Math.min(record.consumed + 250, record.goalMl) },
    });
    return NextResponse.json(updated);
  }

  if (action === "remove") {
    const updated = await prisma.waterIntake.update({
      where: { id: record.id },
      data: { consumed: Math.max(record.consumed - 250, 0) },
    });
    return NextResponse.json(updated);
  }

  return NextResponse.json(record);
}
