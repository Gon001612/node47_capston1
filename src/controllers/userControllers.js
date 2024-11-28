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

export {
    updateUser,
    saveImage,
}