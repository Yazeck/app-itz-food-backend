import {body, validationResult} from "express-validator";
import {Request, Response, NextFunction} from "express";

const handleValidationErrors = async(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    next();
}//fin de handleValidationErrors


export const validateUserRequest = [
    body("name").isString().notEmpty().withMessage("El nombre debe ser String"),

    body("address").isString().notEmpty().withMessage("La direccion debe ser String"),

    body("city").isString().notEmpty().withMessage("La ciudad debe ser String"),

    body("country").isString().notEmpty().withMessage("El pais debe ser String"),

    handleValidationErrors
];//fin de validateUserRequest
export const validateRestauranteRequest = [
    body("restauranteName").notEmpty().withMessage("El nombre del restaurante es requerido"),
    body("city").notEmpty().withMessage("La ciudad es requerida"),
    body("country").notEmpty().withMessage("El pais es requerido"),
    body("deliveryPrice").notEmpty().withMessage("El precio de entrega es requerido"),
    body("estimatedDeliveryTime").isFloat( {min: 0} ).withMessage("El tiempo estimado de entrega es requerido"),
    body("cuisines").isArray().withMessage("Los platillos deben ser arreglo")
    .not().isEmpty().withMessage("Los platillos son requeridos"),
    body("menuItems").isArray().withMessage("Los platillos deben ser arreglo"),
    body("menuItems.*.name").notEmpty().withMessage("El nombre del platillo es requerido"),
    body("menuItems.*.price").isFloat( {min: 0} ).withMessage("El precio del platillo es requerido"),
    handleValidationErrors
];//fin de validateRestauranteRequest
