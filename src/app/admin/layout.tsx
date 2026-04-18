"use client";

import SidebarButton from "@/app/admin/components/SidebarButton";
import LogoutButton from "@/app/admin/components/LogoutButton";
import UserProfileCard from "@/app/admin/components/UserProfileCard";
import { useSession } from "next-auth/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-full text-white">
      <div className="h-full flex-1 border-r-2 border-white bg-neutral-700 flex flex-col justify-between items-start p-4 gap-4">
        <div className="flex flex-col justify-stretch items-stretch w-full gap-4">
          <UserProfileCard useSession={useSession} />
          <SidebarButton name="Dashboard" route="admin" />
          <SidebarButton name="Settings" route="admin/settings" />
        </div>
        <LogoutButton />
      </div>
      <div className="h-full flex-3">{children}</div>
    </div>
  );
}
