"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SidebarButton = ({ name, route }: { name: string; route: string }) => {
  const pathname = usePathname();

  return (
    <Link href={`/${route}`} className="w-full">
      <button
        className={`text-xl w-full py-4 cursor-pointer text-white rounded-sm ${pathname === `/${route}` ? "bg-neutral-800" : "bg-neutral-900"}`}
      >
        {name}
      </button>
    </Link>
  );
};

export default SidebarButton;
