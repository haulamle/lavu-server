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
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("./src/routers/user"));
const storage_1 = __importDefault(require("./src/routers/storage"));
const supplier_1 = __importDefault(require("./src/routers/supplier"));
const productRouter_1 = __importDefault(require("./src/routers/productRouter"));
const cors_1 = __importDefault(require("cors"));
const verifyToken_1 = require("./src/middlewares/verifyToken");
dotenv_1.default.config();
const app = (0, express_1.default)();
const dbUrl = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@kan-ban.ugbyo.mongodb.net/?retryWrites=true&w=majority&appName=kan-ban`;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/auth", user_1.default);
app.use(verifyToken_1.verifyToken);
app.use("/storage", storage_1.default);
app.use("/supplier", supplier_1.default);
app.use("/products", productRouter_1.default);
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(dbUrl);
        console.log("Connect to db successfully");
    }
    catch (error) {
        console.log("Can not connect to database", error);
    }
});
connectDB()
    .then(() => {
    app.listen(process.env.PORT, () => {
        console.log("Server is running on port " + process.env.PORT);
    });
})
    .catch((error) => {
    console.log("Can not connect to database", error);
});
//# sourceMappingURL=index.js.map