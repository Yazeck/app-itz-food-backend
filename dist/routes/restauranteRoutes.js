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
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }
});
// ✅ ¡Aquí agregas los middlewares!
router.post('/', auth_1.jwtCheck, auth_1.jwtParse, upload.single('imageFile'), restauranteController_1.createRestaurante);
exports.default = router;
