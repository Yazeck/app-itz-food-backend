import { auth } from "express-oauth2-jwt-bearer";
import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import User from '../models/userModel';

declare global{
  namespace Express {
    interface Request {
      auth0Id: string;
      userId: string;
    }
  }

}

export const jwtParse = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { authorization } = req.headers;

  // Si no hay header o no empieza con Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    console.log("jwtParse - Autorización denegada (no Bearer)");
    return res.status(401).json({ message: 'autorización denegada' });
  }

  // Extraemos token
  const token = authorization.split(' ')[1];

  try {
    const decoded = jwt.decode(token) as jwt.JwtPayload;
    const auth0 = decoded.sub;
    // Buscamos el usuario en DB
    const user = await User.findOne({ auth0Id: auth0 });
    if (!user) {
      console.log("jwtParse - Usuario no encontrado");
      return res.status(401).json({ message: 'usuario no encontrado' });
    }
  req.auth0Id = auth0 as string;
  req.userId  = user._id.toString();
  console.log("jwtParse - Autorización concedida");
  next();
} catch (err) {
  console.log("jwtParse - Error al decodificar el token:", err);
  return res.status(401).json({ message: 'token no válido' });
}
};