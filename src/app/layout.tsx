import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/app/Providers";

export const metadata: Metadata = {
  title: "Digital Work Order System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="h-dvh w-full bg-neutral-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
