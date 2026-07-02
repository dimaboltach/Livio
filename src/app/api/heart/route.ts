import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

  const exams = await prisma.heartExam.findMany({
    where: { userId: parseInt(session.user.id as string) },
    orderBy: { examDate: "desc" },
  });

  return NextResponse.json(exams);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

  const body = await req.json();
  const { examDate, ecg, echo, mri, ctAngio } = body;

  if (!examDate) return NextResponse.json({ error: "Укажите дату" }, { status: 400 });

  const exam = await prisma.heartExam.create({
    data: {
      userId: parseInt(session.user.id as string),
      examDate, ecg, echo, mri, ctAngio,
    },
  });

  return NextResponse.json({ success: true, exam });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  await prisma.heartExam.deleteMany({
    where: { id: parseInt(id!), userId: parseInt(session.user.id as string) },
  });

  return NextResponse.json({ success: true });
}
