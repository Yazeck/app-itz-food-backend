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

export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: 'RS256'
});

export const jwtParse = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
const {authorization} = req.headers;
//los headers comienzan con una cadena
//Bearer token, por ejemplo
//bearer 1234xeslfdkadkns
//por lo tanto es necesario verificar que la autenticacion comienze
//con bearer
if(!authorization || !authorization.startsWith('Bearer ' )){
  console.log("jwtPare -Authorizcion denegada")
  return res.sendStatus(401).json({message: 'autorizacion denegada'})
}//fin de if authorization
//obtenemos el token del header
//Bearer 1234xeslfdkadkñs
//          [0       1      ]
//split =["bearer", "1234xeslfdkadkñs"]
const token = authorization.split(' ')[1];
try{
  //console.log("jwtParse - analizando token");
  //analizamos el token para validar que sea correcto
  //decoded decodifica el token dividiendolo en partes
  const decoded =jwt.decode(token) as jwt.JwtPayload;

  //el elemento sub del token contiene el Id del usuario
  //que inicio sesio en la api auth0
  const auth0 = decoded.sub;
  //comprobamos que exista el usuario en la base de datos
  const user = await User.findOne({ auth0Id: auth0 });
  if(!user){
    console.log("jwtParse - !usuario find autorizacion denegada");
    return res.sendStatus(401).json({message: 'usuario no encontrado'})
  }
  req.auth0Id = auth0 as string;
  req.userId = user._id.toString();
  console.log("jwtParse - autorizacion consedida");
  next();

}catch(error){
  console.log("jwtParse - error al decodificar el token");
  return res.sendStatus(401).json({message: 'token no valido'})
}//fin de try-catch
}//fin del jwtParse
