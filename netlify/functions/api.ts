import express, { Router } from "express";
import serverless from "serverless-http";

export async function handler(event, context) {
  const app = express();
  const router = Router();
  router.get("/", (req, res) => res.send("Hello World!"));
  app.use("/api/", router);
  return serverless(app)(event, context);
}
