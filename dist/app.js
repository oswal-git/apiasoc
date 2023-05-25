"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const index_routes_1 = require("./routes/index.routes");
const body_parser_1 = __importDefault(require("body-parser"));
const config_1 = require("./config/config");
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const port = config_1.PORT;
// import cookieParser from 'cookie-parser';
const app = (0, express_1.default)();
// setting up the enviroment
app.set('port', port);
app.use((0, cors_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
// app.use(express.json());
// app.use(cookieParser());
// middlewares
app.use((0, morgan_1.default)('dev'));
// public folders
app.use('/uploads', express_1.default.static(path_1.default.resolve('uploads')));
app.use('/assets', express_1.default.static(path_1.default.resolve('assets')));
// routes
app.use(index_routes_1.router);
// console.log('date 👉️', Helper.getDateTime('YYYY-MM-DD HH:MM:SS.MMM'));
exports.default = app;
