import express from 'express';
import multer from 'multer';
import { createRestaurante } from '../controllers/restauranteController';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB  

 });

 //Rutas para el restaurante
 router.post('/', upload.single("imageFile"), createRestaurante)

 export default router;
 