/**
 * logic for handling requests
 */

import { NextFunction } from "express";
export function getProdutHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("getting product");
}
// export function getProdutHandler(req:Request, res:Response, next:NextFunction) {

// }
export function putProductHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("create product");
}

export function patchProdutHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {}
