import { Request, Response } from "express";
import Restaurante from "../models/restauranteModel";
import multer from "multer";
import cloudinary from "cloudinary";
import mongoose from "mongoose";

//funcion para crear un restaurante
export const createRestaurante = async (req: Request, res: Response) => {
    try{
const existinfRestaurante = await Restaurante.findOne({ user: req.userId });
        if(existinfRestaurante){
            res.status (500)
            .json({message: 'el restaurante para este usuario ya existe'})
        }
        //creamos la url del cloudinary para la imagen del restaurante
        const image = req.file as Express.Multer.File;
        //convertimos el objeto de la imagen a un objeto base64
        //para poder almacenarlo como imagen en cloudinary
        const base64Image = Buffer.from(image.buffer).toString('base64');
        const dataUri = "data" + image.mimetype + ";base64," + base64Image;
//almacenamos la imagen en cloudinary
const uploadResponse = await cloudinary.v2.uploader.upload(dataUri);
//creamos el objeto del restaurante
const restaurante = new Restaurante(req.body);
restaurante.imageUrl = uploadResponse.url;
restaurante.user = new mongoose.Types.ObjectId(req.userId);
restaurante.lastUpdated = new Date();
await restaurante.save();
res.status(201).json(restaurante);


    }catch(error){
        console.log(error);
        res.status(500).json({message: "error al crear el restaurante"});
    }
}//fin de createRestaurante

