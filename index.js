import express from 'express'
import rootRoutes from './src/routes/rootRoutes.js';


const app = express();

// add middleware for convert string to json with API POST and GET
app.use(express.json());

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

