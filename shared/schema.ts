import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const links = pgTable("links", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  title: text("title").notNull(),
  imageUrl: text("image_url"),
  tags: text("tags").array().default([]),
  scrapedTitle: text("scraped_title"),
  scrapedImage: text("scraped_image"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertLinkSchema = createInsertSchema(links)
  .omit({ id: true, createdAt: true })
  .extend({
    url: z.string().url("Please enter a valid URL"),
    tags: z.array(z.string()),
  });

export type InsertLink = z.infer<typeof insertLinkSchema>;
export type Link = typeof links.$inferSelect;
