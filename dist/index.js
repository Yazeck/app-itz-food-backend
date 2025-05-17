"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const morgan_1 = __importDefault(require("morgan"));
const cloudinary_1 = require("cloudinary");
const restauranteRoutes_1 = __importDefault(require("./routes/restauranteRoutes"));
const app = (0, express_1.default)();
mongoose_1.default.connect(process.env.DB_CONNECTION_STRING)
    .then(() => {
    console.log("✅ Base de datos conectada");
});
console.log("🧪 CLOUDINARY VARS:", {
    name: process.env.CLOUDINARY_CLOUD_NAME,
    key: process.env.CLOUDINARY_API_KEY,
    secret: process.env.CLOUDINARY_API_SECRET
});
//CONFIGURACION DE CLOUDINARY
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
// 🌍 Configuración robusta de CORS
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            'http://localhost:5173',
            'https://app-itz-food-frontend-85a1.onrender.com'
        ];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            console.error('CORS bloqueado para:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type']
};
app.use((0, cors_1.default)(corsOptions));
app.options('*', (0, cors_1.default)(corsOptions)); // Preflight
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
// Debug: Imprime headers de autenticación
app.use((req, res, next) => {
    console.log("🌐 Origin:", req.headers.origin);
    console.log("🔐 Auth Header:", req.headers.authorization);
    next();
});
app.get('/health', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send({ message: 'servidor ok' });
}));
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.redirect('/health');
}));
app.use("/api/user", userRoutes_1.default);
app.use("/api/restaurante", restauranteRoutes_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("🚀 App corriendo en el puerto:", PORT);
});
// ⚠️ Captura errores no controlados
app.use((err, req, res, next) => {
    console.error("🔥 Error en servidor:", err.message);
    if (err.message === "Not allowed by CORS") {
        res.status(403).json({ error: "CORS no permitido" });
    }
    else {
        res.status(500).json({ error: err.message });
    }
});
//const router = Router();
//router.post('/', (req: Request, res: Response) => {
//res.json({ mensaje: 'POST en /', body: req.body });
//});
//export default router;
