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
exports.jwtParse = exports.jwtCheck = void 0;
const express_oauth2_jwt_bearer_1 = require("express-oauth2-jwt-bearer");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
exports.jwtCheck = (0, express_oauth2_jwt_bearer_1.auth)({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    tokenSigningAlg: 'RS256'
});
const jwtParse = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { authorization } = req.headers;
    //los headers comienzan con una cadena
    //Bearer token, por ejemplo
    //bearer 1234xeslfdkadkns
    //por lo tanto es necesario verificar que la autenticacion comienze
    //con bearer
    if (!authorization || !authorization.startsWith('Bearer ')) {
        console.log("jwtPare -Authorizcion denegada");
        return res.status(401).json({ message: 'autorizacion denegada' });
    } //fin de if authorization
    //obtenemos el token del header
    //Bearer 1234xeslfdkadkñs
    //          [0       1      ]
    //split =["bearer", "1234xeslfdkadkñs"]
    const token = authorization.split(' ')[1];
    try {
        //console.log("jwtParse - analizando token");
        //analizamos el token para validar que sea correcto
        //decoded decodifica el token dividiendolo en partes
        const decoded = jsonwebtoken_1.default.decode(token);
        //el elemento sub del token contiene el Id del usuario
        //que inicio sesio en la api auth0
        const auth0 = decoded.sub;
        //comprobamos que exista el usuario en la base de datos
        const user = yield userModel_1.default.findOne({ auth0Id: auth0 });
        if (!user) {
            console.log("jwtParse - !usuario find autorizacion denegada");
            return res.status(401).json({ message: 'usuario no encontrado' });
        }
        req.auth0Id = auth0;
        req.userId = user._id.toString();
        console.log("jwtParse - autorizacion consedida");
        next();
    }
    catch (error) {
        console.log("jwtParse - error al decodificar el token");
        return res.status(401).json({ message: 'token no valido' });
    } //fin de try-catch
}); //fin del jwtParse
exports.jwtParse = jwtParse;
