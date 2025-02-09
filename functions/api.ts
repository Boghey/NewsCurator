import express from "express";
import serverless from "serverless-http";
import { registerRoutes } from "../server/routes";

const app = express();

registerRoutes(app);
export const handler = serverless(app);
