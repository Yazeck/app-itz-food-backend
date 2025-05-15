// src/index.ts
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import morgan from 'morgan';
import userRoutes from './routes/userRoutes';
import { jwtCheck, jwtParse } from './middleware/auth';

const app = express();

// 📦 Conexión a la base de datos
mongoose.connect(process.env.DB_CONNECTION_STRING as string)
  .then(() => console.log("✅ Base de datos conectada"))
  .catch((err) => console.error("❌ Error de conexión:", err));

// 🌍 Configuración de CORS
const allowedOrigins = [
  'http://localhost:5173',
  'https://app-itz-food-frontend-85a1.onrender.com'
];

const corsOptions: cors.CorsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("❌ CORS bloqueado para:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type']
};

// 🛡️ Middleware de CORS (DEBE IR PRIMERO)
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// 🧩 Middlewares base
app.use(express.json());
app.use(morgan('dev'));

// 🧪 Debug headers
app.use((req, res, next) => {
  console.log("🌐 Origin:", req.headers.origin);
  console.log("🔐 Auth Header:", req.headers.authorization);
  next();
});

// 🩺 Ruta de prueba
app.get('/health', (_req: Request, res: Response) => {
  res.send({ message: 'servidor ok' });
});

app.get('/', (_req: Request, res: Response) => {
  res.redirect('/health');
});

// 👤 Rutas protegidas
app.use("/api/user", jwtCheck, jwtParse, userRoutes);

// ⚠️ Middleware de manejo de errores
app.use(function (err: Error & { status?: number }, _req: Request, res: Response, _next: NextFunction) {
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
