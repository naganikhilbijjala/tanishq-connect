"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, MessageCircle, User, Mail, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useCurrentRSO } from "@/hooks/use-current-rso";
import { INTERACTION_TYPES } from "@/lib/constants";
import type { InteractionType, InteractionStatus, RSO } from "@/types";
import Link from "next/link";

const typeIcons: Record<string, typeof Phone> = {
  phone_call: Phone,
  whatsapp: MessageCircle,
  walk_in: User,
  email: Mail,
  social_media: Share2,
};

interface InteractionFormProps {
  initialData?: {
    id?: number;
    customerName?: string;
    customerPhone?: string;
    type: InteractionType;
    status: InteractionStatus;
    requirement: string;
    requirementTags?: string | null;
    notes?: string;
    assignedToId?: number;
  };
  mode?: "create" | "edit";
}

export function InteractionForm({
  initialData,
  mode = "create",
}: InteractionFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentRSOId } = useCurrentRSO();

  const [rsos, setRsos] = useState<RSO[]>([]);
  const [loading, setLoading] = useState(false);

  // Form state
  const [type, setType] = useState<InteractionType>(
    (searchParams.get("type") as InteractionType) ||
      initialData?.type ||
      "phone_call"
  );
  const [customerName, setCustomerName] = useState(
    initialData?.customerName || ""
  );
  const [customerPhone, setCustomerPhone] = useState(
    initialData?.customerPhone || ""
  );
  const [requirement, setRequirement] = useState(initialData?.requirement || "");
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [status, setStatus] = useState<InteractionStatus>(
    initialData?.status || "pending"
  );
  const [assignedToId, setAssignedToId] = useState<string>(
    initialData?.assignedToId?.toString() || currentRSOId?.toString() || ""
  );

  useEffect(() => {
    const fetchRsos = async () => {
      try {
        const response = await fetch("/api/rsos");
        const data = await response.json();
        setRsos(data.data || []);
      } catch (error) {
        console.error("Error fetching RSOs:", error);
      }
    };
    fetchRsos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!requirement.trim()) {
      toast.error("Please describe what the customer needs");
      return;
    }

    setLoading(true);

    try {
      const url =
        mode === "edit"
          ? `/api/interactions/${initialData?.id}`
          : "/api/interactions";
      const method = mode === "edit" ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          customerName: customerName || null,
          customerPhone: customerPhone || null,
          requirement,
          notes: notes || null,
          status,
          assignedToId: assignedToId ? parseInt(assignedToId) : null,
          createdById: mode === "create" ? currentRSOId : undefined,
        }),
      });

      if (response.ok) {
        toast.success(
          mode === "edit"
            ? "Interaction updated successfully"
            : "Interaction added successfully"
        );
        router.push("/interactions");
        router.refresh();
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to save interaction");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Type Selector */}
      <div className="space-y-3">
        <Label className="text-base">How did customer contact?</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {INTERACTION_TYPES.map((t) => {
            const Icon = typeIcons[t.value];
            const isSelected = type === t.value;
            return (
              <Card
                key={t.value}
                className={`cursor-pointer transition-all ${
                  isSelected
                    ? "ring-2 ring-amber-500 bg-amber-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => setType(t.value as InteractionType)}
              >
                <CardContent className="p-4 flex flex-col items-center justify-center gap-2">
                  <Icon
                    className={`h-8 w-8 ${
                      isSelected ? "text-amber-600" : "text-gray-500"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      isSelected ? "text-amber-600" : "text-gray-600"
                    }`}
                  >
                    {t.label}
                  </span>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Customer Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customerName">Customer Name (optional)</Label>
          <Input
            id="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter name"
            className="h-12"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="customerPhone">Phone Number (optional)</Label>
          <Input
            id="customerPhone"
            type="tel"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="Enter phone"
            className="h-12"
          />
        </div>
      </div>

      {/* Requirement */}
      <div className="space-y-2">
        <Label htmlFor="requirement">
          What do they need? <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="requirement"
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
          placeholder="Describe what the customer is looking for..."
          className="min-h-[100px] text-base"
          required
        />
      </div>

      {/* Assignment and Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Assign to</Label>
          <Select value={assignedToId} onValueChange={setAssignedToId}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select RSO" />
            </SelectTrigger>
            <SelectContent>
              {rsos.map((rso) => (
                <SelectItem key={rso.id} value={rso.id.toString()}>
                  {rso.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={status}
            onValueChange={(v) => setStatus(v as InteractionStatus)}
          >
            <SelectTrigger className="h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes (optional)</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any additional notes..."
          className="min-h-[80px]"
        />
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-4">
        <Link href="/interactions" className="flex-1">
          <Button type="button" variant="outline" className="w-full h-14">
            Cancel
          </Button>
        </Link>
        <Button
          type="submit"
          className="flex-1 h-14 text-lg bg-amber-600 hover:bg-amber-700"
          disabled={loading}
        >
          {loading ? "Saving..." : mode === "edit" ? "Update" : "Save"}
        </Button>
      </div>
    </form>
  );
}
