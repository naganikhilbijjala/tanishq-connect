import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requirementTags } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const tags = await db
      .select()
      .from(requirementTags)
      .where(eq(requirementTags.isActive, true))
      .orderBy(requirementTags.sortOrder);

    return NextResponse.json({ data: tags });
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}
