import express from "express";
import UserController from "../controllers/users.js";
import validateBody from "../helpers/validateBody.js";
import { createUserSchema, loginUserSchema } from "../schemas/usersSchemas.js";

const router = express.Router();

router.post("/register",
    validateBody(createUserSchema),
    UserController.register); 
router.post("/login",
    validateBody(loginUserSchema),
    UserController.login);

export default router;