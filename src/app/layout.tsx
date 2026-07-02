import type { Metadata } from "next";
import "../styles/globals.scss";

export const metadata: Metadata = {
  title: "Livio — ваше здоровье",
  description: "Приложение для управления вашим здоровьем",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <div className="page-wrapper">{children}</div>
      </body>
    </html>
  );
}
