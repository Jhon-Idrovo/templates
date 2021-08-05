/**
 * example routing for a model
 */

import { RequestHandler, Router } from "express";
import * as ProductsCtlr from "../controllers/products.controller";
const router = Router();
router.get("/:id", ProductsCtlr.getProdutHandler as unknown as RequestHandler);
router.put(
  "/create",
  ProductsCtlr.putProductHandler as unknown as RequestHandler
);
export default router;
