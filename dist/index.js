"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const morgan_1 = __importDefault(require("morgan"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const auth_1 = require("./middleware/auth");
const app = (0, express_1.default)();
// 📦 Conexión a la base de datos
mongoose_1.default.connect(process.env.DB_CONNECTION_STRING)
    .then(() => console.log("✅ Base de datos conectada"))
    .catch((err) => console.error("❌ Error de conexión:", err));
// 🌍 Configuración de CORS
const allowedOrigins = [
    'http://localhost:5173',
    'https://app-itz-food-frontend-85a1.onrender.com'
];
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            console.error("❌ CORS bloqueado para:", origin);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type']
};
// 🛡️ Middleware de CORS (DEBE IR PRIMERO)
app.use((0, cors_1.default)(corsOptions));
app.options('*', (0, cors_1.default)(corsOptions));
// 🧩 Middlewares base
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
// 🧪 Debug headers
app.use((req, res, next) => {
    console.log("🌐 Origin:", req.headers.origin);
    console.log("🔐 Auth Header:", req.headers.authorization);
    next();
});
// 🩺 Ruta de prueba
app.get('/health', (_req, res) => {
    res.send({ message: 'servidor ok' });
});
app.get('/', (_req, res) => {
    res.redirect('/health');
});
// 👤 Rutas protegidas
app.use("/api/user", auth_1.jwtCheck, auth_1.jwtParse, userRoutes_1.default);
// ⚠️ Middleware de manejo de errores
app.use(function (err, _req, res, _next) {
    console.error("🔥 Error atrapado en middleware:", err.message);
    if (err.message === "Not allowed by CORS") {
        res.status(403).json({ error: "CORS no permitido" });
        return;
    }
    res.status(err.status || 500).json({
        error: err.message || "Error interno del servidor"
    });
});
// 🚀 Inicio del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
