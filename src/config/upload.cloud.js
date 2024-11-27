import express from "express";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv, { config } from 'dotenv'

dotenv.config();

// cấu hình cloudinary 

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// cấu hình multer với cloudinary 
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'Images', // define folder lưu hình, nếu cloudinary ko có thì sẽ tạo folder mới
        format: async (req, file) => {
            // define những format file cho phép up len cloud
            const validFormats = ['jpeg', 'jpg','png','gif','wepb','svg', 'raw'];

            // lấy định dạnh file upload
            // mimetype: image/png, image/jpeg,....
            const fileFormat = file.mimetype.split('/')[1];

            // kiểm tra định dạng file có trong list hợp lệ hay không
            if(validFormats.includes(fileFormat)) {
                return fileFormat;
            };
            return 'png'; // return default định dạng file ảnh là png
        },
        public_id: (req, file) => {
            const newName = new Date().getTime()+ "_" + file.originalname.split('.')[0];
            return newName;
        }
    }
});

// difine middleware uploadCloud
    export const uploadCloud = multer({storage});