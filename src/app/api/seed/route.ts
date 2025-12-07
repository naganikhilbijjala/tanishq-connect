import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rsos, requirementTags } from "@/lib/db/schema";
import { DEFAULT_RSOS, DEFAULT_REQUIREMENT_TAGS } from "@/lib/constants";

export async function POST() {
  try {
    // Check if data already exists
    const existingRsos = await db.select().from(rsos).limit(1);

    if (existingRsos.length === 0) {
      // Seed RSOs
      await db.insert(rsos).values(
        DEFAULT_RSOS.map((rso) => ({
          name: rso.name,
          employeeCode: rso.employeeCode,
        }))
      );
    }

    // Check if tags exist
    const existingTags = await db.select().from(requirementTags).limit(1);

    if (existingTags.length === 0) {
      // Seed requirement tags
      await db.insert(requirementTags).values(
        DEFAULT_REQUIREMENT_TAGS.map((tag, index) => ({
          name: tag.name,
          category: tag.category,
          sortOrder: index,
        }))
      );
    }

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
    });
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    );
  }
}
