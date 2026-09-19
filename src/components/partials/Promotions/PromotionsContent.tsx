"use client";

import { App, Button, Card, DatePicker, Form, Input, InputNumber, Modal, Select, Switch, Table, Tag, Typography } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useCoupons, useProducts, usePromotionActions, usePromotions } from "@/hooks";
import type { PromotionFormValues } from "@/services";
import type { Coupon, Promotion } from "@/types/api/main";

interface PromoForm extends Omit<PromotionFormValues, "startDate" | "endDate"> {
  range: [Dayjs, Dayjs];
}

export default function PromotionsContent() {
  const { data: promos, isLoading } = usePromotions();
  const { data: coupons } = useCoupons();
  const { data: products } = useProducts();
  const { create, update } = usePromotionActions();
  const { message } = App.useApp();
  const [editing, setEditing] = useState<Promotion | null | "new">(null);
  const [form] = Form.useForm<PromoForm>();

  const open = (p: Promotion | "new") => {
    setEditing(p);
    if (p === "new") form.setFieldsValue({ name: "", targetQty: 200, rewardAmount: 20, productId: null, active: true, range: [dayjs(), dayjs().add(1, "month")] });
    else form.setFieldsValue({ ...p, range: [dayjs(p.startDate), dayjs(p.endDate)] });
  };

  const submit = async ({ range, ...rest }: PromoForm) => {
    const v: PromotionFormValues = { ...rest, startDate: range[0].format("YYYY-MM-DD"), endDate: range[1].format("YYYY-MM-DD") };
    if (editing && editing !== "new") await update.mutateAsync({ id: editing.id, v });
    else await create.mutateAsync(v);
    message.success("บันทึกโปรแล้ว");
    setEditing(null);
  };

  const today = dayjs().format("YYYY-MM-DD");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Typography.Title level={3} className="m-0!">
          โปรโมชั่น & คูปอง
        </Typography.Title>
        <Button type="primary" icon={<Plus size={14} />} onClick={() => open("new")}>
          สร้างโปร
        </Button>
      </div>

      <Table<Promotion>
        rowKey="id"
        loading={isLoading}
        dataSource={promos}
        pagination={false}
        columns={[
          { title: "ชื่อ", dataIndex: "name" },
          { title: "ช่วงวัน", render: (_, p) => `${p.startDate} → ${p.endDate}` },
          { title: "เงื่อนไข", render: (_, p) => `ซื้อครบ ${p.targetQty} ${p.productId ? `(${products?.find((x) => x.id === p.productId)?.name ?? "สินค้าเฉพาะ"})` : "ชิ้น (ทุกสินค้า)"} → คูปอง ${p.rewardAmount} บาท` },
          { title: "ออกแล้ว", render: (_, p) => `${p._count?.coupons ?? 0} ใบ` },
          {
            title: "สถานะ",
            render: (_, p) => {
              if (!p.active) return <Tag>ปิด</Tag>;
              if (p.startDate <= today && today <= p.endDate) return <Tag color="green">กำลังจัด</Tag>;
              return <Tag color={p.startDate > today ? "blue" : "default"}>{p.startDate > today ? "ยังไม่เริ่ม" : "จบแล้ว"}</Tag>;
            },
          },
          {
            title: "",
            render: (_, p) => (
              <Button size="small" onClick={() => open(p)}>
                แก้ไข
              </Button>
            ),
          },
        ]}
      />

      <Card title="คูปองล่าสุด">
        <Table<Coupon>
          rowKey="id"
          size="small"
          dataSource={coupons}
          pagination={{ pageSize: 20 }}
          columns={[
            { title: "โค้ด", dataIndex: "code", render: (c: string) => <b>{c}</b> },
            { title: "ลูกค้า", render: (_, c) => `${c.user.displayName ?? ""} ${c.user.phone ?? ""}` },
            { title: "มูลค่า", dataIndex: "amount", render: (a: number) => `${a} บาท` },
            { title: "โปร", render: (_, c) => c.promotion.name },
            { title: "สถานะ", render: (_, c) => (c.status === "USED" ? <Tag>ใช้แล้ว {c.usedNote ? `(${c.usedNote})` : ""}</Tag> : <Tag color="green">ใช้ได้</Tag>) },
            { title: "ออกเมื่อ", dataIndex: "createdAt", render: (d: string) => dayjs(d).format("D/M/YY HH:mm") },
          ]}
        />
      </Card>

      <Modal open={!!editing} onCancel={() => setEditing(null)} onOk={() => form.submit()} title={editing === "new" ? "สร้างโปรโมชั่น" : "แก้ไขโปรโมชั่น"} okText="บันทึก" cancelText="ยกเลิก">
        <Form<PromoForm> form={form} layout="vertical" onFinish={submit}>
          <Form.Item name="name" label="ชื่อโปร" rules={[{ required: true }]}>
            <Input placeholder="โปรเดือนกันยา" />
          </Form.Item>
          <Form.Item name="range" label="ช่วงวันที่จัด" rules={[{ required: true }]}>
            <DatePicker.RangePicker className="w-full" format="D MMM YYYY" />
          </Form.Item>
          <Form.Item name="targetQty" label="ซื้อครบกี่ชิ้น (สะสมต่อเบอร์ลูกค้า)" rules={[{ required: true }]}>
            <InputNumber min={1} className="w-full" />
          </Form.Item>
          <Form.Item name="rewardAmount" label="ได้คูปองส่วนลดกี่บาท" rules={[{ required: true }]}>
            <InputNumber min={1} className="w-full" />
          </Form.Item>
          <Form.Item name="productId" label="นับเฉพาะสินค้า (เว้นว่าง = ทุกสินค้า)">
            <Select allowClear options={products?.map((p) => ({ value: p.id, label: p.name }))} placeholder="ทุกสินค้า" />
          </Form.Item>
          <Form.Item name="active" label="เปิดใช้งาน" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
