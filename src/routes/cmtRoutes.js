import express from "express";
import { middlewareToken } from "../config/jwt.js";
import { tryCatch } from "../config/tryCatch.js";
import { comment, getComments } from "../controllers/cmtControllers.js";

const cmtRoutes = express.Router();

cmtRoutes.post('/comment/:hinhId', middlewareToken, tryCatch(comment))

cmtRoutes.get('/get-comments/:hinhId', middlewareToken, tryCatch(getComments))


export default cmtRoutes;
