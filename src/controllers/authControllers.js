import dotenv from 'dotenv'
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'
import transporter from '../config/transporter.js';
import { createRefToken, createToken } from '../config/jwt.js';



dotenv.config();
const prisma = new PrismaClient();

// tạo tài khoản
const signUp = async (req, res) => {
    // lấy dữ liệu từ bodt req (tên, email, mật khẩu)
    let { ho_ten, email, mat_khau } = req.body;

    // kiểm tra email đã tồn tại trong db hay chưa
    let checkUser = await prisma.nguoi_dung.findFirst({
        where: { email }
    })
    if (checkUser) {
        // nếu đã có rồi báo lỗi về
        return res.status(400).json({ message: "Email already exists" })
    }
    // nếu chưa có tiến hành khởi tạo tài khoản
    await prisma.nguoi_dung.create({
        data: {
            ho_ten,
            email,
            mat_khau: bcrypt.hashSync(mat_khau, 10) // dùng thư viện bcrypt để mã hoá mật khẩu 
        }
    })

    // sau khi khởi tạo thành công gửi email báo lại cho người dùng thông qua email đã đăng ký
    // cấu hình email
    const mailNotification = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Account creation successful",
        html: `
        <h1> Welcome ${ho_ten} to Pinterest</h1>
        <p> We invite you to join us in sharing and admiring these breathtaking photos. Let's come together to appreciate their beauty and inspire one another through this visual journey. </p>
        `
    }

    // gửi mail
    transporter.sendMail(mailNotification, (err, inf) => {
        if (err) {
            return res.status(500).json({ message: "Send email fail" })
        }
        return res.status(201).json({ message: "Send email successfully" })
    })
    return res.status(201).json({ message: "Create user successfully" })
}

// đăng nhập
const login = async (req, res) => {
    // lấy dữ liệu từ body req
    let { email, mat_khau } = req.body;

    // kiểm tra email trong db
    let checkUser = await prisma.nguoi_dung.findFirst({
        where: {
            email
        }
    });
    if (!checkUser) {
        return res.status(500).json({ message: "Email is wrong" })
    }

    // kiểm tra mật khẩu 
    let checkPass = bcrypt.compareSync(mat_khau, checkUser.mat_khau);
    if (!checkPass) {
        return res.status(400).json({ message: "Password is wrong" });
    }

    // tạo token cấp phép cho người dùng truy cập vào trang web
    // dùng thư viện jsonwebtoken để tạo token
    // tạo payload để lưu vào access token 
    let payload = {
        nguoi_dung_id: checkUser.nguoi_dung_id
    }

    // tạo accessToken bằng khoá đối xứng
    let accessToken = createToken(payload);

    // tạo refresh Token
    let refreshToken = createRefToken(payload);

    // lưu refreshToken vào table người dùng
    await prisma.nguoi_dung.update({
        where: {
            nguoi_dung_id: checkUser.nguoi_dung_id
        },
        data: {
            refresh_token: refreshToken
        }
    });

    // gắn refresh token cho cookie của response
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false, // dùng riêng cho localhost
        samSite: 'Lax', // đảm bảo cookie đc gữi trong nhiều domain
        maxAge: 7 * 24 * 60 * 60 * 10000 // thời gian tồn tại là 7 ngày

    })
    return res.status(200).json({ message: "Login successfully", token: accessToken })

}

const extendToken = async (req, res) => {
    // lấy refresh token từ cookie của req
    let refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: "401" })
    }

    // b2: check refresh token trong db
    let userRefToken = await model.users.findOne({
        where: { refresh_token: refreshToken }
    })
    if (!userRefToken || userRefToken == null) {
        return res.status(401).json({ message: "401" })
    }

    // create newAccess Token
    let newAccessToken = createToken({ userId: userRefToken.nguoi_dung_id });
    return res.status(200).json({ message: "Success", token: newAccessToken })
}

export {
    signUp,
    login,
    extendToken,
}