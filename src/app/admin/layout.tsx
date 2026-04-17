import type { Metadata } from "next";
import SidebarButton from "./components/SidebarButton";

export const metadata: Metadata = {
  title: "Admin | Digital Work Order System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-full">
      <div className="h-full flex-1 border-r-2 border-white bg-neutral-700 flex flex-col justify-start items-start p-4 gap-4">
        <SidebarButton name="Dashboard" route="admin" />
        <SidebarButton name="Settings" route="admin/settings" />
      </div>
      <div className="h-full flex-3">{children}</div>
    </div>
  );
}
