import express from "express"
import { middlewareToken } from "../config/jwt.js";
import { tryCatch } from "../config/tryCatch.js";
import { updateUser, saveImage } from "../controllers/userControllers.js";

const userRoutes = express.Router();

userRoutes.put('/update-user', middlewareToken, tryCatch(updateUser));
userRoutes.post('/save-image/:hinhId', middlewareToken, tryCatch(saveImage))

export default userRoutes;