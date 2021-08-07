/**
 * example routing for a model
 */

import { RequestHandler, Router } from "express";
import * as ProductsCtlr from "../controllers/products.controller";
import { verifyTokenMiddleware } from "../middlewares/verifyToken";
const router = Router();
router.get(
  "/",
  ProductsCtlr.getAllProductsHandler as unknown as RequestHandler
);
router.get("/:id", ProductsCtlr.getProdutHandler as unknown as RequestHandler);
//with authorization
router.use(verifyTokenMiddleware);
router.post(
  "/create",
  ProductsCtlr.postProductHandler as unknown as RequestHandler
);
router.delete(
  "/delete",
  ProductsCtlr.deleteProdutHandler as unknown as RequestHandler
);
router.put("/update/:id", ProductsCtlr.putProdutHandler);
export default router;
