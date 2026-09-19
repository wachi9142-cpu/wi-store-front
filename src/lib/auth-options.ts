import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4008";

// ล็อกอินด้วยเบอร์แม่ + รหัสผ่าน → back คืน JWT → เก็บใน session เพื่อยิง API ต่อ
export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 7 * 24 * 3600 },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "phone",
      credentials: { phone: { label: "เบอร์โทร", type: "text" }, password: { label: "รหัสผ่าน", type: "password" } },
      async authorize(credentials) {
        if (!credentials) return null;
        const res = await fetch(`${API_URL}/api/auth/login`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ phone: credentials.phone, password: credentials.password }),
        });
        if (!res.ok) return null;
        const data = (await res.json()) as { token: string };
        return { id: credentials.phone, name: "แม่ค้า", apiToken: data.token };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.apiToken = (user as { apiToken: string }).apiToken;
      return token;
    },
    session({ session, token }) {
      session.apiToken = token.apiToken as string;
      return session;
    },
  },
};
