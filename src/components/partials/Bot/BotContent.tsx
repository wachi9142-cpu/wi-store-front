"use client";

import { Alert, Card, Descriptions, Switch, Table, Tag, Typography } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { useBotLogs, useStats } from "@/hooks";
import { relative } from "@/components/layout/AdminLayout";
import type { BotLog } from "@/types/api/main";

const WEBHOOK_URL = `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4008"}/api/line/webhook`;

export default function BotContent() {
  const [onlyErrors, setOnlyErrors] = useState(false);
  const { data: logs, isLoading } = useBotLogs(onlyErrors);
  const { data: stats } = useStats();
  const alive = stats?.bot.lastEventAt && Date.now() - new Date(stats.bot.lastEventAt).getTime() < 24 * 3600_000;

  return (
    <div className="space-y-4">
      <Typography.Title level={3} className="m-0!">
        สถานะบอท
      </Typography.Title>

      {stats && (
        <Alert
          type={stats.bot.lastError && Date.now() - new Date(stats.bot.lastError.at).getTime() < 3600_000 ? "error" : alive ? "success" : "warning"}
          showIcon
          title={alive ? "บอทรับ event จาก LINE ได้ปกติ" : "ไม่มี event จาก LINE นานเกิน 24 ชม. — ตรวจ Webhook URL ใน LINE Developers Console"}
        />
      )}

      <Card>
        <Descriptions column={1} size="small">
          <Descriptions.Item label="Webhook URL">{WEBHOOK_URL}</Descriptions.Item>
          <Descriptions.Item label="event ล่าสุด">{stats?.bot.lastEventAt ? `${relative(stats.bot.lastEventAt)} (${dayjs(stats.bot.lastEventAt).format("D/M HH:mm:ss")})` : "-"}</Descriptions.Item>
          <Descriptions.Item label="error ล่าสุด">
            {stats?.bot.lastError ? (
              <>
                {relative(stats.bot.lastError.at)}
                <pre className="mt-1 max-h-40 overflow-auto rounded bg-red-50 p-2 text-xs">{stats.bot.lastError.error}</pre>
              </>
            ) : (
              "ไม่มี"
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card
        title="Log ล่าสุด"
        extra={
          <span>
            เฉพาะ error <Switch checked={onlyErrors} onChange={setOnlyErrors} />
          </span>
        }
      >
        <Table<BotLog>
          rowKey="id"
          size="small"
          loading={isLoading}
          dataSource={logs}
          pagination={{ pageSize: 50 }}
          columns={[
            { title: "เวลา", dataIndex: "createdAt", width: 130, render: (d: string) => dayjs(d).format("D/M HH:mm:ss") },
            { title: "event", dataIndex: "eventType", width: 130 },
            { title: "user", dataIndex: "lineUserId", width: 120, ellipsis: true },
            { title: "ข้อความ", dataIndex: "input", ellipsis: true },
            { title: "ms", dataIndex: "durationMs", width: 70, align: "right" },
            { title: "ผล", dataIndex: "ok", width: 80, render: (ok: boolean) => (ok ? <Tag color="green">ok</Tag> : <Tag color="red">error</Tag>) },
          ]}
          expandable={{ rowExpandable: (l) => !!l.error, expandedRowRender: (l) => <pre className="text-xs whitespace-pre-wrap">{l.error}</pre> }}
        />
      </Card>
    </div>
  );
}
