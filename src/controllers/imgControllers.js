import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();


const getImages = async (req, res) => {
    let page = 1;
    let size = 16;
    let index = (page - 1) * size;

    let data = await prisma.hinh_anh.findMany({
        skip: index,
        take: size
    })
    return res.status(200).json(data)
}

const getImageByName = async (req, res) => {
    let { ten_hinh } = req.params;
    let data = await prisma.hinh_anh.findMany({
        where: {
            ten_hinh: {
                contains: ten_hinh, // Tìm kiếm tên chứa chuỗi `ten_hinh`
            }
        }
    })
    if (!data) {
        return res.status(500).json({ message: "Not Found  Image" })
    }
    return res.status(200).json(data)
}


const getImageDetail = async (req, res) => {
    let { hinhId } = req.params;
    if (!hinhId) {
        return res.status(500).json({ message: "Invalid image id" });
    }
    let data = await prisma.hinh_anh.findFirst({
        where: {
            hinh_id: Number(hinhId)
        },
    })
    return res.status(200).json(data)
}

const deleteImage = async (req, res) => {
    let { hinhId } = req.params
    let checkUser = await prisma.hinh_anh.findFirst({
        where: {
            hinh_id: Number(hinhId)

        }
    })
    if (!checkUser) {
        return res.status(500).json({ message: "Not Found Image" })
    }
    await prisma.hinh_anh.delete({
        where: {
            hinh_id: Number(hinhId)
        }
    })
    return res.status(200).json({ message: "Delete Successfully" })
}



export {
    getImages,
    getImageByName,
    getImageDetail,
    deleteImage,

}