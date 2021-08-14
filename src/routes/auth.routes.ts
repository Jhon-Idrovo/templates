/**
 * endpoints for login and register
 */
import { Router } from "express";
import passport from "passport";
import * as AuthCtlr from "../controllers/auth.controller";

const router = Router();
router.post("/signin", AuthCtlr.signInHandler); //the access token is send here
router.post("/get-new-access-token", AuthCtlr.getAccessTokenHandler);
router.post("/signup", AuthCtlr.signUpHandler);
router.post("/signout", AuthCtlr.signOutHandler);
router.post("/create-admin", AuthCtlr.createAdminHandler);
//sign in with Google
router.get("/google", passport.authenticate("oauth2"));
router.get(
  "/google/callback",
  passport.authenticate("oauth2"),
  async (req, res, next) => {
    console.log(req);
  }
);
export default router;
