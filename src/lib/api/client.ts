import axios from "axios";
import { getSession, signOut } from "next-auth/react";

export const mainClient = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4008" });

// แนบ JWT จาก session ทุก request; 401 → เด้งไป login
mainClient.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.apiToken) config.headers.Authorization = `Bearer ${session.apiToken}`;
  return config;
});

mainClient.interceptors.response.use(
  (r) => r,
  (err) => {
    if (axios.isAxiosError(err) && err.response?.status === 401 && typeof window !== "undefined") {
      void signOut({ callbackUrl: "/login" });
    }
    return Promise.reject(err);
  },
);
