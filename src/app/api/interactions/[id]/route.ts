import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { interactions, rsos } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await db
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
      .where(eq(interactions.id, parseInt(id)))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Interaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: result[0] });
  } catch (error) {
    console.error("Error fetching interaction:", error);
    return NextResponse.json(
      { error: "Failed to fetch interaction" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
    } = body;

    const updated = await db
      .update(interactions)
      .set({
        customerName: customerName ?? undefined,
        customerPhone: customerPhone ?? undefined,
        type: type ?? undefined,
        status: status ?? undefined,
        requirement: requirement ?? undefined,
        requirementTags: requirementTags ? JSON.stringify(requirementTags) : undefined,
        notes: notes ?? undefined,
        assignedToId: assignedToId ?? undefined,
        updatedAt: new Date(),
      })
      .where(eq(interactions.id, parseInt(id)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        { error: "Interaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: updated[0] });
  } catch (error) {
    console.error("Error updating interaction:", error);
    return NextResponse.json(
      { error: "Failed to update interaction" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await db
      .delete(interactions)
      .where(eq(interactions.id, parseInt(id)))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        { error: "Interaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting interaction:", error);
    return NextResponse.json(
      { error: "Failed to delete interaction" },
      { status: 500 }
    );
  }
}
