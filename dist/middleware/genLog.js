"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genLogMiddleware = void 0;
const globals_1 = __importDefault(require("../utils/globals"));
const helper_1 = __importDefault(require("../utils/helper"));
const genLogMiddleware = (req, res, next) => {
    helper_1.default.count = 0;
    helper_1.default.key = '';
    globals_1.default.apiRequest = {
        remote_addr: req.connection.remoteAddress || '',
        protocol: req.protocol,
        originalUrl: req.originalUrl,
        host: req.get('host') || '',
        request_uri: req.protocol + '://' + req.get('host') + req.originalUrl,
        date: helper_1.default.getDateTime('YYYY-MM-DD HH:MM:SS'),
        data: Object.assign(Object.assign(Object.assign({}, req.body), req.params), req.query),
    };
    const header = req.headers;
    const userAgent = header['user-agent'];
    helper_1.default.writeDebug('genLogMiddleware: Globals.apiRequest -> ', globals_1.default.apiRequest);
    // console.log('genLogMiddleware: Globals.apiRequest -> ', Globals.apiRequest);
    // console.log('genLogMiddleware: Globals.apiRequest -> ', Globals.apiRequest);
    // console.log('genLogMiddleware: header -> ', header);
    // console.log('genLogMiddleware: userAgent -> ', userAgent);
    // console.log('req.headers.authorization: ', req.headers.authorization);
    // console.log('genLogMiddleware: ', req.body);
    next();
};
exports.genLogMiddleware = genLogMiddleware;
