import { pgTable, uuid, text, boolean, pgEnum } from "drizzle-orm/pg-core";

export const projectCategoryEnum = pgEnum("project_category", [
  "ML",
  "web development",
  "IOT",
  "data science"
]);

export const project = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: projectCategoryEnum("category").notNull(),
  isAssigned: boolean("is_assigned").notNull().default(false),
});