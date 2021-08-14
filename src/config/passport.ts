import passport from "passport";
import { Strategy } from "passport-oauth2";
import User from "../models/User";

passport.use(
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorizationURL: "https://www.example.com/oauth2/authorize",
      tokenURL: "https://www.example.com/oauth2/token",
      callbackURL: "http://localhost:3000/auth/example/callback",
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile,
      cb: Function
    ) => {
      console.log(profile);
      const { id, displayName } = profile;
      const user = await User.findById(profile.id);
      if (user) return user;
      const newUser = User.create({
        username: displayName,
        _id: id,
        password: "nn",
      });
    }
  )
);
