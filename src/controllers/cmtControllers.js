import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const comment = async(req,res) => {
    let {hinhId} =req.params;
    let nguoi_dung_id = req.nguoi_dung_id;

    let newCmt = await prisma.binh_luan.create({
        data: {
            nguoi_dung_id : Number(nguoi_dung_id),
            hinh_id: Number(hinhId),
            noi_dung: req.body.noi_dung
        }
    })

    return res.status(201).json({
        message:"Comment Succcesfully",
        commnet : newCmt,
    })  
}

const getComments = async (req,res) => {
    let {hinhId} = req.params;

    let checkImage = await prisma.hinh_anh.findFirst({
        where: {
            hinh_id : Number(hinhId)
        }
    })

    if(!checkImage || checkImage == null) {
        return res.status(401).json({message:"Not Found Image"})
    }
    let data = await prisma.binh_luan.findMany({
        where:{
            hinh_id: Number(hinhId)
        }
    })
    return res.status(200).json(data)
}

export {
    comment,
    getComments,
}