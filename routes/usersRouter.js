import express from "express";
import UserController from "../controllers/usersControllers.js";
import validateBody from "../helpers/validateBody.js";
import { createUserSchema, loginUserSchema, updateSubscriptionSchema } from "../schemas/usersSchemas.js";

import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

router.post("/register",
    validateBody(createUserSchema),
    UserController.register); 

router.post("/login",
    validateBody(loginUserSchema),
    UserController.login);

router.get("/logout", authMiddleware, UserController.logout);
router.get("/current", authMiddleware, UserController.current);
router.patch(
  "/",
  authMiddleware,
  validateBody(updateSubscriptionSchema),
  UserController.updateSubscription
);

export default router;