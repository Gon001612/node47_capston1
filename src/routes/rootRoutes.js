import express from 'express'
import authRoutes from './authRoutes.js';
import imgRoutes from './imgRoutes.js';

const rootRoutes = express.Router();

// define authRoutes in rootRoutes
rootRoutes.use('/auth', authRoutes)

rootRoutes.use('/img', imgRoutes)

export default rootRoutes;
