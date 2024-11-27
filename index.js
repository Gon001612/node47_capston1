import express from 'express'
import rootRoutes from './src/routes/rootRoutes.js';
import cors from 'cors'
import cookieParser from 'cookie-parser';


const app = express();

// add middleware cors to receive request from FE or orther
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true // set true để BE nhận cookie từ FE
}));

// thêm middlerware để get info cookie từ request FE hoặc postman
app.use(cookieParser());

// add middleware for convert string to json with API POST and GET
app.use(express.json());

// define middleWare to handle error
// define cho express hiểu khi error xảy ra
// thì express nó sẽ tìm tới middleware này
//Lưu ý: phải truyền đủ 4 params để express hiểu
// đó là middleware handle lỗi
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message || " Internal Server"
    })
});

// import rootRoutes vao index.js
app.use(rootRoutes);

//check connect with server
app.get("/health-check", (req, res) => {
    res.send("Server is connecting")
});

// define port for BE
app.listen(8080, () => {
    console.log("BE starting with port 8080")
});

