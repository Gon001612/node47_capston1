import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
// load file .env
dotenv.config();

const createToken = (data) => {
    return jwt.sign({ payload: data }, process.env.SECRET_KEY, {
        algorithm: "HS256",
        expiresIn: "20s" // m: minute, s: second, h: hour, d: day
    });
}

const createRefToken = (data) => {
    return jwt.sign({ payload: data }, process.env.SECRET_KEY, {
        algorithm: "HS256",
        expiresIn: "7d" // m: minute, s: second, h: hour, d: day
    });
}

// define function để verify token
const verifyToken = (token) => {
    try {
        let decoded = jwt.verify(token, process.env.SECRET_KEY);
        return { valid: true, decoded };
    } catch (error) {
        return { valid: false, error: error.message }
    }
}

// define middleware để check token
const middlewareToken = (req, res, next) => {
    try {
        let refreshToken = req.cookies.refreshToken;

        if (!refreshToken || refreshToken == null) {
            return res.status(401).json({ message: "Unauthorized: Token is required" });
        }
        // Xác minh token và lấy payload
        let tokenVerification  = verifyToken(refreshToken);
    
        // Gắn payload vào req để các hàm khác sử dụng
        req.nguoi_dung = tokenVerification.decoded.payload;
        next(); // Pass qua middleware
    } catch (error) {
        console.error("Error in middlewareToken:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


export {
    createToken,
    middlewareToken,
    createRefToken,
    verifyToken,
}