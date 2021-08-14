import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { Strategy as TwitterStrategy } from "passport-twitter";
import { Strategy as FacebookStrategy } from "passport-facebook";
import User from "../models/User";
import { basePath } from "./config";
import mongoose from "mongoose";
import Role from "../models/Role";

export const googleRedirectUrl = `http://localhost:8000${basePath}/auth/google/callback`;
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: googleRedirectUrl,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile,
      cb: Function
    ) => {
      console.log(profile);
      const role = await Role.findOne({ name: "User" });
      const { id, displayName, email, picture } = profile;
      //profile.id
      const _id = new mongoose.mongo.ObjectID(parseInt(id));
      const user = await User.findById(_id).exec();

      if (user) return cb(user);
      try {
        const newUser = await User.create({
          username: displayName,
          //this needs to be an ObjectId instance?
          _id,
          password: "empty",
          authMethod: "google",
          email,
          roles: role?._id,
        });
      } catch (error) {
        console.log(error);

        return cb(error);
      }
      cb(user);
    }
  )
);
console.log("Passport initialized");

// passport.use(
//   new Strategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//       authorizationURL: "https://www.example.com/oauth2/authorize",
//       tokenURL: "https://www.example.com/oauth2/token",
//       callbackURL: "http://localhost:3000/auth/example/callback",
//     },
//     async (
//       accessToken: string,
//       refreshToken: string,
//       profile,
//       cb: Function
//     ) => {
//       console.log(profile);
//       const { id, displayName } = profile;
//       const user = await User.findById(profile.id);
//       if (user) return user;
//       const newUser = User.create({
//         username: displayName,
//         //this needs to be an ObjectId instance?
//         _id: id,
//         password: "",
//         authMethod: "google",
//         email: "",
//         roles: "",
//       });
//     }
//   )
// );
