"use client";

import { Layout, Menu, Button, Tag, Typography } from "antd";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { useStats } from "@/hooks";
import { MENU_ITEMS } from "./AdminLayout.config";

const { Sider, Header, Content } = Layout;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: stats } = useStats();
  const selected = MENU_ITEMS.find((m) => pathname === m.key || (m.key !== "/" && pathname.startsWith(m.key)))?.key ?? "/";

  return (
    <Layout className="min-h-screen">
      <Sider breakpoint="lg" collapsedWidth={0} theme="light" width={220}>
        <div className="px-4 py-4">
          <Typography.Title level={4} className="m-0!">
            🌿 WI Store
          </Typography.Title>
          <Typography.Text type="secondary">แดชบอร์ดแม่ค้า</Typography.Text>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selected]}
          items={MENU_ITEMS.map((m) => ({
            key: m.key,
            icon: <m.icon size={16} />,
            label: (
              <Link href={m.key}>
                {m.label}
                {m.key === "/orders" && stats?.pendingConfirm ? (
                  <Tag color="red" className="ml-2!">
                    {stats.pendingConfirm}
                  </Tag>
                ) : null}
              </Link>
            ),
          }))}
        />
      </Sider>
      <Layout>
        <Header className="flex! items-center justify-between bg-white! px-6!">
          <div className="flex items-center gap-3">
            {stats && (
              <>
                <Tag color={stats.isOpen ? "green" : "red"}>{stats.isOpen ? "ร้านเปิด" : "ร้านปิดชั่วคราว"}</Tag>
                <Tag color={botAlive(stats.bot.lastEventAt) ? "green" : "orange"}>
                  บอท: {stats.bot.lastEventAt ? `ล่าสุด ${relative(stats.bot.lastEventAt)}` : "ยังไม่มี event"}
                </Tag>
                {stats.bot.lastError && <Tag color="red">มี error ล่าสุด {relative(stats.bot.lastError.at)}</Tag>}
              </>
            )}
          </div>
          <Button icon={<LogOut size={14} />} onClick={() => signOut({ callbackUrl: "/login" })}>
            ออกจากระบบ
          </Button>
        </Header>
        <Content className="p-6">{children}</Content>
      </Layout>
    </Layout>
  );
}

/** ถือว่าบอท "ยังมีชีวิต" ถ้ามี event ภายใน 24 ชม. */
function botAlive(iso: string | null) {
  return !!iso && Date.now() - new Date(iso).getTime() < 24 * 3600_000;
}

export function relative(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return `${s} วิ.ที่แล้ว`;
  if (s < 3600) return `${Math.floor(s / 60)} นาทีที่แล้ว`;
  if (s < 86400) return `${Math.floor(s / 3600)} ชม.ที่แล้ว`;
  return `${Math.floor(s / 86400)} วันที่แล้ว`;
}
