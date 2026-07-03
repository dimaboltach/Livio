import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

declare module "next-auth" {
  interface User {
    phone?: string;
  }
  interface Session {
    user: { id: string; phone?: string } & DefaultSession["user"];
  }
}


export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        phone: { label: "Телефон", type: "text" },
        password: { label: "Пароль", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.password) return null;

        // TEMP: test user while DB is not ready
        const TEST_PHONE = "79086118372";
        const TEST_PASSWORD = "123456";
        const phone = String(credentials.phone).replace(/\D/g, "");
        if (phone === TEST_PHONE && String(credentials.password) === TEST_PASSWORD) {
          return { id: "1", name: "Тест Пользователь", phone, image: null };
        }

        try {
          const user = await prisma.user.findUnique({ where: { phone } });
          if (!user) return null;
          const isValid = await bcrypt.compare(String(credentials.password), user.password);
          if (!isValid) return null;
          return { id: String(user.id), name: user.name, phone: user.phone, image: user.photo || null };
        } catch {
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token["phone"] = user.phone;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.phone = token["phone"] as string | undefined;
      }
      return session;
    },
  },
});
