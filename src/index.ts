
import express, {Request, Response} from 'express';
import cors from 'cors'; 
import 'dotenv/config';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes';
import morgan from 'morgan';

mongoose.connect(process.env.DB_CONNECTION_STRING as string)
.then(()=>{
    console.log("base de datos conectada")
})

const app = express();
app.use(express.json ());
app.use(cors ());
app.use(morgan('dev'));

app.use((req, res, next) => {
    console.log("Auth Header recibido:", req.headers.authorization);
    next();
  });

app.get('/health', async (req: Request, res: Response) => {
  res.send({message: 'servidor ok'});
});

app.get('/', async (req: Request, res: Response) => {
  res.redirect('/health');
})

app.use("/api/user", userRoutes)

const PORT = process.env.PORT || 3000;

app. listen (PORT, ()=>{
console. log ("App corriendo en el puerto: "+ PORT)
})

