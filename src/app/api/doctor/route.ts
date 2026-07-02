import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

  const body = await req.json();
  const { patientName, phone, appointmentDate, appointmentTime } = body;

  if (!patientName || !phone || !appointmentDate || !appointmentTime) {
    return NextResponse.json({ error: "Заполните все поля" }, { status: 400 });
  }

  const appt = await prisma.doctorAppointment.create({
    data: {
      userId: parseInt(session.user.id as string),
      patientName,
      phone,
      appointmentDate,
      appointmentTime,
    },
  });

  return NextResponse.json({ success: true, appt });
}

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

  const appts = await prisma.doctorAppointment.findMany({
    where: { userId: parseInt(session.user.id as string) },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(appts);
}
