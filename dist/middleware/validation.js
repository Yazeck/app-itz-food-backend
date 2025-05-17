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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRestauranteRequest = exports.validateUserRequest = void 0;
const express_validator_1 = require("express-validator");
const handleValidationErrors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}); //fin de handleValidationErrors
exports.validateUserRequest = [
    (0, express_validator_1.body)("name").isString().notEmpty().withMessage("El nombre debe ser String"),
    (0, express_validator_1.body)("address").isString().notEmpty().withMessage("La direccion debe ser String"),
    (0, express_validator_1.body)("city").isString().notEmpty().withMessage("La ciudad debe ser String"),
    (0, express_validator_1.body)("country").isString().notEmpty().withMessage("El pais debe ser String"),
    handleValidationErrors
]; //fin de validateUserRequest
exports.validateRestauranteRequest = [
    (0, express_validator_1.body)("restauranteName").notEmpty().withMessage("El nombre del restaurante es requerido"),
    (0, express_validator_1.body)("city").notEmpty().withMessage("La ciudad es requerida"),
    (0, express_validator_1.body)("country").notEmpty().withMessage("El pais es requerido"),
    (0, express_validator_1.body)("deliveryPrice").notEmpty().withMessage("El precio de entrega es requerido"),
    (0, express_validator_1.body)("estimatedDeliveryTime").isFloat({ min: 0 }).withMessage("El tiempo estimado de entrega es requerido"),
    (0, express_validator_1.body)("cuisines").isArray().withMessage("Los platillos deben ser arreglo")
        .not().isEmpty().withMessage("Los platillos son requeridos"),
    (0, express_validator_1.body)("menuItems").isArray().withMessage("Los platillos deben ser arreglo"),
    (0, express_validator_1.body)("menuItems.*.name").notEmpty().withMessage("El nombre del platillo es requerido"),
    (0, express_validator_1.body)("menuItems.*.price").isFloat({ min: 0 }).withMessage("El precio del platillo es requerido"),
    handleValidationErrors
]; //fin de validateRestauranteRequest
