import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import * as cheerio from "cheerio";
import { insertLinkSchema } from "@shared/schema";
import fetch from "node-fetch";

async function scrapeMetadata(url: string) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const title = $('meta[property="og:title"]').attr('content') || 
                 $('title').text() || 
                 $('meta[name="title"]').attr('content');

    const image = $('meta[property="og:image"]').attr('content') || 
                 $('meta[property="twitter:image"]').attr('content');

    return { title, image };
  } catch (error) {
    console.error('Error scraping metadata:', error);
    return { title: null, image: null };
  }
}

export function registerRoutes(app: Express): Server {
  app.get("/api/links", async (_req, res) => {
    const links = await storage.getLinks();
    res.json(links);
  });

  app.get("/api/links/tag/:tag", async (req, res) => {
    const { tag } = req.params;
    const links = await storage.getLinksByTag(tag);
    res.json(links);
  });

  app.post("/api/links/scrape", async (req, res) => {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ message: "URL is required" });
    }

    const metadata = await scrapeMetadata(url);
    res.json(metadata);
  });

  app.post("/api/links", async (req, res) => {
    try {
      const link = insertLinkSchema.parse(req.body);
      const created = await storage.createLink(link);
      res.json(created);
    } catch (error) {
      res.status(400).json({ message: "Invalid link data" });
    }
  });

  app.delete("/api/links/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid link ID" });
    }

    await storage.deleteLink(id);
    res.status(204).end();
  });

  const httpServer = createServer(app);
  return httpServer;
}