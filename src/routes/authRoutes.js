import express from "express";
import { tryCatch } from "../config/tryCatch.js";
import { signUp, login, extendToken } from "../controllers/authControllers.js";

const authRoutes = express.Router();

// define API sign-up
authRoutes.post('/sign-up', tryCatch(signUp))
authRoutes.post('/login', tryCatch(login))
authRoutes.post('/extend-token', tryCatch(extendToken))



export default authRoutes
