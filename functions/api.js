import express from "express";
import serverless from "serverless-http";

const app = express();

registerRoutes(app)
export const handler = serverless(app);
