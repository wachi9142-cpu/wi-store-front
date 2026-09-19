"use client";

import { NextAuthProvider } from "@/context/auth/NextAuthProvider";
import { QueryProvider } from "@/context/query/QueryProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthProvider>
      <QueryProvider>{children}</QueryProvider>
    </NextAuthProvider>
  );
}
