"use client";

import { Table, Tag, Typography } from "antd";
import dayjs from "dayjs";
import { useUsers } from "@/hooks";
import type { AppUser } from "@/types/api/main";

export default function CustomersContent() {
  const { data, isLoading } = useUsers();
  return (
    <div className="space-y-4">
      <Typography.Title level={3} className="m-0!">
        ลูกค้า
      </Typography.Title>
      <Table<AppUser>
        rowKey="id"
        loading={isLoading}
        dataSource={data}
        pagination={{ pageSize: 30 }}
        columns={[
          { title: "ชื่อ LINE", dataIndex: "displayName", render: (n: string | null) => n ?? "-" },
          { title: "เบอร์", dataIndex: "phone", render: (p: string | null) => p ?? <Tag color="orange">ยังไม่ลงทะเบียน</Tag> },
          { title: "บทบาท", dataIndex: "role", render: (r: AppUser["role"]) => (r === "ADMIN" ? <Tag color="purple">แม่ค้า</Tag> : <Tag>ลูกค้า</Tag>) },
          { title: "ออเดอร์", render: (_, u) => u._count.orders, align: "right" },
          { title: "คูปอง", render: (_, u) => u._count.coupons, align: "right" },
          { title: "เพิ่มเพื่อนเมื่อ", dataIndex: "createdAt", render: (d: string) => dayjs(d).format("D/M/YY") },
        ]}
      />
    </div>
  );
}
