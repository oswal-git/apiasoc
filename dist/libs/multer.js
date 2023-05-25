"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const storage = multer_1.default.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        const { title } = req.body;
        console.log('Componente multer.diskStorage: image: title ─> ', title);
        console.log(`${file.fieldname}_${Date.now()}${path_1.default.extname(file.originalname)}`);
        return cb(null, title + '-' + (0, uuid_1.v4)() + path_1.default.extname(file.originalname));
    },
});
exports.default = (0, multer_1.default)({ storage });
