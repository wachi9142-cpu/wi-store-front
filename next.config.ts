import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["antd", "@ant-design/nextjs-registry"],
};

export default nextConfig;
