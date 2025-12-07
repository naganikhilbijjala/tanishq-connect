"use client";

import { useEffect, useState } from "react";
import { useCurrentRSO } from "@/hooks/use-current-rso";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { InteractionCard } from "@/components/dashboard/interaction-card";
import type { Interaction, InteractionType, InteractionStatus } from "@/types";

interface InteractionWithAssigned extends Interaction {
  assignedToName?: string | null;
}

export default function DashboardPage() {
  const { currentRSOName } = useCurrentRSO();
  const [recentInteractions, setRecentInteractions] = useState<
    InteractionWithAssigned[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchRecentInteractions = async () => {
    try {
      const response = await fetch(
        "/api/interactions?status=pending&limit=5"
      );
      const data = await response.json();
      setRecentInteractions(data.data || []);
    } catch (error) {
      console.error("Error fetching interactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentInteractions();
  }, [refreshKey]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {getGreeting()}, {currentRSOName}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s your overview for today
        </p>
      </div>

      <StatsCards key={refreshKey} />

      <QuickActions />

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-700">
          Recent Pending Items
        </h2>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 bg-gray-100 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : recentInteractions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No pending interactions. Great job!
          </div>
        ) : (
          <div className="space-y-3">
            {recentInteractions.map((interaction) => (
              <InteractionCard
                key={interaction.id}
                interaction={{
                  ...interaction,
                  type: interaction.type as InteractionType,
                  status: interaction.status as InteractionStatus,
                }}
                onStatusChange={() => setRefreshKey((k) => k + 1)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
