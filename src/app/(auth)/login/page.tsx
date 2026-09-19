import { Suspense } from "react";
import { LoginContent } from "@/components/partials/Login";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
