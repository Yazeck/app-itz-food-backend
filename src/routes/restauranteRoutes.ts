import express from 'express';
import multer from 'multer';
import { createRestaurante } from '../controllers/restauranteController';
import { jwtCheck, jwtParse } from '../middleware/auth';

const router = express.Router();

// Configuración de multer: guarda la imagen en memoria (para subirla a Cloudinary)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB máximo
});

// Ruta protegida para crear restaurante
router.post(
  '/',
  jwtCheck,           // Verifica que el token JWT sea válido (Auth0)
  jwtParse,           // Extrae req.userId desde el token
  upload.single('imageFile'), // Sube una imagen bajo el campo imageFile
  createRestaurante   // Crea el restaurante en MongoDB y sube imagen a Cloudinary
);

export default router;
