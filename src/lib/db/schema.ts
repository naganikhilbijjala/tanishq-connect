import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  boolean,
  pgEnum,
  integer,
} from "drizzle-orm/pg-core";

// Enums
export const interactionTypeEnum = pgEnum("interaction_type", [
  "phone_call",
  "whatsapp",
  "walk_in",
  "email",
  "social_media",
]);

export const interactionStatusEnum = pgEnum("interaction_status", [
  "pending",
  "in_progress",
  "completed",
]);

// RSOs (Retail Sales Officers) Table
export const rsos = pgTable("rsos", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  employeeCode: varchar("employee_code", { length: 50 }),
  phone: varchar("phone", { length: 20 }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Customer Interactions Table
export const interactions = pgTable("interactions", {
  id: serial("id").primaryKey(),
  customerName: varchar("customer_name", { length: 200 }),
  customerPhone: varchar("customer_phone", { length: 20 }),
  type: interactionTypeEnum("type").notNull(),
  status: interactionStatusEnum("status").default("pending").notNull(),
  requirement: text("requirement").notNull(),
  requirementTags: text("requirement_tags"), // JSON array stored as string
  notes: text("notes"),
  assignedToId: integer("assigned_to_id").references(() => rsos.id),
  createdById: integer("created_by_id").references(() => rsos.id),
  interactionDate: timestamp("interaction_date").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Requirement Tags (predefined common tags)
export const requirementTags = pgTable("requirement_tags", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  category: varchar("category", { length: 50 }),
  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: integer("sort_order").default(0),
});

// Types for TypeScript
export type RSO = typeof rsos.$inferSelect;
export type NewRSO = typeof rsos.$inferInsert;
export type Interaction = typeof interactions.$inferSelect;
export type NewInteraction = typeof interactions.$inferInsert;
export type RequirementTag = typeof requirementTags.$inferSelect;
