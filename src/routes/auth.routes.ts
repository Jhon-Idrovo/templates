/**
 * endpoints for login and register
 */
import { Router } from "express";
import passport from "passport";
import { googleRedirectUrl } from "../config/passport";
import * as AuthCtlr from "../controllers/auth.controller";

const router = Router();
router.post("/signin", AuthCtlr.signInHandler); //the access token is send here
router.post("/get-new-access-token", AuthCtlr.getAccessTokenHandler);
router.post("/signup", AuthCtlr.signUpHandler);
router.post("/signout", AuthCtlr.signOutHandler);
router.post("/create-admin", AuthCtlr.createAdminHandler);
//sign in with Google
//scopes https://developers.google.com/identity/protocols/oauth2/scopes?authuser=1#google-sign-in
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  //split it to take the base path out
  googleRedirectUrl.split("auth")[1],
  passport.authenticate("google"),
  AuthCtlr.googleCallback
);
export default router;
