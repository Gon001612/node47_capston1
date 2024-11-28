import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'

const prisma = new PrismaClient();

const updateUser = async (req, res) => {
    let { ho_ten, email, mat_khau, tuoi, anh_dai_dien } = req.body;

    let checkUser = await prisma.nguoi_dung.findFirst({
        where: {
            email
        }
    })
    if (!checkUser) {
        return res.status(500).json({ message: "Email is wrong" })
    }


    let newData = await prisma.nguoi_dung.update({
        where: {
            email
        },
        data: {
            ho_ten,
            anh_dai_dien,
            mat_khau: bcrypt.hashSync(mat_khau, 10),
            tuoi: tuoi ? Number(tuoi) : checkUser.tuoi
        }
    })

    return res.status(200).json({
        message: "Update Successfully",
        data: newData,
    })
}

const uploadImage = async (req, res) => {

    // Lấy thông tin người dùng từ token
    let nguoi_dung_id = req.nguoi_dung_id;

    // Lấy file upload
    let file = req.file;

    let newImage = await prisma.hinh_anh.create({
        data: {
            ten_hinh: file.originalname,
            duong_dan: file.path,
            mo_ta: req.body.mo_ta || null,
            nguoi_dung_id: Number(nguoi_dung_id) , // Gắn id từ token
        }
    })
    return res.status(200).json({
        message: "Image uploaded successfully",
        file: newImage
    });
}

const saveImage = async (req,res) => {
    let {hinhId} = req.params;

    let checkImage = await prisma.hinh_anh.findFirst({
        where: {hinh_id: Number(hinhId)}
    })
    if (!checkImage || checkImage == null) {
        return res.status(500).json({message: "Not found Image"}) 
    }
    let nguoi_dung_id = req.nguoi_dung.nguoi_dung_id;

    let saveImage = await prisma.luu_anh.create({
        data: {
            nguoi_dung_id,
            hinh_id: Number(hinhId)
        }
    })
    return res.status(201).json({
        message:"saved",
        saveImage,
    })

}

const getImagesSave = async (req, res) => {
    
    let nguoiDungId = req.params;
    
    let data = await prisma.luu_anh.findFirst({
        where: {
            nguoi_dung_id: Number(nguoiDungId), // Lọc theo người dùng
        }
       
    })
    return res.status(201).json(data)
 }


export {
    updateUser,
    saveImage,
    getImagesSave,
    uploadImage,
}