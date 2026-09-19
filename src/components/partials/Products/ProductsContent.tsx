"use client";

import { App, Button, Drawer, Form, Input, InputNumber, Modal, Popconfirm, Space, Switch, Table, Tag, Typography } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useProductActions, useProducts, useStockLogs } from "@/hooks";
import type { ProductFormValues } from "@/services";
import type { Product } from "@/types/api/main";
import { STOCK_REASON_LABEL } from "./Products.config";

type ModalMode = "create" | "edit";

export default function ProductsContent() {
  const { data, isLoading } = useProducts();
  const { create, update, setStock, remove } = useProductActions();
  const { message } = App.useApp();
  const [modal, setModal] = useState<{ mode: ModalMode; product?: Product } | null>(null);
  const [logsFor, setLogsFor] = useState<Product | null>(null);
  const { data: logs } = useStockLogs(logsFor?.id ?? null);
  const [form] = Form.useForm<ProductFormValues>();

  const openModal = (mode: ModalMode, product?: Product) => {
    setModal({ mode, product });
    form.setFieldsValue(product ? { name: product.name, price: product.price, unit: product.unit, active: product.active, sortOrder: product.sortOrder } : { name: "", price: 0, unit: "ขวด", active: true, sortOrder: 0 });
  };

  const submit = async (v: ProductFormValues) => {
    try {
      if (modal?.mode === "edit" && modal.product) await update.mutateAsync({ id: modal.product.id, v });
      else await create.mutateAsync(v);
      message.success("บันทึกแล้ว");
      setModal(null);
    } catch {
      message.error("บันทึกไม่สำเร็จ (ชื่อซ้ำ?)");
    }
  };

  const editStock = (p: Product) => {
    let value = p.stock;
    Modal.confirm({
      title: `ตั้งสต็อก ${p.name}`,
      content: <InputNumber defaultValue={p.stock} min={0} className="w-full" onChange={(n) => (value = Number(n ?? 0))} />,
      onOk: async () => {
        await setStock.mutateAsync({ id: p.id, stock: value });
        message.success("อัปเดตสต็อกแล้ว");
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Typography.Title level={3} className="m-0!">
          สินค้า & สต็อก
        </Typography.Title>
        <Button type="primary" icon={<Plus size={14} />} onClick={() => openModal("create")}>
          เพิ่มสินค้า
        </Button>
      </div>
      <Typography.Text type="secondary">แม่เพิ่มสต็อกผ่าน LINE ได้ด้วยการพิมพ์ เช่น &quot;เก็กฮวย 30&quot; — หน้านี้ไว้แก้ชื่อ/ราคา และดูประวัติ</Typography.Text>

      <Table<Product>
        rowKey="id"
        loading={isLoading}
        dataSource={data}
        pagination={false}
        columns={[
          { title: "ชื่อ", dataIndex: "name", render: (n: string, p) => (p.active ? n : <Typography.Text delete>{n}</Typography.Text>) },
          { title: "ราคา", dataIndex: "price", align: "right", render: (v: number, p) => `${v} บาท/${p.unit}` },
          {
            title: "สต็อก",
            dataIndex: "stock",
            align: "right",
            render: (s: number, p) => (
              <Space>
                <Tag color={s > 0 ? "green" : "red"}>{s}</Tag>
                <Button size="small" onClick={() => editStock(p)}>
                  แก้
                </Button>
                <Button size="small" type="link" onClick={() => setLogsFor(p)}>
                  ประวัติ
                </Button>
              </Space>
            ),
          },
          { title: "ขาย", dataIndex: "active", render: (a: boolean, p) => <Switch checked={a} onChange={(v) => update.mutate({ id: p.id, v: { active: v } })} /> },
          { title: "ลำดับ", dataIndex: "sortOrder", width: 80 },
          {
            title: "",
            render: (_, p) => (
              <Space>
                <Button size="small" onClick={() => openModal("edit", p)}>
                  แก้ไข
                </Button>
                <Popconfirm title="ปิดขายสินค้านี้?" onConfirm={() => remove.mutate(p.id)}>
                  <Button size="small" danger>
                    ลบ
                  </Button>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />

      <Modal open={!!modal} onCancel={() => setModal(null)} onOk={() => form.submit()} title={modal?.mode === "edit" ? "แก้ไขสินค้า" : "เพิ่มสินค้า"} okText="บันทึก" cancelText="ยกเลิก">
        <Form<ProductFormValues> form={form} layout="vertical" onFinish={submit}>
          <Form.Item name="name" label="ชื่อ" rules={[{ required: true }]}>
            <Input placeholder="น้ำเก็กฮวย" />
          </Form.Item>
          <Form.Item name="price" label="ราคา (บาท)" rules={[{ required: true }]}>
            <InputNumber min={0} className="w-full" />
          </Form.Item>
          <Form.Item name="unit" label="หน่วย" rules={[{ required: true }]}>
            <Input placeholder="ขวด / แก้ว" />
          </Form.Item>
          <Form.Item name="sortOrder" label="ลำดับแสดง">
            <InputNumber className="w-full" />
          </Form.Item>
          <Form.Item name="active" label="เปิดขาย" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      <Drawer open={!!logsFor} onClose={() => setLogsFor(null)} title={`ประวัติสต็อก ${logsFor?.name ?? ""}`} size="default">
        <Table
          rowKey="id"
          size="small"
          dataSource={logs}
          pagination={false}
          columns={[
            { title: "เวลา", dataIndex: "createdAt", render: (d: string) => dayjs(d).format("D/M HH:mm") },
            { title: "±", dataIndex: "delta", align: "right", render: (d: number) => <span className={d < 0 ? "text-red-600" : "text-green-600"}>{d > 0 ? `+${d}` : d}</span> },
            { title: "เหลือ", dataIndex: "after", align: "right" },
            { title: "เหตุ", dataIndex: "reason", render: (r: keyof typeof STOCK_REASON_LABEL, l) => `${STOCK_REASON_LABEL[r]}${l.note ? ` — ${l.note}` : ""}` },
          ]}
        />
      </Drawer>
    </div>
  );
}
