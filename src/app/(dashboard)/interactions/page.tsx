"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { InteractionCard } from "@/components/dashboard/interaction-card";
import { Plus } from "lucide-react";
import type { InteractionStatus, InteractionType } from "@/types";

interface InteractionWithAssigned {
  id: number;
  customerName: string | null;
  customerPhone: string | null;
  type: InteractionType;
  status: InteractionStatus;
  requirement: string;
  assignedToName?: string | null;
  createdAt: Date | string;
}

export default function InteractionsPage() {
  const [interactions, setInteractions] = useState<InteractionWithAssigned[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchInteractions = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (statusFilter !== "all") {
          params.set("status", statusFilter);
        }
        params.set("limit", "100");

        const response = await fetch(`/api/interactions?${params}`);
        const data = await response.json();
        setInteractions(data.data || []);
      } catch (error) {
        console.error("Error fetching interactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInteractions();
  }, [statusFilter, refreshKey]);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Interactions</h1>
        <Link href="/interactions/new">
          <Button className="bg-amber-600 hover:bg-amber-700">
            <Plus className="h-4 w-4 mr-1" />
            Add New
          </Button>
        </Link>
      </div>

      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-24 bg-gray-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : interactions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No interactions found</p>
          <Link href="/interactions/new">
            <Button className="bg-amber-600 hover:bg-amber-700">
              <Plus className="h-4 w-4 mr-1" />
              Add First Interaction
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {interactions.map((interaction) => (
            <InteractionCard
              key={interaction.id}
              interaction={interaction}
              onStatusChange={() => setRefreshKey((k) => k + 1)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
