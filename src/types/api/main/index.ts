// สัญญาข้อมูลจาก back (Prisma models)

export type Role = "CUSTOMER" | "ADMIN";
export type OrderStatus = "DRAFT" | "PENDING_PAYMENT" | "PENDING_CONFIRM" | "CONFIRMED" | "REJECTED" | "CANCELLED";
export type Fulfillment = "PICKUP" | "DELIVERY";
export type PickupSlot = "MORNING" | "AFTERNOON" | "EVENING";
export type CouponStatus = "ACTIVE" | "USED";

export interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  stock: number;
  active: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface StockLog {
  id: string;
  productId: string;
  delta: number;
  after: number;
  reason: "ADD" | "SET" | "ORDER" | "REFUND" | "WEB";
  note: string | null;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  unitPrice: number;
  qty: number;
}

export interface OrderUser {
  id: string;
  displayName: string | null;
  phone: string | null;
  lineUserId: string;
}

export interface Order {
  id: string;
  orderNo: number;
  status: OrderStatus;
  items: OrderItem[];
  user: OrderUser;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  fulfillment: Fulfillment;
  pickupDate: string | null;
  pickupSlot: PickupSlot | null;
  deliveryAddress: string | null;
  distanceKm: number | null;
  slipPath: string | null;
  slipAt: string | null;
  confirmedAt: string | null;
  rejectedAt: string | null;
  rejectReason: string | null;
  stockDeducted: boolean;
  coupon: { code: string; amount: number } | null;
  createdAt: string;
}

export interface DeliveryTier {
  maxKm: number;
  fee: number;
}

export interface Setting {
  id: string;
  shopName: string;
  promptpayId: string | null;
  shopLat: number | null;
  shopLng: number | null;
  deliveryTiers: DeliveryTier[];
  isOpen: boolean;
  closedMessage: string;
}

export interface Promotion {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  targetQty: number;
  rewardAmount: number;
  productId: string | null;
  active: boolean;
  _count?: { coupons: number };
}

export interface Coupon {
  id: string;
  code: string;
  amount: number;
  status: CouponStatus;
  usedAt: string | null;
  usedNote: string | null;
  createdAt: string;
  user: { displayName: string | null; phone: string | null };
  promotion: { name: string };
}

export interface Stats {
  today: string;
  pendingConfirm: number;
  pendingPayment: number;
  todayPickup: number;
  tomorrowPickup: number;
  confirmedTodayCount: number;
  confirmedTodayTotal: number;
  isOpen: boolean;
  bot: { lastEventAt: string | null; lastError: { at: string; error: string | null } | null };
}

export interface BotLog {
  id: string;
  eventType: string;
  lineUserId: string | null;
  input: string | null;
  ok: boolean;
  error: string | null;
  durationMs: number | null;
  createdAt: string;
}

export interface AppUser {
  id: string;
  lineUserId: string;
  displayName: string | null;
  phone: string | null;
  role: Role;
  createdAt: string;
  _count: { orders: number; coupons: number };
}
