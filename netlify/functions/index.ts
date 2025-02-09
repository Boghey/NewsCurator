import express, { Router } from "express";
import {scrapeMetadata} from "./server/routes";
import serverless from "serverless-http";
import {storage} from "./prisma/storage"

const app = express();
const router = Router();

router.get("/hello", (req, res) => {
  res.send("Hello World!");
});

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
    const created = await storage.createLink(req.body);
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

export const handler = serverless(app);
