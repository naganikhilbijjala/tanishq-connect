"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InteractionForm } from "@/components/forms/interaction-form";
import { toast } from "sonner";
import type { InteractionType, InteractionStatus } from "@/types";

interface InteractionData {
  id: number;
  customerName: string | null;
  customerPhone: string | null;
  type: InteractionType;
  status: InteractionStatus;
  requirement: string;
  requirementTags: string | null;
  notes: string | null;
  assignedToId: number | null;
  createdById: number | null;
  interactionDate: string;
  createdAt: string;
  updatedAt: string;
  assignedToName: string | null;
}

export default function InteractionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [interaction, setInteraction] = useState<InteractionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    const fetchInteraction = async () => {
      try {
        const response = await fetch(`/api/interactions/${resolvedParams.id}`);
        if (response.ok) {
          const data = await response.json();
          setInteraction(data.data);
        } else {
          toast.error("Interaction not found");
          router.push("/interactions");
        }
      } catch (error) {
        console.error("Error fetching interaction:", error);
        toast.error("Failed to load interaction");
      } finally {
        setLoading(false);
      }
    };

    fetchInteraction();
  }, [resolvedParams.id, router]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/interactions/${resolvedParams.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Interaction deleted");
        router.push("/interactions");
      } else {
        toast.error("Failed to delete interaction");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-32 bg-gray-200 rounded" />
          <div className="h-32 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!interaction) {
    return null;
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/interactions"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold">Edit Interaction</h1>
        </div>

        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogTrigger asChild>
            <Button variant="destructive" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Interaction</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this interaction? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <InteractionForm
        mode="edit"
        initialData={{
          id: interaction.id,
          customerName: interaction.customerName || undefined,
          customerPhone: interaction.customerPhone || undefined,
          type: interaction.type,
          status: interaction.status,
          requirement: interaction.requirement,
          requirementTags: interaction.requirementTags,
          notes: interaction.notes || undefined,
          assignedToId: interaction.assignedToId || undefined,
        }}
      />
    </div>
  );
}
