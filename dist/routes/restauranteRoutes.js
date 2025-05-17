"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const restauranteController_1 = require("../controllers/restauranteController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Configuración de multer: guarda la imagen en memoria (para subirla a Cloudinary)
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB máximo
});
// Ruta protegida para crear restaurante
router.post('/', auth_1.jwtCheck, // Verifica que el token JWT sea válido (Auth0)
auth_1.jwtParse, // Extrae req.userId desde el token
upload.single('imageFile'), // Sube una imagen bajo el campo imageFile
restauranteController_1.createRestaurante // Crea el restaurante en MongoDB y sube imagen a Cloudinary
);
exports.default = router;
