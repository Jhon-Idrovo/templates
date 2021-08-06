/**
 * endpoints for login and register
 */
import { Router } from "express";
import * as AuthCtlr from "../controllers/auth.controller";

const router = Router();
router.post("/signin", AuthCtlr.signInHandler);
router.post("/signup", AuthCtlr.signUpHandler);
router.post("/create-admin", AuthCtlr.createAdminHandler);

export default router;
