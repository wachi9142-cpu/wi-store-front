"use client";

import { App, Button, Card, Form, Input, InputNumber, Space, Switch, Typography } from "antd";
import { useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useSetting, useUpdateSetting } from "@/hooks";
import type { Setting } from "@/types/api/main";

type SettingForm = Omit<Setting, "id">;

export default function SettingsContent() {
  const { data, isLoading } = useSetting();
  const save = useUpdateSetting();
  const { message } = App.useApp();
  const [form] = Form.useForm<SettingForm>();

  useEffect(() => {
    if (data) form.setFieldsValue(data);
  }, [data, form]);

  const submit = async (v: SettingForm) => {
    await save.mutateAsync({ ...v, deliveryTiers: [...(v.deliveryTiers ?? [])].sort((a, b) => a.maxKm - b.maxKm) });
    message.success("บันทึกแล้ว");
  };

  return (
    <div className="max-w-2xl space-y-4">
      <Typography.Title level={3} className="m-0!">
        ตั้งค่าร้าน
      </Typography.Title>
      <Card loading={isLoading}>
        <Form<SettingForm> form={form} layout="vertical" onFinish={submit}>
          <Form.Item name="isOpen" label="สถานะร้าน" valuePropName="checked" extra="ปิด = ลูกค้าสั่งไม่ได้ บอทตอบข้อความด้านล่าง (แม่พิมพ์ 'ปิดร้าน'/'เปิดร้าน' ใน LINE ได้เช่นกัน)">
            <Switch checkedChildren="เปิดร้าน" unCheckedChildren="ปิดชั่วคราว" />
          </Form.Item>
          <Form.Item name="closedMessage" label="ข้อความตอนปิดร้าน" rules={[{ required: true }]}>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="shopName" label="ชื่อร้าน" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="promptpayId" label="พร้อมเพย์ (เบอร์โทร / เลขบัตรประชาชน)" extra="ใช้สร้าง QR ให้ลูกค้าโอนตามยอด">
            <Input placeholder="08xxxxxxxx" />
          </Form.Item>

          <Typography.Title level={5}>ตำแหน่งร้าน (ใช้คำนวณระยะทางส่ง)</Typography.Title>
          <Space>
            <Form.Item name="shopLat" label="Latitude">
              <InputNumber step={0.000001} className="w-44!" />
            </Form.Item>
            <Form.Item name="shopLng" label="Longitude">
              <InputNumber step={0.000001} className="w-44!" />
            </Form.Item>
          </Space>
          <Typography.Paragraph type="secondary">เปิด Google Maps → คลิกขวาที่ร้าน → คัดลอกตัวเลขพิกัดมาใส่</Typography.Paragraph>

          <Typography.Title level={5}>ค่าส่งตามระยะทาง</Typography.Title>
          <Form.List name="deliveryTiers">
            {(fields, { add, remove }) => (
              <div className="space-y-2">
                {fields.map((f) => (
                  <Space key={f.key} align="baseline">
                    <span>ไม่เกิน</span>
                    <Form.Item name={[f.name, "maxKm"]} rules={[{ required: true }]} noStyle>
                      <InputNumber min={0.1} step={0.5} suffix="กม." />
                    </Form.Item>
                    <span>ค่าส่ง</span>
                    <Form.Item name={[f.name, "fee"]} rules={[{ required: true }]} noStyle>
                      <InputNumber min={0} suffix="บาท" />
                    </Form.Item>
                    <Button type="text" danger icon={<Trash2 size={14} />} onClick={() => remove(f.name)} />
                  </Space>
                ))}
                <Button icon={<Plus size={14} />} onClick={() => add({ maxKm: 5, fee: 50 })}>
                  เพิ่มช่วง
                </Button>
                <Typography.Paragraph type="secondary">เกินช่วงสุดท้าย = ไม่รับส่ง (บอทจะแนะนำให้รับเองหน้าร้าน)</Typography.Paragraph>
              </div>
            )}
          </Form.List>

          <Button type="primary" htmlType="submit" loading={save.isPending} className="mt-4">
            บันทึก
          </Button>
        </Form>
      </Card>
    </div>
  );
}
