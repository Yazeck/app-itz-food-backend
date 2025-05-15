import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import morgan from 'morgan';
import userRoutes from './routes/userRoutes';
import { jwtCheck, jwtParse } from './middleware/auth'; // Ajusta según tu estructura

const app = express();

// 📦 Conexión a MongoDB
mongoose.connect(process.env.DB_CONNECTION_STRING as string)
  .then(() => console.log("✅ Base de datos conectada"))
  .catch((err) => console.error("❌ Error de conexión:", err));

// 🌍 Configuración de CORS
const corsOptions: cors.CorsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'https://app-itz-food-frontend-85a1.onrender.com'
    ];
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

// 🛡️ Middleware: CORS DEBE IR PRIMERO
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // preflight

// 🧩 Middlewares básicos
app.use(express.json());
app.use(morgan('dev'));

// 🧪 Debug de autenticación y origen
app.use((req, res, next) => {
  console.log("🌐 Origin:", req.headers.origin);
  console.log("🔐 Auth Header:", req.headers.authorization);
  next();
});

// 🩺 Ruta de prueba
app.get('/health', (req: Request, res: Response) => {
  res.send({ message: 'servidor ok' });
});

app.get('/', (req: Request, res: Response) => {
  res.redirect('/health');
});

// 👤 Rutas protegidas
app.use("/api/user", jwtCheck, jwtParse, userRoutes);

// ❗ Middleware de errores
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("🔥 Error atrapado en middleware:", err.message);

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ error: "CORS no permitido" });
  }

  return res.status(err.status || 500).json({
    error: err.message || "Error interno del servidor"
  });
});

// 🚀 Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
