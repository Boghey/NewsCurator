import { links, type Link, type InsertLink } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getLinks(): Promise<Link[]>;
  createLink(link: InsertLink): Promise<Link>;
  getLinksByTag(tag: string): Promise<Link[]>;
}

export class DatabaseStorage implements IStorage {
  async getLinks(): Promise<Link[]> {
    const allLinks = await db.select().from(links).orderBy(links.createdAt);
    return allLinks.reverse();
  }

  async createLink(insertLink: InsertLink): Promise<Link> {
    const [link] = await db
      .insert(links)
      .values(insertLink)
      .returning();
    return link;
  }

  async getLinksByTag(tag: string): Promise<Link[]> {
    const taggedLinks = await db
      .select()
      .from(links)
      .where(eq(links.tags.array.includes([tag]), true))
      .orderBy(links.createdAt);
    return taggedLinks.reverse();
  }
}

export const storage = new DatabaseStorage();