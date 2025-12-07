import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rsos } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const rso = await db
      .select()
      .from(rsos)
      .where(eq(rsos.id, parseInt(id)))
      .limit(1);

    if (rso.length === 0) {
      return NextResponse.json({ error: "RSO not found" }, { status: 404 });
    }

    return NextResponse.json({ data: rso[0] });
  } catch (error) {
    console.error("Error fetching RSO:", error);
    return NextResponse.json(
      { error: "Failed to fetch RSO" },
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
    const { name, employeeCode, phone, isActive } = body;

    const updated = await db
      .update(rsos)
      .set({
        name,
        employeeCode: employeeCode || null,
        phone: phone || null,
        isActive: isActive ?? true,
        updatedAt: new Date(),
      })
      .where(eq(rsos.id, parseInt(id)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: "RSO not found" }, { status: 404 });
    }

    return NextResponse.json({ data: updated[0] });
  } catch (error) {
    console.error("Error updating RSO:", error);
    return NextResponse.json(
      { error: "Failed to update RSO" },
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
    // Soft delete by setting isActive to false
    const deleted = await db
      .update(rsos)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(rsos.id, parseInt(id)))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ error: "RSO not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting RSO:", error);
    return NextResponse.json(
      { error: "Failed to delete RSO" },
      { status: 500 }
    );
  }
}
