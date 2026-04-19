import SidebarButton from "@/app/admin/components/SidebarButton";
import LogoutButton from "@/app/admin/components/LogoutButton";
import UserProfileCard from "@/app/admin/components/UserProfileCard";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login?callbackUrl=/admin");

  return (
    <div className="flex h-full text-white">
      {session.user.role === "ADMIN" ? (
        <>
          <div className="h-full flex-[0_0_22%] border-r-2 border-white bg-neutral-700 flex flex-col justify-between items-start p-4 gap-4">
            <div className="flex flex-col justify-stretch items-stretch w-full gap-4">
              <UserProfileCard session={session} />
              <SidebarButton name="Dashboard" route="admin" />
              <SidebarButton name="Settings" route="admin/settings" />
            </div>
            <LogoutButton />
          </div>
          <div className="h-full flex-1 overflow-hidden">{children}</div>
        </>
      ) : (
        <div className="flex flex-col justify-center items-center w-full">
          <h1 className="text-xl">You do not have permission to view this page</h1>
          <Link href="/login?callbackUrl=/admin">
            <p className="underline">Click here to go to the login page.</p>
          </Link>
        </div>
      )}
    </div>
  );
}
