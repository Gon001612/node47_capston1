import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
// load file .env
dotenv.config();

const createToken = (nguoi_dung_id) => {
    return jwt.sign({ nguoi_dung_id }, process.env.SECRET_KEY, {
        algorithm: "HS256",
        expiresIn: "1d" // m: minute, s: second, h: hour, d: day
    });
}

const createRefToken = (nguoi_dung_id) => {
    return jwt.sign({ nguoi_dung_id }, process.env.SECRET_KEY, {
        algorithm: "HS256",
        expiresIn: "7d" // m: minute, s: second, h: hour, d: day
    });
}

// define function để verify token
const verifyToken = (token) => {
    try {
       let decoded = jwt.verify(token, process.env.SECRET_KEY);
       return { valid: true, nguoi_dung_id: decoded.nguoi_dung_id }; // Trả về payload
    } catch (error) {
        return { valid: false, error: error.message };
    }
}

// define middleware để check token
const middlewareToken = (req, res, next) => {
    let token = req.headers.token;
    console.log("token: ", token)
    if (!token) {
        return res.status(401).json({message: "Unauthorized: Token is required"});
    }
    let checkToken = verifyToken(token);
    if (checkToken) {
        req.nguoi_dung_id = checkToken.nguoi_dung_id; // Gắn payload vào req
        next(); // pass check tokenS
    }
    else {
        return res.status(401).json({message: "Unauthorized"});
    }
}


export {
    createToken,
    middlewareToken,
    createRefToken,
    verifyToken,
}