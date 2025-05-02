import { Code, ImageIcon, MessageSquare } from "lucide-react";

export const tools = [
  {
    label: "Conversation",
    href: "/conversation",
    icon: MessageSquare,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  {
    label: "Code Generation",
    href: "/code",
    icon: Code,
    color: "text-green-700",
    bgColor: "bg-green-700/10",
  },
  {
    label: "Image Generation",
    href: "/image",
    icon: ImageIcon,
    color: "text-pink-700",
    bgColor: "bg-pink-700/10",
  },
];
