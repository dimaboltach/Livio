import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BottomNav from "@/components/BottomNav/BottomNav";
import AccountClient from "@/app/account/AccountClient";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userId = parseInt(session.user.id as string);
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) redirect("/login");

  const [vetRequests, doctorAppts] = await Promise.all([
    prisma.veterinaryRequest.count({ where: { userId } }),
    prisma.doctorAppointment.count({ where: { userId } }),
  ]);

  const notifications = [];
  if (vetRequests > 0) notifications.push({ icon: "🐾", text: `У вас ${vetRequests} заявок к ветеринару`, date: "" });
  if (doctorAppts > 0) notifications.push({ icon: "🩺", text: `Запланировано ${doctorAppts} приёмов к врачу`, date: "" });

  return (
    <>
      <AccountClient
        user={{ name: user.name, photo: user.photo }}
        notifications={notifications}
      />
      <BottomNav />
    </>
  );
}
