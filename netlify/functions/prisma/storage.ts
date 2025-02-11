import { PrismaClient, Link } from "@prisma/client";
import { z } from "zod";

export const insertLinkSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
  title: z.string(),
  imageUrl: z.string().optional(),
  publishedDate: z.string().transform((val) => new Date(val)),
  tags: z.array(z.string()).default([]),
  scrapedTitle: z.string().optional(),
  scrapedImage: z.string().optional(),
  notes: z.string().optional(),
});

export type InsertLink = z.infer<typeof insertLinkSchema>;

export interface IStorage {
  getLinks(): Promise<Link[]>;
  createLink(link: InsertLink): Promise<Link>;
  getLinksByTag(tag: string): Promise<Link[]>;
  deleteLink(id: number): Promise<void>;
  updateLinkNotes(id: number, notes: string): Promise<Link>;  // Added new method
}

export class DatabaseStorage implements IStorage {
  prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getLinks(): Promise<Link[]> {
    return await this.prisma.link.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async createLink(link: InsertLink): Promise<Link> {
    return await this.prisma.link.create({
      data: link,
    });
  }

  async getLinksByTag(tag: string): Promise<Link[]> {
    return await this.prisma.link.findMany({
      where: {
        tags: {
          has: tag,
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async deleteLink(id: number): Promise<void> {
    await this.prisma.link.delete({
      where: { id },
    });
  }

  async updateLinkNotes(id: number, notes: string): Promise<Link> {
    return await this.prisma.link.update({
      where: { id },
      data: { notes },
    });
  }
}

export const storage = new DatabaseStorage();