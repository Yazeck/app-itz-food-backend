import express, { Request, Response, Router} from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes';
import morgan from 'morgan';
import { v2 as cloudinary } from 'cloudinary';
import restauranteRoutes from './routes/restauranteRoutes';

const app = express();
mongoose.connect(process.env.DB_CONNECTION_STRING as string)
  .then(() => {
    console.log("✅ Base de datos conectada");
  });

  //CONFIGURACION DE CLOUDINARY
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  })


// 🌍 Configuración robusta de CORS
const corsOptions: cors.CorsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'https://app-itz-food-frontend-85a1.onrender.com'
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error('CORS bloqueado para:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Preflight

app.use(express.json());
app.use(morgan('dev'));

// Debug: Imprime headers de autenticación
app.use((req, res, next) => {
  console.log("🌐 Origin:", req.headers.origin);
  console.log("🔐 Auth Header:", req.headers.authorization);
  next();
});
app.get('/health', async (req: Request, res: Response) => {
  res.send({ message: 'servidor ok' });
});

app.get('/', async (req: Request, res: Response) => {
  res.redirect('/health');
});

app.use("/api/user", userRoutes);
app.use("/api/restaurante", restauranteRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 App corriendo en el puerto:", PORT);
});
// ⚠️ Captura errores no controlados
app.use((err: any, req: Request, res: Response, next: Function) => {
  console.error("🔥 Error en servidor:", err.message);
  if (err.message === "Not allowed by CORS") {
    res.status(403).json({ error: "CORS no permitido" });
  } else {
    res.status(500).json({ error: err.message });
  }
});
//const router = Router();

//router.post('/', (req: Request, res: Response) => {
  //res.json({ mensaje: 'POST en /', body: req.body });
//});

//export default router;