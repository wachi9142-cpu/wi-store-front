import type { OrderStatus, PickupSlot } from "@/types/api/main";

export const SLOT_LABEL: Record<PickupSlot, string> = { MORNING: "เช้า", AFTERNOON: "บ่าย", EVENING: "เย็น" };

export const STATUS_LABEL: Record<OrderStatus, { text: string; color: string }> = {
  DRAFT: { text: "กำลังสั่ง", color: "default" },
  PENDING_PAYMENT: { text: "รอโอน", color: "gold" },
  PENDING_CONFIRM: { text: "รอตรวจสลิป", color: "red" },
  CONFIRMED: { text: "ยืนยันแล้ว", color: "green" },
  REJECTED: { text: "ปฏิเสธ", color: "volcano" },
  CANCELLED: { text: "ยกเลิก", color: "default" },
};

export const STATUS_FILTERS = [
  { label: "ทั้งหมด", value: "" },
  { label: "รอตรวจสลิป", value: "PENDING_CONFIRM" },
  { label: "รอโอน", value: "PENDING_PAYMENT" },
  { label: "ยืนยันแล้ว", value: "CONFIRMED" },
  { label: "ปฏิเสธ", value: "REJECTED" },
];
