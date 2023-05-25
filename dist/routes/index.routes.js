"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const fs_1 = require("fs");
const genLog_1 = require("../middleware/genLog");
const router = (0, express_1.Router)();
exports.router = router;
const name = 'index.routes';
const PATH_ROUTER = `${__dirname}`;
// console.log('PATH_ROUTER: ', PATH_ROUTER);
const clearFilenames = (fileName) => {
    // const file = fileName.substring(0, fileName.length - 3);
    const file = fileName.split('.');
    // const ext = file.pop();
    // console.log('ext: ', ext);
    // return file.join('.');
    return { fileRoute: file.join('.'), route: file[0] };
};
(0, fs_1.readdirSync)(PATH_ROUTER)
    .map((fileName) => clearFilenames(fileName))
    .filter((fileName) => fileName.fileRoute !== 'index.routes.ts')
    .map((fileName) => {
    var _a;
    // console.log('Componente ' + name + ': readdirSync: fileName.fileRoute ─> ', `./${fileName.fileRoute}`);
    (_a = `./${fileName.fileRoute}`, Promise.resolve().then(() => __importStar(require(_a)))).then((routerModule) => {
        // console.log('Componente ' + name + ': readdirSync: fileName.route ─> ', `/${fileName.route}`);
        // console.log('Componente ' + name + ': readdirSync: routerModule.router ─> ', routerModule.router);
        router.use(`/${fileName.route}`, genLog_1.genLogMiddleware, routerModule.router);
    });
});
