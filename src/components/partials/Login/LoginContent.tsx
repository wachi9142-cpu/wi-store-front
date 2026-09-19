"use client";

import { Alert, Button, Card, Form, Input, Typography } from "antd";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface LoginFormValues {
  phone: string;
  password: string;
}

export default function LoginContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFinish = async (v: LoginFormValues) => {
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", { ...v, redirect: false });
    setLoading(false);
    if (res?.ok) router.replace(params.get("callbackUrl") ?? "/");
    else setError("เบอร์หรือรหัสผ่านไม่ถูกต้อง");
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <Typography.Title level={3} className="text-center">
          🌿 WI Store
        </Typography.Title>
        <Typography.Paragraph type="secondary" className="text-center">
          เข้าสู่ระบบแม่ค้า
        </Typography.Paragraph>
        {error && <Alert type="error" title={error} className="mb-4" />}
        <Form<LoginFormValues> layout="vertical" onFinish={onFinish}>
          <Form.Item name="phone" label="เบอร์โทร" rules={[{ required: true, message: "กรอกเบอร์โทร" }]}>
            <Input inputMode="tel" placeholder="08xxxxxxxx" size="large" />
          </Form.Item>
          <Form.Item name="password" label="รหัสผ่าน" rules={[{ required: true, message: "กรอกรหัสผ่าน" }]}>
            <Input.Password size="large" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block size="large" loading={loading}>
            เข้าสู่ระบบ
          </Button>
        </Form>
      </Card>
    </div>
  );
}
