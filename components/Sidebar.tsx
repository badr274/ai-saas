"use client";
import { cn } from "@/lib/utils";
import {
  Code,
  ImageIcon,
  LayoutDashboard,
  MessagesSquare,
  Settings,
} from "lucide-react";
import { Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import FreeCounter from "./FreeCounter";

const montserrat = Montserrat({
  weight: "600",
  subsets: ["latin"],
});

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Conversation",
    icon: MessagesSquare,
    href: "/conversation",
    color: "text-violet-500",
  },
  {
    label: "Image Generation",
    icon: ImageIcon,
    href: "/image",
    color: "text-pink-700",
  },
  {
    label: "Code Generation",
    icon: Code,
    href: "/code",
    color: "text-green-700",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

interface SidebarProps {
  apiLimitCount: number;
  isPro: boolean;
}

const Sidebar = ({ apiLimitCount, isPro = false }: SidebarProps) => {
  const pathname = usePathname();
  const renderSidebarRoutes = routes.map((route) => {
    const { label, href, icon: Icon, color } = route;
    return (
      <Link
        href={href}
        key={href}
        className={cn(
          "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
          pathname == href ? "bg-white/10 text-white" : "text-zinc-400"
        )}
      >
        <div className="flex items-center flex-1">
          <Icon className={cn("h-5 w-5 mr-3", color)} />
          {label}
        </div>
      </Link>
    );
  });
  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <div className="relative w-8 h-8 mr-4">
            <Image fill src="/logo.png" alt="Logo" />
          </div>
          <h1 className={cn("text-2xl font-bold", montserrat.className)}>
            NyroAI
          </h1>
        </Link>
        <div className="space-y-1">{renderSidebarRoutes}</div>
      </div>
      <FreeCounter apiLimitCount={apiLimitCount} isPro={isPro} />
    </div>
  );
};

export default Sidebar;
