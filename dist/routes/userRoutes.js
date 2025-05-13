"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
router.post('/', auth_1.jwtCheck, userController_1.createUser);
router.post('/', auth_1.jwtCheck, auth_1.jwtParse, userController_1.updateUser, validation_1.validateUserRequest);
router.put('/', auth_1.jwtCheck, auth_1.jwtParse, validation_1.validateUserRequest, userController_1.updateUser);
router.get('/', auth_1.jwtCheck, auth_1.jwtParse, userController_1.getUser);
exports.default = router;
