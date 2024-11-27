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
        jwt.verify(token, process.env.SECRET_KEY);
        return true;
    } catch (error) {
        return false;
    }
}

// define middleware để check token
const middlewareToken = (req, res, next) => {
    let {token} = req.headers;
    console.log("token: ", token)
    if (!token) {
        return res.status(401).json({message: "Unauthorized"});
    }
    let checkToken = verifyToken(token);
    if (checkToken) {
        next(); // pass check token
    }
    else {
        return res.status(401).json({message: "Unauthorized"});
    }
}

const verifyRefreshToken = (refreshToken) => {
    try {
        const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY);
        return decoded.payload.nguoi_dung_id;
    } catch (error) {
        return null;
    }
}

export {
    createToken,
    middlewareToken,
    createRefToken,
    verifyToken,
    verifyRefreshToken,
}