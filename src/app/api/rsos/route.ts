import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rsos } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const allRsos = await db
      .select()
      .from(rsos)
      .where(eq(rsos.isActive, true))
      .orderBy(rsos.name);

    return NextResponse.json({ data: allRsos });
  } catch (error) {
    console.error("Error fetching RSOs:", error);
    return NextResponse.json(
      { error: "Failed to fetch RSOs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, employeeCode, phone } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const newRso = await db
      .insert(rsos)
      .values({
        name,
        employeeCode: employeeCode || null,
        phone: phone || null,
      })
      .returning();

    return NextResponse.json({ data: newRso[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating RSO:", error);
    return NextResponse.json(
      { error: "Failed to create RSO" },
      { status: 500 }
    );
  }
}
