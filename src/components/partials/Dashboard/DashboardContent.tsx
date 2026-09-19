"use client";

import { Alert, Card, Col, Row, Statistic, Typography } from "antd";
import Link from "next/link";
import { useStats } from "@/hooks";
import { relative } from "@/components/layout/AdminLayout";
import { OrdersTable } from "@/components/partials/Orders";

export default function DashboardContent() {
  const { data: s, isLoading } = useStats();

  return (
    <div className="space-y-6">
      <Typography.Title level={3} className="m-0!">
        ภาพรวมวันนี้ {s?.today}
      </Typography.Title>

      {s && !s.isOpen && <Alert type="warning" showIcon title="ร้านปิดชั่วคราวอยู่ — ลูกค้าสั่งไม่ได้" action={<Link href="/settings">เปิดร้าน</Link>} />}
      {s?.bot.lastError && (
        <Alert
          type="error"
          showIcon
          title={`บอทมี error ล่าสุด ${relative(s.bot.lastError.at)}`}
          description={<pre className="max-h-32 overflow-auto text-xs">{s.bot.lastError.error}</pre>}
          action={<Link href="/bot">ดู log</Link>}
        />
      )}

      <Row gutter={[16, 16]}>
        <Col xs={12} md={6}>
          <Card loading={isLoading}>
            <Link href="/orders?status=PENDING_CONFIRM">
              <Statistic title="รอตรวจสลิป" value={s?.pendingConfirm ?? 0} styles={{ content: { color: s?.pendingConfirm ? "#cf1322" : undefined } }} />
            </Link>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card loading={isLoading}>
            <Statistic title="รอลูกค้าโอน" value={s?.pendingPayment ?? 0} />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card loading={isLoading}>
            <Statistic title="รับของวันนี้ / พรุ่งนี้" value={`${s?.todayPickup ?? 0} / ${s?.tomorrowPickup ?? 0}`} />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card loading={isLoading}>
            <Statistic title="ยอดยืนยันวันนี้" value={s?.confirmedTodayTotal ?? 0} suffix="บาท" />
            <Typography.Text type="secondary">{s?.confirmedTodayCount ?? 0} ออเดอร์</Typography.Text>
          </Card>
        </Col>
      </Row>

      <Card title="ออเดอร์รอตรวจสลิป">
        <OrdersTable params={{ status: "PENDING_CONFIRM" }} compact />
      </Card>
    </div>
  );
}
