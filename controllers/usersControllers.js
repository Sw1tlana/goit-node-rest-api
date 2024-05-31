import path from "node:path";
import usersService from "../services/usersServices.js";
import * as fs from "node:fs/promises";
import User from "../models/users.js";
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

        return res.status(200).send({
            token: result.token,
            user: {
                email: result.user.email,
                subscription: result.user.subscription,
            },
        });
    } catch (error) {
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

    const result = usersService.currentUser(authorizationHeader);

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

export const changeAvatar = async (req, res, next) => {
  try {
   const inputPath = req.file.path;
    const outputPath = path.resolve("public", "avatars", req.file.filename);

       const image = await Jimp.read(inputPath);

    // Перевірка початкових розмірів зображення
    const originalWidth = image.bitmap.width;
    const originalHeight = image.bitmap.height;

    await image
      .resize(250, 250) // Зміна розміру до 250x250
      .writeAsync(outputPath); // Збереження обробленого зображення

    // Перевірка нових розмірів зображення
    const resizedImage = await Jimp.read(outputPath);
    const resizedWidth = resizedImage.bitmap.width;
    const resizedHeight = resizedImage.bitmap.height;

    await fs.unlink(inputPath);
   
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatarURL: req.file.filename },
      { new: true });
    
    if (user === null) {
      return res.status(401).send({ message: "Not authorized" });
    }
    
    return res.status(200).send(user);
  } catch (error) {
    next(error)
    
  }
}

export default {
  register,
  login,
  logout,
  current,
  updateSubscription,
  changeAvatar
};