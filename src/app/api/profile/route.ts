import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: parseInt(session.user.id as string) },
    select: { id: true, name: true, phone: true, photo: true, clinic: true },
  });

  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

  const body = await req.json();
  const { name, clinic } = body;

  const user = await prisma.user.update({
    where: { id: parseInt(session.user.id as string) },
    data: { name, clinic },
    select: { id: true, name: true, phone: true, clinic: true },
  });

  return NextResponse.json({ success: true, user });
}
