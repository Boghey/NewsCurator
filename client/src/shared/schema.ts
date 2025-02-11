import { z } from "zod";

export const linkSchema = z.object({
  id: z.number(),
  url: z.string().url(),
  title: z.string(),
  publishedDate: z.string(),
  imageUrl: z.string().nullable(),
  tags: z.array(z.string()),
  scrapedTitle: z.string().nullable(),
  scrapedImage: z.string().nullable(),
  notes: z.string().nullable(),
  createdAt: z.string(),
});

export type Link = z.infer<typeof linkSchema>;
