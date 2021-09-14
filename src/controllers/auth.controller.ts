/**
 * logic for handling auth requests
 */

import { NextFunction, Request, Response } from "express";
import Role from "../models/Role";
import User from "../models/User";
import BlacklistedToken from "../models/Token";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../utils/tokens";
import passport from "passport";
import { UserIfc } from "../models/interfaces/users";
import { Document } from "mongoose";
import { CLIENT_URL } from "../config/config";
import { RequestEnhanced, ResponseError } from "../models/interfaces/utils";
import RecoveryCode from "../models/RecoveryCode";
import { generateCode } from "../utils/utils";
import { transporter } from "../config/nodemailer";

/**
 * Verifies username and password against the database. If good, returns an object
 * with an access token and refresh token. The user role are send in the payload of the
 * access token. The role need to be decrypted only on the server because we can't share
 * the decoding secret safely with the client.
 * @param req
 * @param res
 * @param next
 */
export async function signInHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    //use email because the username is not unique when using third party auth providers
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate("role").exec();

    if (user) {
      if (user.authMethod !== "built-in")
        throw new Error(
          `This email is associated with a ${user.authMethod} account. Use that log in method`
        );
      //compare passwords
      if (await user.comparePassword(user.password, password)) {
        const userRole = user.role.name;

        const refreshToken = generateRefreshToken(user._id, userRole);
        return res.status(200).json({
          accessToken: generateAccessToken(user._id, userRole),
          refreshToken,
          //this is optional, you should not rely on this to grant access to any
          //protected resorce on the client because it's easy to modify.
          //And we can't very the signature on the client.
          //Instead, use the access token payload on the server.
          //role: userRole,
        });
      }
      throw new Error("Invalid password");
    }
    return res.status(400).json({ error: "User not found" });
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
}

/**
 * Takes in a refresh token and sends back a new access token if the
 * first is valid.
 * @param req
 * @param res
 * @param next
 */
export async function getAccessTokenHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const refreshToken = req.headers.authorization;
  if (refreshToken) {
    //validate the refresh token
    //first validation
    const decoded = verifyToken(refreshToken as string);

    if (decoded) {
      //second validation: See if the token is blacklisted
      const dbToken = await BlacklistedToken.findOne({
        token: refreshToken as string,
      }).catch(() => null);
      /**a third validation could be neccesary to verify that the user requesting the
       * new token is the same as the user registered in it. This is important since
       * the autorization middleware uses that information to identify the user.
       * A user cannot use its refresh token to request an access token for another
       * client since we return the latter with the same userID.
       */
      if (!dbToken) {
        //send another acces token to the client
        return res.status(200).json({
          accessToken: generateAccessToken(decoded.userID, decoded.role),
        });
      }
    }
    //the token is expired or blacklisted
    return res.json({ error: "Invalid refresh token" });
  }
}

/**
 * Deletes the refresh token from the database and invalidates the access token.
 * This method is optional since deleting the tokens on the client logs out
 * succesfully. This method is more needed when someone steals a refresh token.
 * In this case, the user should request the log out througth this method.
 * @param req
 * @param res
 * @param next
 */
export async function signOutHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const refreshToken = req.headers.authorization;
  const payload = refreshToken ? verifyToken(refreshToken as string) : null;
  try {
    if (payload) {
      //blacklist the refresh token
      const newBlacklistedTkn = await new BlacklistedToken({
        token: refreshToken,
        userID: payload.userID,
      }).save();
      return res.status(200);
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
  return res.status(400).json({ error: "Invalid refresh token" });
}

/**
 * Given a username, email and password, creates a new user assgining it a 'User' role
 * returns a jwt to the server or an error
 * @param req
 * @param res
 * @param next
 */
export async function signUpHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(req.body);

  const requestUser = { ...req.body, authMethod: "built-in" } as UserIfc;
  // validate agains joi
  const { error, value } = User.joiValidate(requestUser);
  if (error) return res.status(400).json({ error });

  try {
    //we could hardcode the role's id but if it gets deleted/modified we would have a problem
    const userRole = await Role.findOne({ name: "User" });
    const user = await new User({
      ...requestUser,
      //we don't need the await in this call but an error detects it as promise even if it is not
      password: await User.encryptPassword(requestUser.password),
      role: userRole?._id,
    }).save();
    user.populate("role");
    const newRole = user.role.name;
    const refreshToken = generateRefreshToken(user._id, newRole);
    return res.status(201).json({
      accessToken: generateAccessToken(user._id, newRole),
      refreshToken,
      user,
    });
  } catch (error: any) {
    console.log("Error on signup process:", error);

    //determine the error
    let errContent = { message: "" };
    switch (error.name) {
      case "MongoError":
        switch (error.code) {
          case 11000: //generally error 11000 is caused by existing records
            //since there is only one unique field on User we can assume it's the cause
            errContent = {
              message:
                "There already exists an account associated to this email",
            };
            break;

          default:
            errContent = {
              message:
                "An unidentified error happened. We are workin to solve it as soon as possible",
            };
            break;
        }
        break;
      //normal node error
      default:
        break;
    }
    return res.status(400).json({ error: errContent });
  }
}

/**
 * Given the email, username, password and correct admin access password,
 * it creates a new user with a role of "Admin"
 * Then, it sends back to the client a jwt token.
 * @param req
 * @param res
 * @param next
 */
export async function createAdminHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { username, password, email, adminAccessPassword } = req.body;
    if (adminAccessPassword === process.env.CREATE_ADMIN_PASSWORD) {
      const adminRole = await Role.findOne({ name: "Admin" });
      const admin = await new User({
        username,
        email,
        //we don't need the await in this call but an error detects it as promise even if it is not
        password: await User.encryptPassword(password),
        role: adminRole?._id,
      }).save();

      return res
        .status(201)
        .json({ accessToken: generateAccessToken(admin._id, "Admin") });
    }
    res.json({ error: "Admin access password invalid" });
  } catch (error) {
    return res.status(400).json({ error });
  }
}

