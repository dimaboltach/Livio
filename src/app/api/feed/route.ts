import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

  const dishes = await prisma.dish.findMany({
    where: { userId: parseInt(session.user.id as string) },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(dishes);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

  const body = await req.json();
  const { name } = body;

  if (!name) return NextResponse.json({ error: "Название блюда обязательно" }, { status: 400 });

  const dish = await prisma.dish.create({
    data: {
      userId: parseInt(session.user.id as string),
      name,
    },
  });

  return NextResponse.json({ success: true, dish });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  await prisma.dish.deleteMany({
    where: { id: parseInt(id!), userId: parseInt(session.user.id as string) },
  });

  return NextResponse.json({ success: true });
}
