import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

  const body = await req.json();
  const { animal, breed, petInfo, serviceDate, meetingPlace, wishes } = body;

  if (!animal || !serviceDate || !meetingPlace) {
    return NextResponse.json({ error: "Заполните обязательные поля" }, { status: 400 });
  }

  const request = await prisma.veterinaryRequest.create({
    data: {
      userId: parseInt(session.user.id as string),
      animal, breed, petInfo, serviceDate, meetingPlace, wishes,
    },
  });

  return NextResponse.json({ success: true, request });
}
