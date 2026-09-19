"use client";

import { DatePicker, Segmented, Space, Typography } from "antd";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import type { OrderStatus } from "@/types/api/main";
import OrdersTable from "./OrdersTable";
import { STATUS_FILTERS } from "./Orders.config";

export default function OrdersContent() {
  const router = useRouter();
  const sp = useSearchParams();
  const status = (sp.get("status") ?? "") as OrderStatus | "";
  const pickupDate = sp.get("pickupDate") ?? "";

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(sp.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`/orders?${next.toString()}`);
  };

  return (
    <div className="space-y-4">
      <Typography.Title level={3} className="m-0!">
        ออเดอร์
      </Typography.Title>
      <Space wrap>
        <Segmented options={STATUS_FILTERS} value={status} onChange={(v) => setParam("status", String(v))} />
        <DatePicker
          placeholder="วันรับของ"
          value={pickupDate ? dayjs(pickupDate) : null}
          onChange={(d) => setParam("pickupDate", d ? d.format("YYYY-MM-DD") : "")}
        />
      </Space>
      <OrdersTable params={{ status, pickupDate }} />
    </div>
  );
}
