import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import SitePreloader from "@/components/site-preloader";
import "./globals.css";

const publicName = "Giải pháp của Ecom’s Diary";
const description = "Một việc kinh doanh có thể có nhiều hướng giải và nhiều cách phối hợp nguồn lực. Bắt đầu bằng việc bạn đang muốn giải quyết.";

export const metadata: Metadata = {
  title: publicName,
  description,
  robots: {
    index: false,
    follow: false,
    noarchive: true,
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    title: publicName,
    description: "Một việc kinh doanh. Nhiều cách ghép team.",
    siteName: publicName,
  },
};

export const viewport: Viewport = {
  themeColor: "#f6f3ec",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <SitePreloader />
        {children}
      </body>
    </html>
  );
}
