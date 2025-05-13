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
exports.getUser = exports.updateUser = exports.createUser = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //verificar si el usuario ya existe
    // crear usuario si no existe
    //regresar el objeto del usuario al cliente(frontend)
    try {
        const { auth0Id } = req.body;
        const existingUser = yield userModel_1.default.findOne({ auth0Id });
        if (existingUser) {
            return res.status(200).json(existingUser.toObject());
        }
        const newUser = new userModel_1.default(req.body);
        yield newUser.save();
        res.status(201).json(newUser.toObject());
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "error al crear el usuario" });
    }
});
exports.createUser = createUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, address, city, country } = req.body;
        const user = yield userModel_1.default.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "usuario no encontrado" });
        }
        user.name = name;
        user.address = address;
        user.city = city;
        user.country = country;
        yield user.save();
        res.status(200).json(user.toObject());
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "error al actualizar el usuario" });
    }
}); //fin de updateUser
exports.updateUser = updateUser;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        return res.status(200).json(user.toObject());
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'error al obtener el usuario' });
    }
}); //fin de getUser
exports.getUser = getUser;
