import { Bot, Gift, LayoutDashboard, Package, Receipt, Settings, Users } from "lucide-react";

export const MENU_ITEMS = [
  { key: "/", label: "ภาพรวม", icon: LayoutDashboard },
  { key: "/orders", label: "ออเดอร์", icon: Receipt },
  { key: "/products", label: "สินค้า & สต็อก", icon: Package },
  { key: "/promotions", label: "โปรโมชั่น & คูปอง", icon: Gift },
  { key: "/customers", label: "ลูกค้า", icon: Users },
  { key: "/bot", label: "สถานะบอท", icon: Bot },
  { key: "/settings", label: "ตั้งค่าร้าน", icon: Settings },
];
