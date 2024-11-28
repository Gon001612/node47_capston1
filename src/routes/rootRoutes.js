import express from 'express'
import authRoutes from './authRoutes.js';
import imgRoutes from './imgRoutes.js';
import cmtRoutes from './cmtRoutes.js';
import userRoutes from './userRoutes.js';


const rootRoutes = express.Router();

// define authRoutes in rootRoutes
rootRoutes.use('/auth', authRoutes)

rootRoutes.use('/img', imgRoutes)

rootRoutes.use('/cmt', cmtRoutes)

rootRoutes.use('/user', userRoutes)

export default rootRoutes;
