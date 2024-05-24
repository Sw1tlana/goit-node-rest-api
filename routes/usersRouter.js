import express from "express";
import UserController from "../controllers/usersControllers.js";
import validateBody from "../helpers/validateBody.js";
import { createUserSchema, loginUserSchema } from "../schemas/usersSchemas.js";

const router = express.Router();

router.post("/register",
    validateBody(createUserSchema),
    UserController.register); 

router.post("/login",
    validateBody(loginUserSchema),
    UserController.login);

router.post("/logout", UserController.logout);

export default router;