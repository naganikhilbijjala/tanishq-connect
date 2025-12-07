"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, User, Mail } from "lucide-react";

const actions = [
  {
    href: "/interactions/new?type=phone_call",
    icon: Phone,
    label: "New Phone Call",
    color: "bg-blue-500 hover:bg-blue-600",
  },
  {
    href: "/interactions/new?type=walk_in",
    icon: User,
    label: "New Walk-In",
    color: "bg-green-500 hover:bg-green-600",
  },
  {
    href: "/interactions/new?type=whatsapp",
    icon: MessageCircle,
    label: "New WhatsApp",
    color: "bg-emerald-500 hover:bg-emerald-600",
  },
  {
    href: "/interactions/new?type=email",
    icon: Mail,
    label: "New Email",
    color: "bg-purple-500 hover:bg-purple-600",
  },
];

export function QuickActions() {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-700">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Link key={action.href} href={action.href}>
            <Button
              className={`w-full h-16 text-white ${action.color} flex flex-col items-center justify-center gap-1`}
            >
              <action.icon className="h-6 w-6" />
              <span className="text-sm font-medium">{action.label}</span>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
