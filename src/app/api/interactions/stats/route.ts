import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { interactions } from "@/lib/db/schema";
import { eq, sql, and, gte } from "drizzle-orm";

export async function GET() {
  try {
    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get stats
    const [pendingCount, inProgressCount, completedCount, todayCount] =
      await Promise.all([
        db
          .select({ count: sql<number>`count(*)` })
          .from(interactions)
          .where(eq(interactions.status, "pending")),
        db
          .select({ count: sql<number>`count(*)` })
          .from(interactions)
          .where(eq(interactions.status, "in_progress")),
        db
          .select({ count: sql<number>`count(*)` })
          .from(interactions)
          .where(eq(interactions.status, "completed")),
        db
          .select({ count: sql<number>`count(*)` })
          .from(interactions)
          .where(gte(interactions.createdAt, today)),
      ]);

    return NextResponse.json({
      data: {
        pending: Number(pendingCount[0]?.count || 0),
        inProgress: Number(inProgressCount[0]?.count || 0),
        completed: Number(completedCount[0]?.count || 0),
        today: Number(todayCount[0]?.count || 0),
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
