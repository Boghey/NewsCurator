import express, {Router} from "express";
import serverless from "serverless-http";
import { registerRoutes } from "../server/routes";

const app = express();
const router = Router();

// registerRoutes(app);
app.use("/", router);
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port ${process.env.PORT || 3000}`);
})

export const handler = serverless(app);
