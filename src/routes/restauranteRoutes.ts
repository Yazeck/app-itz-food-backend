
 import express from 'express';
import multer from 'multer';
import { createRestaurante } from '../controllers/restauranteController';
import { jwtCheck, jwtParse } from '../middleware/auth';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

// ✅ ¡Aquí agregas los middlewares!
router.post(
  '/',
  jwtCheck,
  jwtParse,
  upload.single('imageFile'),
  createRestaurante
);

export default router;
