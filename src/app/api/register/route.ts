import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, password } = body;

    if (!name || !phone || !password) {
      return NextResponse.json({ error: "Все поля обязательны" }, { status: 400 });
    }

    const digits = phone.replace(/\D/g, "");
    if (digits.length < 11) {
      return NextResponse.json({ error: "Некорректный номер телефона" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Пароль должен содержать минимум 6 символов" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { phone: digits } });
    if (existing) {
      return NextResponse.json({ error: "Пользователь с таким номером уже существует" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: { name, phone: digits, password: hashedPassword },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
