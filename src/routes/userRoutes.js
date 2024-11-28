import express from "express"
import { middlewareToken } from "../config/jwt.js";
import { tryCatch } from "../config/tryCatch.js";
import { updateUser, saveImage, getImagesSave, uploadImage } from "../controllers/userControllers.js";
import { uploadCloud } from "../config/upload.cloud.js";

const userRoutes = express.Router();

userRoutes.put('/update-user', middlewareToken, tryCatch(updateUser));
userRoutes.post('/save-image/:hinhId', middlewareToken, tryCatch(saveImage))
// đăng ảnh 
userRoutes.post('/upload-image', middlewareToken, uploadCloud.single("hinhAnh"), tryCatch(uploadImage))

// lấy ảnh đã lưu theo nguoi dung id
userRoutes.get('/get-images-saved/nguoiDungId',middlewareToken, tryCatch(getImagesSave))


export default userRoutes;