import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import thTH from "antd/locale/th_TH";
import { AppProviders } from "@/context/AppProviders";
import "./globals.css";

export const metadata = { title: "WI Store Admin" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>
        <AntdRegistry>
          <ConfigProvider locale={thTH} theme={{ token: { colorPrimary: "#2f9e44", borderRadius: 8 } }}>
            <AppProviders>{children}</AppProviders>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
