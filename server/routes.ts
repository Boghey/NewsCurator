import type { Express, Router } from "express";
import { storage } from "./storage";
import * as cheerio from "cheerio";
import { insertLinkSchema } from "@shared/schema";
import fetch from "node-fetch";

async function scrapeMetadata(url: string) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const title =
      $('meta[property="og:title"]').attr("content") ||
      $("title").text() ||
      $('meta[name="title"]').attr("content");

    const image =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[property="twitter:image"]').attr("content");

    return { title, image };
  } catch (error) {
    console.error("Error scraping metadata:", error);
    return { title: null, image: null };
  }
}

export function registerRoutes(app: Express, router: Router): Express {
  router.get("/hello", (req, res) => {
    res.send("Hello World!");
  })
  
  router.get("/links", async (_req, res) => {
    const links = await storage.getLinks();
    res.send(links);
  });

  router.get("/links/tag/:tag", async (req, res) => {
    const { tag } = req.params;
    const links = await storage.getLinksByTag(tag);
    res.send(links);
  });

  router.post("/links/scrape", async (req, res) => {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ message: "URL is required" });
    }

    const metadata = await scrapeMetadata(url);
    res.send(metadata);
  });

  router.post("/links", async (req, res) => {
    try {
      const link = insertLinkSchema.parse(req.body);
      const created = await storage.createLink(link);
      res.send(created);
    } catch (error) {
      res.status(400).json({ message: "Invalid link data" });
    }
  });

  router.delete("/links/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid link ID" });
    }

    await storage.deleteLink(id);
    res.status(204).end();
  });

  app.use("/api/", router);

  return app;
}