/**
 * Returns a succesful response to the client upon which it would
 * redirect to the home page. Now the access and refresh token are included
 * @param req
 * @param res
 * @param next
 */
export async function googleCallback(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("on callback 2", req);

  return res.send("success");
}
export async function handleGoogle(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("here");

  passport.authenticate(
    "google",
    { scope: ["profile", "email"], session: false },
    function (err, user: UserIfc & Document<any, any, UserIfc>, userInfo) {
      console.log(err, user, userInfo);
      //role are populated
      const role = user.role.name;
      const accesToken = generateAccessToken(user._id, role);
      const refreshToken = generateRefreshToken(user._id, role);
      console.log("redirecting");

      return res.redirect(`${CLIENT_URL}/?at=${accesToken}&rt=${refreshToken}`);
    }
  )(req, res, next);
}

export async function handleFacebook(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("handleFacebook REQUEST:------------------");
  const user = req.user as UserIfc & Document<any, any, UserIfc>;
  //roles are populated
  const role = user.role.name;
  const accesToken = generateAccessToken(user._id, role);
  const refreshToken = generateRefreshToken(user._id, role);
  console.log("redirecting");
  if (role === "Guest") {
    //redirect to complete signup (in case that payments are needed)
    return res.redirect(
      `${CLIENT_URL}/signup?at=${accesToken}&rt=${refreshToken}`
    );
  }
  return res.redirect(`${CLIENT_URL}/?at=${accesToken}&rt=${refreshToken}`);
}
export async function handleTwitter(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("handleTwitter", req.user);
  const user = req.user as UserIfc & Document<any, any, UserIfc>;
  //roles are populated
  const role = user.role.name;
  const accesToken = generateAccessToken(user._id, role);
  const refreshToken = generateRefreshToken(user._id, role);
  console.log("redirecting", CLIENT_URL);
  if (role === "Guest") {
    //redirect to complete signup
    return res.redirect(
      `${CLIENT_URL}/signup?at=${accesToken}&rt=${refreshToken}`
    );
  }
  return res.redirect(`${CLIENT_URL}/?at=${accesToken}&rt=${refreshToken}`);
}
/**
 *
 * @param req
 * @param res
 * @param next
 */
export async function changePassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { userID } = (req as RequestEnhanced).decodedToken;
  const { newPassword } = req.body;
  const user = await User.findById(userID);
  if (!user)
    return res.status(400).json({ error: { message: "User not found" } });
  user.password = await User.encryptPassword(newPassword);
  try {
    await user.save();
    return res.send();
  } catch (error) {
    console.log(error);

    return res.status(400).json({
      error: { message: "Unable to update", completeError: error },
    } as ResponseError);
  }
}
export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { userID } = (req as RequestEnhanced).decodedToken;
  try {
    const user = await User.findById(userID);
    if (!user)
      return res.status(400).json({ error: { message: "User not found" } });
    await user.delete();
    res.send();
  } catch (error) {
    console.log(error);

    return res.status(400).json({
      error: { message: "Unable to update", completeError: error },
    } as ResponseError);
  }
}
export async function sendRecoveryCode(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return res.status(400).json({ error: { message: "User not found" } });
  const code = generateCode();
  try {
    await RecoveryCode.create({
      userId: user._id,
      // adjusting for changes in tiezones and more
      iat: Date.now() - 86400000,
      code,
    });
    console.log(user.email);

    // const a = await SendgridClient.send({
    //   to: { name: user.username, email: user.email },
    //   from: { email: "font.tester.app@gmail.com", name: "Font Tester" },
    //   templateId: "a9ba698b-cd40-441a-a6a2-1a7462d9f13c",
    //   subject: "Recovery Code",
    //   dynamicTemplateData: { name: user.username, code },
    // });
    // console.log(a);
    await transporter.sendMail({
      from: "'Font Tester' <font.tester.app@gmail.com>",
      to: user.email,
      subject: "Recovery Password",
      html:
        '<div style="width:100%;height:100%"><h1>Font Tester</h1><p>To continue with your account recovery process, please write the following code on our site.</p><h2>' +
        code +
        "</h2><p>If you were not expecting this message, please verify the security of your email account.</p></div>",
    });

    return res.send();
  } catch (error: any) {
    console.log(error.response.body);

    return res.status(400).json({
      error: {
        message: "Unable to generate the code, please try again later",
      },
    });
  }
}
export async function verifyRecoveryCode(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { code, email } = req.body;

  const recoveryCod = await RecoveryCode.findOne({ code });
  if (!recoveryCod)
    return res.status(400).json({
      error: {
        message:
          "Sorry, we can't find that code, please try again or try a new code",
      },
    });
  await recoveryCod
    .populate("userId")
    .populate({ path: "userId", populate: { path: "role" } })
    .execPopulate();
  console.log(recoveryCod.userId);
  const {
    _id,
    role,
    email: userEmail,
    username,
  } = recoveryCod.userId as unknown as UserIfc & Document<any, any, UserIfc>;
  const accessToken = generateAccessToken(_id, role.name);
  const refreshToken = generateRefreshToken(_id, role.name);
  if (userEmail === email && recoveryCod.iat < Date.now()) {
    recoveryCod.delete();
    return res.json({
      redirect: `/password-change/?at=${accessToken}&rt=${refreshToken}`,
    });
  }

  return res.status(400).json({
    error: { message: "Invalid code" },
  });
}
