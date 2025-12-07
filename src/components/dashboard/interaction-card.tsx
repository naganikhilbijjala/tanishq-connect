"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Phone,
  MessageCircle,
  User,
  Mail,
  Share2,
  PhoneCall,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import type { InteractionStatus, InteractionType } from "@/types";

interface InteractionCardProps {
  interaction: {
    id: number;
    customerName: string | null;
    customerPhone: string | null;
    type: InteractionType;
    status: InteractionStatus;
    requirement: string;
    assignedToName?: string | null;
    createdAt: Date | string;
  };
  onStatusChange?: () => void;
}

const typeIcons: Record<InteractionType, typeof Phone> = {
  phone_call: Phone,
  whatsapp: MessageCircle,
  walk_in: User,
  email: Mail,
  social_media: Share2,
};

const typeLabels: Record<InteractionType, string> = {
  phone_call: "Phone",
  whatsapp: "WhatsApp",
  walk_in: "Walk-In",
  email: "Email",
  social_media: "Social",
};

const statusColors: Record<InteractionStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
};

export function InteractionCard({
  interaction,
  onStatusChange,
}: InteractionCardProps) {
  const [updating, setUpdating] = useState(false);
  const Icon = typeIcons[interaction.type];

  const handleStatusChange = async (newStatus: InteractionStatus) => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/interactions/${interaction.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success("Status updated");
        onStatusChange?.();
      } else {
        toast.error("Failed to update status");
      }
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const createdAt =
    typeof interaction.createdAt === "string"
      ? new Date(interaction.createdAt)
      : interaction.createdAt;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="p-2 bg-amber-100 rounded-full shrink-0">
              <Icon className="h-5 w-5 text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">
                  {typeLabels[interaction.type]}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(createdAt, { addSuffix: true })}
                </span>
              </div>
              <Link href={`/interactions/${interaction.id}`}>
                <p className="font-medium text-gray-900 truncate hover:text-amber-600">
                  {interaction.customerName || "Unknown Customer"}
                </p>
              </Link>
              <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                {interaction.requirement}
              </p>
              {interaction.assignedToName && (
                <p className="text-xs text-muted-foreground mt-1">
                  Assigned to: {interaction.assignedToName}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <Select
              value={interaction.status}
              onValueChange={(value) =>
                handleStatusChange(value as InteractionStatus)
              }
              disabled={updating}
            >
              <SelectTrigger className="w-[120px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            {interaction.customerPhone && (
              <a href={`tel:${interaction.customerPhone}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                >
                  <PhoneCall className="h-4 w-4" />
                  Call
                </Button>
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
