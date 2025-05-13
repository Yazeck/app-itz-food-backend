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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const morgan_1 = __importDefault(require("morgan"));
mongoose_1.default.connect(process.env.DB_CONNECTION_STRING)
    .then(() => {
    console.log("base de datos conectada");
});
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use((req, res, next) => {
    console.log("Auth Header recibido:", req.headers.authorization);
    next();
});
app.get('/health', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send({ message: 'servidor ok' });
}));
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.redirect('/health');
}));
app.use("/api/user", userRoutes_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("App corriendo en el puerto: " + PORT);
});
