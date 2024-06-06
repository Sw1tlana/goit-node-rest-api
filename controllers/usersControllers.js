import path from "node:path";
import usersService from "../services/usersServices.js";
import * as fs from "node:fs/promises";
import Jimp from "jimp";

export const register = async(req, res, next) => {
    try {
      const { password, email, subscription = "starter" } = req.body;
      
        const result = await usersService.registerUser({ 
            password,
            email,
            subscription,
        });

      if (result === null) {
            return res.status(409).send({ message: "Email in use" });
      }
 
           return res.status(201).send({
            user: {
            email: result.email,
            subscription: result.subscription,
             },
           });  
      
    } catch(error) {
        next(error);
    }
}

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await usersService.loginUser(email, password);

        if (result === null) {
            return res.status(401).send({ message: "Email or password is wrong" });
        }

      if (result === false) {
        return res.status(401).send({ message: "Please verify your email" });
      }
      
        return res.status(200).send({
            token: result.token,
            user: {
                email: result.user.email,
                subscription: result.user.subscription,
            },
        });
    } catch (error) {
        console.error('Error in login function:', error)
        next(error);
    }
};

export const logout = async (req, res, next) => {
  try {
      await usersService.logoutUser(req.user.id);

      return res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const current = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;

    const result = await usersService.currentUser(authorizationHeader);

    return res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  try {
    const subscription = req.body.subscription;
    const id = req.user.id;

    const result = await usersService.updateSubscriptionUser(id, subscription);

    return res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const avatar = async (req, res, next) => {

  const id = req.user.id;
  try {
    const userAvatarFilePath = await usersService.getUserAvatar(id);

    const isStatic = await fs
      .access(userAvatarFilePath)
      .then(() => true)
      .catch(() => false);

    if (isStatic) {
      return res
        .status(200)
        .send({ avatarURL: "/avatars/" + userAvatarFilePath });
    } else {
      return res.status(200).send({ avatarURL: userAvatarFilePath });
    }
  } catch (error) {
    next(error);
  }
};

export const changeAvatar = async (req, res, next) => {

  try {
    const id = req.user.id;
    const avatarFilename = req.file.filename;

    await fs.rename(
      req.file.path,
      path.resolve("public", "avatars", avatarFilename)
    );

    Jimp.read(
      path.resolve("public", "avatars", avatarFilename),
      (err, avatar) => {
        if (err) throw err;
        avatar
          .resize(256, 256)
          .write(path.resolve("public", "avatars", avatarFilename));
            console.log("Image resized successfully");
      }
    );
    const avatarURL = await usersService.updateUserAvatar(
      id,
     avatarFilename
    );
    return res.status(200).send({ avatarURL: "/avatars/" + avatarFilename });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;

    const user = await usersService.verifyUser(verificationToken);

    if (user === null) {
      return res.status(404).send({ message: 'User not found' });
    }
    return res.status(200).send({ message: 'Verification successful' });
    
  } catch (error) {
    next(error);
}
}

export default {
  register,
  login,
  logout,
  current,
  updateSubscription,
  avatar,
  changeAvatar,
  verifyEmail,
};