import { Suspense } from "react";
import { OrdersContent } from "@/components/partials/Orders";

export default function OrdersPage() {
  return (
    <Suspense>
      <OrdersContent />
    </Suspense>
  );
}
