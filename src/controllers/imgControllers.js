import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();


const getImages = async (req, res) => {
    let page = 2;
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


// const uploadImage = async (req, res) => {

//     let refreshToken = req.cookies.refreshToken; // Lấy refreshToken từ cookies

//     if (!refreshToken) {
//         return res.status(500).json({ message: "Unauthorized" });
//     }
//     let nguoi_dung_id = verifyRefreshToken(refreshToken);
//     if (!nguoi_dung_id) {
//         return res.status(500).json({ message: "Invalid or expired token" });
//     }

//     let file = req.file;

//     await prisma.hinh_anh.create({
//         data: {
//             ten_hinh: file.originalname,
//             duong_dan: file.path,
//             mo_ta: req.body.mo_ta || null,
//             nguoi_dung_id, // Gắn nguoi_dung_id từ refreshToken
//         }
//     })
//     return res.status(200).json({
//         message: "Image uploaded successfully",
//         file: file,
//     });
// }

const uploadImage = async (req, res) => {
    
    // Lấy thông tin người dùng từ token
    let nguoi_dung_id = req.nguoi_dung.nguoi_dung_id;

    // Lấy file upload
    let file = req.file;

    let newImage = await prisma.hinh_anh.create({
        data: {
            ten_hinh: file.originalname,
            duong_dan: file.path,
            mo_ta: req.body.mo_ta || null,
            nguoi_dung_id, // Gắn id từ token
        }
    })
    return res.status(200).json({
        message: "Image uploaded successfully",
        image: newImage,
    });
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
    uploadImage,
    getImageDetail,
    deleteImage,

}