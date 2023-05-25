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
exports.checkJwt = void 0;
const auth_1 = __importDefault(require("../models/auth"));
const globals_1 = __importDefault(require("../utils/globals"));
const helper_1 = __importDefault(require("../utils/helper"));
const name = 'sessions';
const checkJwt = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    helper_1.default.initTime();
    req.body.user = 0;
    req.body.token = '';
    try {
        const jwtByUser = req.headers.authorization || '';
        const jwt = jwtByUser.split(' ').pop(); // 11111
        console.log('Componente ' + name + ': checkJwt: jwt ─> ', jwt);
        console.log('Componente ' + name + ': checkJwt: time ─> ', helper_1.default.calcLapse());
        if (jwt === undefined || jwt === '') {
            globals_1.default.updateResponse(400, 'Empty token', 'Empty token', helper_1.default.basename(`{__filename}`), 'checkJwt');
            // return res.status(Globals.getStatus()).json(Globals.httpResponse());
            req.body.token = '';
            req.body.tokenValidate = 'lack';
            req.body.tokenValidateMsg = 'Token not found in request';
            req.body.user = 0;
            globals_1.default.dataApiRequest = Object.assign(Object.assign({}, globals_1.default.dataApiRequest), req.body);
            // console.log('checkJwt: Globals.apiRequest -> ', Globals.apiRequest);
            helper_1.default.writeDebug('checkJwt: Globals.apiRequest -> ', globals_1.default.apiRequest);
            next();
        }
        else {
            const auth = new auth_1.default();
            const validate = yield auth.validateTokenJwt(jwt);
            if (validate.verify) {
                if (validate.verify === 'expired') {
                    // console.log('token_exp_user validate expired: -------------> ', validate.payload.data.id_user);
                    console.log('token_exp_user validate expired: -------------> ', validate.payload.data.id_user);
                    req.body.token = jwt;
                    req.body.tokenValidate = 'expired';
                    req.body.tokenValidateMsg = 'Expired token';
                    req.body.user = validate.payload.data.id_user;
                    req.body.exp = validate.payload.exp;
                }
                else {
                    // console.log('token_exp_user validate: -------------> ', validate.payload.data.id_user);
                    req.body.token = jwt;
                    req.body.tokenValidate = 'valid';
                    req.body.tokenValidateMsg = 'Valid token';
                    req.body.user = validate.payload.data.id_user;
                    req.body.exp = validate.payload.exp;
                }
                globals_1.default.dataApiRequest = Object.assign(Object.assign({}, globals_1.default.dataApiRequest), req.body);
                helper_1.default.writeDebug('checkJwt: Globals.apiRequest -> ', globals_1.default.apiRequest);
                // console.log('checkJwt: Globals.apiRequest -> ', Globals.apiRequest);
                next();
            }
            else {
                // console.log('token_exp_user !validate.verify: -------------> ', validate);
                globals_1.default.updateResponse(400, 'Invalid token', 'Token not was able', helper_1.default.basename(`${__filename}`), 'checkJwt');
                return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
            }
        }
    }
    catch (e) {
        console.log({ e });
        globals_1.default.updateResponse(400, e.message, 'SESSION_NO_VALID', helper_1.default.basename(`${__filename}`), 'checkJwt');
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
});
exports.checkJwt = checkJwt;
