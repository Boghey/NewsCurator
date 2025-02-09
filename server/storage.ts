import { links, type Link, type InsertLink } from "@shared/schema";
import { db } from "./db";
import { eq, arrayContains } from "drizzle-orm";

export interface IStorage {
  getLinks(): Promise<Link[]>;
  createLink(link: InsertLink): Promise<Link>;
  getLinksByTag(tag: string): Promise<Link[]>;
  deleteLink(id: number): Promise<void>;
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
      .where(arrayContains(links.tags, [tag]))
      .orderBy(links.createdAt);
    return taggedLinks.reverse();
  }

  async deleteLink(id: number): Promise<void> {
    await db.delete(links).where(eq(links.id, id));
  }
}

export const storage = new DatabaseStorage();