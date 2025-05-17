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
exports.createRestaurante = void 0;
const restauranteModel_1 = __importDefault(require("../models/restauranteModel"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const mongoose_1 = __importDefault(require("mongoose"));
//funcion para crear un restaurante
const createRestaurante = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Body:", req.body);
        console.log("File:", req.file);
        console.log("User ID:", req.userId);
        const existinfRestaurante = yield restauranteModel_1.default.findOne({ user: req.userId });
        if (existinfRestaurante) {
            res.status(500)
                .json({ message: 'el restaurante para este usuario ya existe' });
        }
        //creamos la url del cloudinary para la imagen del restaurante
        const image = req.file;
        //convertimos el objeto de la imagen a un objeto base64
        //para poder almacenarlo como imagen en cloudinary
        const base64Image = Buffer.from(image.buffer).toString('base64');
        //const dataUri = "data" + image.mimetype + ";base64," + base64Image;
        const dataUri = `data:${image.mimetype};base64,${base64Image}`;
        //almacenamos la imagen en cloudinary
        const uploadResponse = yield cloudinary_1.default.v2.uploader.upload(dataUri);
        //creamos el objeto del restaurante
        const restaurante = new restauranteModel_1.default(req.body);
        restaurante.imageUrl = uploadResponse.url;
        restaurante.user = new mongoose_1.default.Types.ObjectId(req.userId);
        restaurante.lastUpdated = new Date();
        yield restaurante.save();
        res.status(201).json(restaurante);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "error al crear el restaurante" });
    }
}); //fin de createRestaurante
exports.createRestaurante = createRestaurante;
