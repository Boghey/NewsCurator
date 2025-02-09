import { links, type Link, type InsertLink } from "@shared/schema";

export interface IStorage {
  getLinks(): Promise<Link[]>;
  createLink(link: InsertLink): Promise<Link>;
  getLinksByTag(tag: string): Promise<Link[]>;
}

export class MemStorage implements IStorage {
  private links: Map<number, Link>;
  private currentId: number;

  constructor() {
    this.links = new Map();
    this.currentId = 1;
  }

  async getLinks(): Promise<Link[]> {
    return Array.from(this.links.values()).sort((a, b) => 
      (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  async createLink(insertLink: InsertLink): Promise<Link> {
    const id = this.currentId++;
    const link: Link = {
      id,
      url: insertLink.url,
      title: insertLink.title,
      imageUrl: insertLink.imageUrl ?? null,
      tags: insertLink.tags ?? [],
      scrapedTitle: insertLink.scrapedTitle ?? null,
      scrapedImage: insertLink.scrapedImage ?? null,
      createdAt: new Date(),
    };
    this.links.set(id, link);
    return link;
  }

  async getLinksByTag(tag: string): Promise<Link[]> {
    return Array.from(this.links.values())
      .filter((link) => link.tags?.includes(tag))
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }
}

export const storage = new MemStorage();