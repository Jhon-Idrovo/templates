/**
 * express app configuration
 */
import express, { Response, Request } from "express";
import cors from "cors";
import morgan from "morgan";

import authRouter from "./auth.routes";
import productRouter from "./products.routes";
import userRouter from "./user.routes";
import { basePath } from "../config/config";
import passport from "passport";

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
//initialize passport
app.use(passport.initialize());

app.use(`${basePath}/auth`, authRouter);
app.use(`${basePath}/users`, userRouter);
app.use(`${basePath}/products`, productRouter);
//handle wrong paths
app.use("*", (req: Request, res: Response) =>
  res.status(404).json({ error: "Page not found" })
);

export default app;
