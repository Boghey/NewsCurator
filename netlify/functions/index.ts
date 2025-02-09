import express, {Router} from "express";
import serverless from "serverless-http";
import {registerRoutes} from "../server/routes";

const app = express();
const router = Router();

const registeredApp = registerRoutes(app, router);

export const handler = serverless(registeredApp);
