"use client";

import { Button, Image, Modal, Popconfirm, Space, Table, Tag, Typography, App } from "antd";
import { useState } from "react";
import dayjs from "dayjs";
import { useOrderActions, useOrders } from "@/hooks";
import { slipUrl } from "@/lib/api/api-main";
import type { OrderListParams } from "@/services";
import type { Order } from "@/types/api/main";
import { SLOT_LABEL, STATUS_LABEL } from "./Orders.config";

interface OrdersTableProps {
  params: OrderListParams;
  compact?: boolean;
}

export default function OrdersTable({ params, compact }: OrdersTableProps) {
  const { data, isLoading } = useOrders(params);
  const { confirm, reject } = useOrderActions();
  const { message, modal } = App.useApp();
  const [slipOrder, setSlipOrder] = useState<Order | null>(null);

  const doConfirm = async (o: Order, force = false) => {
    try {
      await confirm.mutateAsync({ id: o.id, force });
      message.success(`ยืนยัน #${o.orderNo} แล้ว`);
    } catch (e: unknown) {
      const body = (e as { response?: { data?: { reason?: string; short?: string[] } } }).response?.data;
      if (body?.reason === "STOCK_SHORT") {
        modal.confirm({
          title: `สต็อกไม่พอสำหรับ #${o.orderNo}`,
          content: (
            <ul>
              {body.short?.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          ),
          okText: "ยืนยันโดยไม่ตัดสต็อก",
          cancelText: "ยกเลิก",
          onOk: () => doConfirm(o, true),
        });
      } else message.error("ยืนยันไม่สำเร็จ");
    }
  };

  const doReject = async (o: Order) => {
    let reason = "";
    modal.confirm({
      title: `ปฏิเสธออเดอร์ #${o.orderNo}?`,
      content: <input className="w-full rounded border p-2" placeholder="เหตุผล (ไม่บังคับ)" onChange={(e) => (reason = e.target.value)} />,
      okText: "ปฏิเสธ",
      okButtonProps: { danger: true },
      cancelText: "ยกเลิก",
      onOk: async () => {
        await reject.mutateAsync({ id: o.id, reason: reason || undefined });
        message.success(`ปฏิเสธ #${o.orderNo} แล้ว`);
      },
    });
  };

  return (
    <>
      <Table<Order>
        rowKey="id"
        size={compact ? "small" : "middle"}
        loading={isLoading}
        dataSource={data}
        pagination={compact ? false : { pageSize: 20 }}
        scroll={{ x: 900 }}
        columns={[
          { title: "#", dataIndex: "orderNo", width: 70, render: (n: number) => <b>#{n}</b> },
          {
            title: "ลูกค้า",
            render: (_, o) => (
              <>
                {o.user.displayName ?? "-"}
                <br />
                <Typography.Text type="secondary">{o.user.phone}</Typography.Text>
              </>
            ),
          },
          {
            title: "รายการ",
            render: (_, o) => o.items.map((i) => `${i.name}×${i.qty}`).join(", "),
          },
          {
            title: "รับของ",
            render: (_, o) => (
              <>
                {o.fulfillment === "DELIVERY" ? <Tag color="blue">ส่ง {o.distanceKm} กม.</Tag> : <Tag>รับเอง</Tag>}
                {o.pickupDate && (
                  <div>
                    {dayjs(o.pickupDate).format("D MMM")} {o.pickupSlot ? SLOT_LABEL[o.pickupSlot] : ""}
                  </div>
                )}
              </>
            ),
          },
          {
            title: "ยอด",
            dataIndex: "total",
            align: "right",
            render: (t: number, o) => (
              <>
                <b>{t}</b>
                {o.discount > 0 && <div className="text-xs text-green-600">คูปอง -{o.discount}</div>}
              </>
            ),
          },
          {
            title: "สถานะ",
            dataIndex: "status",
            render: (s: Order["status"]) => <Tag color={STATUS_LABEL[s].color}>{STATUS_LABEL[s].text}</Tag>,
          },
          {
            title: "สลิป",
            render: (_, o) =>
              o.slipPath ? (
                <Button size="small" onClick={() => setSlipOrder(o)}>
                  ดูสลิป
                </Button>
              ) : (
                "-"
              ),
          },
          {
            title: "",
            render: (_, o) =>
              o.status === "PENDING_CONFIRM" || o.status === "PENDING_PAYMENT" ? (
                <Space>
                  <Popconfirm title={`ยืนยัน #${o.orderNo}? (ตัดสต็อก)`} onConfirm={() => doConfirm(o)}>
                    <Button type="primary" size="small">
                      ยืนยัน
                    </Button>
                  </Popconfirm>
                  <Button danger size="small" onClick={() => doReject(o)}>
                    ปฏิเสธ
                  </Button>
                </Space>
              ) : null,
          },
        ]}
      />
      <Modal open={!!slipOrder} onCancel={() => setSlipOrder(null)} footer={null} title={`สลิปออเดอร์ #${slipOrder?.orderNo}`}>
        {slipOrder && <Image src={slipUrl(slipOrder.id)} alt="slip" className="w-full" />}
      </Modal>
    </>
  );
}
