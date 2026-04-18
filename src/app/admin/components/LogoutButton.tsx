"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/login",
      redirect: true,
    });
  };

  return (
    <button onClick={handleLogout} className="bg-neutral-800 rounded-sm px-4 py-2 text-white w-full cursor-pointer">
      Log Out
    </button>
  );
}
