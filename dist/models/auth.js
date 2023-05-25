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
const config_1 = require("../config/config");
const jsonwebtoken_1 = require("jsonwebtoken");
const bcryptjs_1 = require("bcryptjs");
const globals_1 = __importDefault(require("../utils/globals"));
const helper_1 = __importDefault(require("../utils/helper"));
const user_1 = __importDefault(require("./user"));
const asoc_1 = __importDefault(require("./asoc"));
const artic_1 = __importDefault(require("./artic"));
class Auth extends user_1.default {
    constructor() {
        // Helper::writeLog("Auth", '__construct');
        super();
        this.className = 'Auth';
        this.swapTwo = (data) => {
            let str = data.split('');
            var temp = str[3];
            str[3] = str[7];
            str[7] = temp;
            return str.join('');
        };
        this.checkToken = (module, token, id, date_updated) => __awaiter(this, void 0, void 0, function* () {
            const resp = { id: 0, token: token, result: 'invalid', msg: '' };
            let response = null;
            helper_1.default.writeDebug('checkToken, module: ', module);
            helper_1.default.writeDebug('checkToken, token: ', token);
            helper_1.default.writeDebug('checkToken, id: ', id);
            helper_1.default.writeDebug('checkToken, date_updated: ', date_updated);
            try {
                console.log('Componente ' + this.className + ': checkToken: token ─> ', token);
                if (token === undefined || token === '') {
                    globals_1.default.updateResponse(400, 'Empty token', 'Empty token', helper_1.default.basename(`{__filename}`), 'checkToken');
                    console.log('Componente ' + this.className + ': checkToken: token ─> ', token);
                    // return res.status(Globals.getStatus()).json(Globals.httpResponse());
                }
                else {
                    const auth = new Auth();
                    const validate = yield auth.validateTokenJwt(token);
                    if (validate.verify) {
                        if (validate.verify === 'expired') {
                            console.log('token_exp_user validate expired: -------------> ', validate.payload.data.id_user);
                            resp.id = validate.payload.data.id_user;
                            resp.result = 'expired';
                            resp.msg = 'Expired token';
                            return resp;
                        }
                        else {
                            resp.id = validate.payload.data.id_user;
                            resp.result = 'Invalid';
                            console.log('token_exp_user validate: -------------> ', validate.payload.data.id_user);
                            const auth = new Auth();
                            auth.id_user = validate.payload.data.id_user;
                            response = yield auth.getDataUserById();
                            if (response.message !== 'success') {
                                resp.msg = response.message;
                                return resp;
                            }
                            else if (response.num_records !== 1) {
                                resp.msg = 'User/password not match';
                                return resp;
                            }
                            else if (auth.token_user !== token) {
                                resp.msg = 'Token not match';
                                return resp;
                            }
                            helper_1.default.writeDebug('checkToken: module', module);
                            if (module === 'users') {
                                const user = new user_1.default();
                                user.id_user = id;
                                response = yield user.getDataUserById();
                                if (response.message !== 'success') {
                                    resp.msg = response.message;
                                    return resp;
                                }
                                else if (response.num_records !== 1) {
                                    resp.msg = 'User/password not match';
                                    return resp;
                                }
                                else if (user.date_updated_user !== date_updated) {
                                    helper_1.default.writeDebug('Record modified by another user', user.date_updated_user);
                                    helper_1.default.writeDebug('Record modified by another user', date_updated);
                                    resp.msg = 'Record modified by another user. Refresh it, please. Logout and login again.';
                                    return resp;
                                }
                                if (user.id_user === auth.id_user) {
                                    helper_1.default.writeDebug('user modifies his own avatar', '');
                                    // user modifies his own avatar
                                }
                                else if (auth.profile_user === 'superadmin') {
                                    // power
                                }
                                else if (auth.profile_user === 'admin' && auth.id_asociation_user === user.id_asociation_user) {
                                    // partial power
                                }
                                else {
                                    resp.msg = 'User not authorized to modify avatar';
                                    return resp;
                                }
                            }
                            else if (module === 'asociations') {
                                const asoc = new asoc_1.default();
                                asoc.id_asociation = id;
                                response = yield asoc.getAsociationById();
                                if (response.message !== 'success') {
                                    resp.msg = response.message;
                                    return resp;
                                }
                                else if (response.num_records !== 1) {
                                    resp.msg = 'User/password not match';
                                    return resp;
                                }
                                else if (asoc.date_updated_asociation !== date_updated) {
                                    helper_1.default.writeDebug('Record modified by another user, asoc.date_updated_asociation: ', asoc.date_updated_asociation);
                                    helper_1.default.writeDebug('Record modified by another user, date_updated: ', date_updated);
                                    resp.msg = 'Record modified by another user. Refresh it, please. Logout and login again.';
                                    return resp;
                                }
                                if (auth.profile_user === 'superadmin') {
                                    // power
                                }
                                else if (auth.profile_user === 'admin' && auth.id_asociation_user === asoc.id_asociation) {
                                    // partial power
                                }
                                else {
                                    resp.msg = 'User not authorized to modify logo';
                                    return resp;
                                }
                            }
                            else if (module === 'articles') {
                                const article = new artic_1.default();
                                article.id_article = id;
                                response = yield article.getArticleById();
                                if (response.message !== 'success') {
                                    resp.msg = response.message;
                                    return resp;
                                }
                                else if (article.date_updated_article !== date_updated) {
                                    helper_1.default.writeDebug('Record modified by another user', article.date_updated_article);
                                    helper_1.default.writeDebug('Record modified by another user', date_updated);
                                    resp.msg = 'Record modified by another user. Refresh it, please.';
                                    return resp;
                                }
                                if (auth.profile_user === 'superadmin' && article.id_asociation_article === parseInt('9'.repeat(9))) {
                                    // power
                                }
                                else if (['admin', 'editor'].includes(auth.profile_user) && article.id_asociation_article === auth.id_asociation_user) {
                                    // partial power
                                }
                                else {
                                    resp.msg = 'User not authorized to modify images';
                                    return resp;
                                }
                            }
                            else {
                                resp.msg = 'User not authorized to modify images.';
                                return resp;
                            }
                            resp.result = 'valid';
                        }
                    }
                    else {
                        console.log('token_exp_user !validate.verify: -------------> ', validate);
                        resp.msg = 'Token not was able';
                    }
                    return resp;
                }
            }
            catch (e) {
                console.log({ e });
                resp.result = e.message;
                return resp;
            }
        });
        // console.log('Componente ' + this.className + ': constructor:  ─> ');
    }
    createTokenJwt() {
        return __awaiter(this, void 0, void 0, function* () {
            const hours = 2;
            const minuts = 0;
            const seconds = 0;
            const expiredTime = (hours * 60 + minuts) * 60 + seconds; // (hours * 60 + minuts) * 60 + seconds =  6 hours
            console.log('Componente Auth: createTokenJwt: expiredTime ─> ', expiredTime);
            const payload = {
                iss: 'localhost',
                aud: 'localhost',
                // exp: this.token_exp_user, // 10'
                data: {
                    id_user: this.id_user,
                },
            };
            const now1 = Math.round(new Date().getTime() / 1000);
            console.log('Componente Auth: createTokenJwt: now1 ─> ', now1);
            // const jwt = sign(payload, MAGIC_SEED, {
            let jwt = yield (0, jsonwebtoken_1.sign)(payload, config_1.MAGIC_SEED, {
                // algorithm: 'RS256',
                expiresIn: expiredTime,
            });
            const validate = yield this.validateTokenJwt(this.swapTwo(jwt));
            console.log('Componente Auth: createTokenJwt: validate.payload ─> ', validate.payload);
            this.token_exp_user = validate.payload.exp;
            const now = Math.round(new Date().getTime() / 1000);
            // this.token_exp_user += now;
            console.log('Componente Auth: createTokenJwt: this.token_exp_user ─> ', this.token_exp_user);
            console.log('Componente Auth: createTokenJwt: now2 ─> ', now);
            console.log('Componente Auth: createTokenJwt: expiredTime + now ─> ', expiredTime + now);
            jwt = this.swapTwo(jwt);
            // console.log('Componente Auth: createTokenJwt: jwt swap ─> ', jwt);
            return jwt;
        });
    }
    validateTokenJwt(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                token = this.swapTwo(token);
                const res = yield (0, jsonwebtoken_1.verify)(token, config_1.MAGIC_SEED, (err, decoded) => {
                    if (err) {
                        switch (err.name) {
                            case 'TokenExpiredError':
                                // console.log('Componente Auth: validateTokenJwt: verify err ─> ', err.message);
                                const decoded = (0, jsonwebtoken_1.decode)(token, { complete: true });
                                // console.log('Componente Auth: validateTokenJwt: decoded ─> ', decoded);
                                // var decoded = decode(token, { complete: true });
                                // console.log(decoded!.header);
                                // console.log(decoded!.payload);
                                return { verify: 'expired', payload: decoded.payload };
                                break;
                            case 'JsonWebTokenError':
                                console.log('Componente Auth: validateTokenJwt: verify err JsonWebTokenError ─> ', err.message);
                                break;
                            case 'NotBeforeError':
                                console.log('Componente Auth: validateTokenJwt: verify err ─> NotBeforeError ', err.message);
                                break;
                            default:
                                console.log('Componente Auth: validateTokenJwt: verify err ─> default ', err.message);
                                break;
                        }
                        globals_1.default.updateResponse(401, err.message, err.message, helper_1.default.basename(`${__filename}`), 'validateTokenJwt');
                        return { verify: false, payload: err.message };
                    }
                    // console.log('Componente Auth: validateTokenJwt: decoded ok ─> ', decoded);
                    helper_1.default.writeDebug('validateTokenJwt: data', decoded);
                    globals_1.default.updateResponse(200, '', 'Token ok', helper_1.default.basename(`${__filename}`), 'validateTokenJwt', decoded);
                    return { verify: true, payload: decoded };
                });
                // console.log('Componente Auth: validateTokenJwt: res2 ─> ', res);
                return res;
            }
            catch (error) {
                console.log('Componente Auth: validateTokenJwt: default error ─> ', error);
                globals_1.default.updateResponse(401, error, error, helper_1.default.basename(`${__filename}`), 'validateTokenJwt');
                return { verify: false, payload: null };
            }
        });
    }
    validatePassword(pass, passHash) {
        return __awaiter(this, void 0, void 0, function* () {
            const isCorrect = yield (0, bcryptjs_1.compare)(pass, passHash);
            return isCorrect;
        });
    }
    updatePassword() {
        return __awaiter(this, void 0, void 0, function* () {
            let passwordHash = '';
            try {
                // console.log('Componente ' + this.className + ': updatePassword: salt  ─> ', genSaltSync(50));
                const salt = yield (0, bcryptjs_1.genSaltSync)(10);
                passwordHash = yield (0, bcryptjs_1.hashSync)(this.password_user, salt);
                // console.log('Componente ' + this.className + ': updatePassword: passwordHash  ─> ', passwordHash);
            }
            catch (error) {
                console.log('Componente ' + this.className + ': updatePassword: passwordHash error ─> ', error);
            }
            const sql = `UPDATE users
                        SET password_user = ?
                        , token_user = ?
                        , token_exp_user = ?
                        , recover_password_user = ?
                    WHERE id_user = ?`;
            const arrDatos = [passwordHash, this.token_user, this.token_exp_user, this.recover_password_user, this.id_user];
            const resUpdate = yield this.update(sql, arrDatos);
            return resUpdate;
        });
    }
    updateToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `UPDATE users
                    SET token_user = ?
                        , token_exp_user = ?
                        , recover_password_user = ?
                    WHERE id_user = ? `;
            const arrDatos = [this.token_user, this.token_exp_user, this.recover_password_user, this.id_user];
            const resUpdate = yield this.update(sql, arrDatos);
            // console.log('Componente Auth: updateToken: resUpdate ─> ', resUpdate);
            return resUpdate;
        });
    }
}
exports.default = Auth;
