import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { interactions, rsos } from "@/lib/db/schema";
import { eq, desc, and, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const assignedToId = searchParams.get("assignedToId");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const conditions = [];

    if (status && status !== "all") {
      conditions.push(eq(interactions.status, status as "pending" | "in_progress" | "completed"));
    }

    if (type) {
      conditions.push(eq(interactions.type, type as "phone_call" | "whatsapp" | "walk_in" | "email" | "social_media"));
    }

    if (assignedToId) {
      conditions.push(eq(interactions.assignedToId, parseInt(assignedToId)));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const results = await db
      .select({
        id: interactions.id,
        customerName: interactions.customerName,
        customerPhone: interactions.customerPhone,
        type: interactions.type,
        status: interactions.status,
        requirement: interactions.requirement,
        requirementTags: interactions.requirementTags,
        notes: interactions.notes,
        assignedToId: interactions.assignedToId,
        createdById: interactions.createdById,
        interactionDate: interactions.interactionDate,
        createdAt: interactions.createdAt,
        updatedAt: interactions.updatedAt,
        assignedToName: rsos.name,
      })
      .from(interactions)
      .leftJoin(rsos, eq(interactions.assignedToId, rsos.id))
      .where(whereClause)
      .orderBy(desc(interactions.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(interactions)
      .where(whereClause);

    const total = Number(countResult[0]?.count || 0);

    return NextResponse.json({ data: results, total });
  } catch (error) {
    console.error("Error fetching interactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch interactions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerPhone,
      type,
      status,
      requirement,
      requirementTags,
      notes,
      assignedToId,
      createdById,
    } = body;

    if (!type || !requirement) {
      return NextResponse.json(
        { error: "Type and requirement are required" },
        { status: 400 }
      );
    }

    const newInteraction = await db
      .insert(interactions)
      .values({
        customerName: customerName || null,
        customerPhone: customerPhone || null,
        type,
        status: status || "pending",
        requirement,
        requirementTags: requirementTags ? JSON.stringify(requirementTags) : null,
        notes: notes || null,
        assignedToId: assignedToId || null,
        createdById: createdById || null,
      })
      .returning();

    return NextResponse.json({ data: newInteraction[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating interaction:", error);
    return NextResponse.json(
      { error: "Failed to create interaction" },
      { status: 500 }
    );
  }
}
