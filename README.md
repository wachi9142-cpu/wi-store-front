# wi-store-front

หน้าเว็บแม่ค้า (แดชบอร์ด) — **Next.js 16 + React 19 + Ant Design 6 + React Query + NextAuth**
ใช้ดูสถานการณ์และจัดการข้อมูลหลัก ส่วนการรับออเดอร์ทั้งหมดอยู่ที่ LINE (wi-store-back)

## หน้าที่มี
- `/` ภาพรวม: รอตรวจสลิป, รอโอน, รับของวันนี้/พรุ่งนี้, ยอดยืนยันวันนี้, สถานะร้าน, สถานะบอท
- `/orders` ออเดอร์ (filter สถานะ/วันรับ, ดูสลิป, ยืนยัน/ปฏิเสธ)
- `/products` สินค้า ราคา หน่วย สต็อก + ประวัติสต็อก
- `/promotions` สร้าง/แก้โปรสะสม + รายการคูปอง
- `/customers` ลูกค้าที่ลงทะเบียน
- `/bot` สถานะบอท (event ล่าสุด, error ล่าสุด, log) — ไว้เช็ค dead bot
- `/settings` เปิด/ปิดร้าน, ข้อความตอนปิด, พร้อมเพย์, พิกัดร้าน, ช่วงค่าส่ง

## รันในเครื่อง

```bash
npm install
cp .env.example .env.local   # กรอก NEXTAUTH_SECRET
npm run dev                  # http://localhost:3016
```

ล็อกอินด้วย `ADMIN_PHONE` + `ADMIN_PASSWORD` ที่ตั้งไว้ใน back

## Environment variables
| ตัวแปร | ความหมาย |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL ของ back (dev: `http://localhost:4008`, prod: `https://wi-store.develyst.online`) |
| `NEXTAUTH_URL` | URL ของเว็บนี้ (prod: `https://wi-store.develyst.online`) |
| `NEXTAUTH_SECRET` | สตริงสุ่ม |

## Build (standalone)
```bash
npm run build     # ได้ .next/standalone + .next/static
```
