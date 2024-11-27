import express from "express";
import { tryCatch } from "../config/tryCatch.js";
import { getImages, uploadImage, getImageByName, getImageDetail, deleteImage } from "../controllers/imgControllers.js";
import { uploadCloud } from "../config/upload.cloud.js";


const imgRoutes = express.Router();

// đăng ảnh 
imgRoutes.post('/upload-image', uploadCloud.single("hinhAnh"), tryCatch(uploadImage))

// lấy danh sách ảnh
imgRoutes.get('/get-images', tryCatch(getImages))

// lấy ra ảnh theo tên
imgRoutes.get('/get-image/:ten_hinh',  tryCatch(getImageByName))

// lấy thông tin ảnh bằng id 
imgRoutes.get('/get-image-detail/:hinhId', tryCatch(getImageDetail))

// Xoá ảnh 
imgRoutes.delete('/delete-image/:hinhId', tryCatch(deleteImage))



export default imgRoutes