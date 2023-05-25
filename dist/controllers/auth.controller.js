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
exports.connectedUser = exports.resetPassword = exports.changePassword = exports.profile = exports.register = exports.logout = exports.login = void 0;
const auth_1 = __importDefault(require("../models/auth"));
const asoc_1 = __importDefault(require("../models/asoc"));
const globals_1 = __importDefault(require("../utils/globals"));
const helper_1 = __importDefault(require("../utils/helper"));
const user_1 = __importDefault(require("../models/user"));
const emailer_1 = require("../config/emailer");
// display list of customer
const login = (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const auth = new auth_1.default();
    let response = null;
    auth.email_user = req.body.email_user;
    response = yield auth.getUserByEmail();
    if (response.message !== 'success') {
        globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'login');
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
    else if (response.num_records !== 1) {
        globals_1.default.updateResponse(400, 'Non unique record', 'User/password not match', helper_1.default.basename(`${__filename}`), 'login');
        // console.log('Componente auth.controller: login: Globals.httpResponse()  ─> ', Globals.httpResponse());
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
    const isCorrect = yield auth.validatePassword(req.body.password_user, auth.password_user);
    if (!isCorrect) {
        globals_1.default.updateResponse(400, 'Missmatch password', 'User/password not match', helper_1.default.basename(`${__filename}`), 'login');
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
    // auth.token_exp_user = (hours * 60 + minuts) * 60 + seconds; // (hours * 60 + minuts) * 60 + seconds =  6 hours
    auth.token_user = yield auth.createTokenJwt();
    console.log('token_user:     ------------->     ', auth.token_user);
    console.log('token_exp_user: -------------> +now', auth.token_exp_user);
    response = yield auth.updateToken();
    if (response.message !== 'success') {
        globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'login');
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
    // console.log('Componente auth.controller: login: updateToken  ─> ', response);
    let dataUser = {};
    response = yield auth.getDataUserById();
    if (response.message !== 'success') {
        globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'login');
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
    else if (response.num_records !== 1) {
        globals_1.default.updateResponse(400, 'Non unique record', 'User/password not match', helper_1.default.basename(`${__filename}`), 'login');
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
    dataUser = response.records[0];
    let dataAsoc = {};
    // console.log('Componente auth.controller: login: auth.id_user  ─> ', auth.id_user);
    // console.log('Componente auth.controller: login: auth.id_asociation_user  ─> ', auth.id_asociation_user);
    // console.log('Componente auth.controller: login: auth.profile_user  ─> ', auth.profile_user);
    if (auth.id_asociation_user > 0) {
        const asoc = new asoc_1.default();
        asoc.id_asociation = auth.id_asociation_user;
        response = yield asoc.getAsociationById();
        if (response.message !== 'success') {
            globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'login');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        dataAsoc = response.records[0];
    }
    else if (auth.profile_user !== 'superadmin') {
        globals_1.default.updateResponse(400, 'Missing asociation', 'Missing asociation. Please, contact with the association manager.', helper_1.default.basename(`${__filename}`), 'login');
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
    const result = { data_user: dataUser, data_asoc: dataAsoc };
    globals_1.default.updateResponse(200, '', 'ok', helper_1.default.basename(`${__filename}`), 'login', result);
    return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
});
exports.login = login;
const logout = (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const _name = 'auth.controler';
    let response = null;
    console.log('Componente ' + _name + ': logout: req.body.user ─> ', req.body.user);
    if (req.body.tokenValidate !== 'valid') {
        globals_1.default.updateResponse(400, req.body.tokenValidateMsg, 'Token not was able', helper_1.default.basename(`${__filename}`), 'logout');
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
    try {
        const auth = new auth_1.default();
        auth.id_user = req.body.user;
        response = yield auth.getDataUserById();
        if (response.message !== 'success') {
            globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'logout');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        else if (response.num_records !== 1) {
            globals_1.default.updateResponse(400, 'Non unique record', 'User/password not match', helper_1.default.basename(`${__filename}`), 'logout');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        else if (auth.token_user !== req.body.token) {
            globals_1.default.updateResponse(400, 'Token not match', 'Token not match', helper_1.default.basename(`${__filename}`), 'logout');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        else if (auth.id_user !== req.body.user) {
            globals_1.default.updateResponse(400, 'User not authorized to modify this logout', 'User not authorized to modify this logout.', helper_1.default.basename(`${__filename}`), 'logout');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        auth.id_user = req.body.user;
        auth.token_exp_user = 0;
        auth.token_user = '';
        console.log('logout --->');
        response = yield auth.updateToken();
        if (response.message !== 'success') {
            globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'logout');
            // console.log('Componente ' + _name + ': logout: Globals.httpResponse()  ─> ', Globals.httpResponse());
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
            // return res.status(response.status).json({ message: response.error });
        }
        else if (response.num_records !== 1) {
            globals_1.default.updateResponse(400, 'Non unique record', 'User not match', helper_1.default.basename(`${__filename}`), 'logout');
            // console.log('Componente ' + _name + ': logout: Globals.httpResponse()  ─> ', Globals.httpResponse());
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
            // return res.status(response.status).json({ message: response.error });
        }
        globals_1.default.updateResponse(200, '', 'success', helper_1.default.basename(`${__filename}`), 'logout');
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
    catch (error) {
        // console.log('Componente ' + _name + ': logout: catch error  ─> ', error);
        globals_1.default.updateResponse(500, error, 'Something goes wrong: ', helper_1.default.basename(`${__filename}`), 'logout');
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        // return res.status(500).json({ message: 'Something goes wrong: ' + error });
    }
});
exports.logout = logout;
const register = (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const _name = 'auth.controler';
    let response = null;
    console.log('Componente ' + _name + ': register:  ─> ');
    try {
        const asoc = new asoc_1.default();
        const auth = new auth_1.default();
        auth.email_user = req.body.email_user;
        auth.id_asociation_user = req.body.id_asociation_user;
        const user = new user_1.default();
        user.id_asociation_user = req.body.id_asociation_user;
        const name_asociation_user = req.body.name_asociation_user;
        user.user_name_user = req.body.user_name_user;
        user.email_user = req.body.email_user;
        user.password_user = req.body.password_user;
        user.profile_user = req.body.profile_user;
        user.status_user = req.body.status_user;
        user.name_user = req.body.name_user;
        user.last_name_user = req.body.last_name_user;
        user.phone_user = req.body.phone_user;
        const checkUser = yield user.findUserByEmail();
        if (checkUser) {
            globals_1.default.updateResponse(400, 'There is already a user with this email', 'There is already a user with this email.', helper_1.default.basename(`${__filename}`), 'register');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        if (auth.id_asociation_user > 0) {
            asoc.id_asociation = auth.id_asociation_user;
            response = yield asoc.getAsociationById();
            if (response.message !== 'success') {
                globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'profile');
                return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
            }
            else if (response.num_records === 0) {
                globals_1.default.updateResponse(400, 'The asociation selected not exist', 'The asociation selected not exist.', helper_1.default.basename(`${__filename}`), 'profile');
                return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
            }
            else if (response.num_records > 1) {
                globals_1.default.updateResponse(400, 'Duplicate asociation selected', 'Duplicate asociation selected.', helper_1.default.basename(`${__filename}`), 'profile');
                return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
            }
        }
        else if (name_asociation_user !== '') {
            asoc.email_asociation = user.email_user;
            asoc.long_name_asociation = name_asociation_user;
            asoc.name_contact_asociation = user.name_user + ' ' + user.last_name_user;
            asoc.phone_asociation = user.phone_user;
            response = yield asoc.createAsociation();
            // console.log('Componente ' + _name + ': create: response  ─> ', response);
            if (response.message !== 'success') {
                globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'profile');
                // console.log('Componente ' + _name + ': create: Globals.httpResponse()  ─> ', Globals.httpResponse());
                return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
                // return res.status(response.status).json({ message: response.error });
            }
            user.id_asociation_user = response.records.id;
            user.profile_user = 'admin';
            asoc.id_asociation = response.records.id;
        }
        else {
            globals_1.default.updateResponse(400, 'There is not asociation selected', 'There is not asociation selected.', helper_1.default.basename(`${__filename}`), 'profile');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        // console.log('register --->');
        response = yield user.createProfile();
        // console.log('Componente ' + _name + ': register: response  ─> ', response);
        if (response.message === 'success') {
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        else {
            globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'register');
            // console.log('Componente ' + _name + ': register: Globals.httpResponse()  ─> ', Globals.httpResponse());
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
            // return res.status(response.status).json({ message: response.error });
        }
    }
    catch (error) {
        // console.log('Componente ' + _name + ': register: catch error  ─> ', error);
        globals_1.default.updateResponse(500, error, 'Something goes wrong: ', helper_1.default.basename(`${__filename}`), 'register');
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        // return res.status(500).json({ message: 'Something goes wrong: ' + error });
    }
});
exports.register = register;
const profile = (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const _name = 'auth.controler';
    let response = null;
    console.log('Componente ' + _name + ': profile:  ─> ');
    if (req.body.tokenValidate !== 'valid') {
        globals_1.default.updateResponse(400, req.body.tokenValidateMsg, 'Token not was able', helper_1.default.basename(`${__filename}`), 'profile');
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
    try {
        const auth = new auth_1.default();
        auth.id_user = req.body.user;
        response = yield auth.getDataUserById();
        if (response.message !== 'success') {
            globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'profile');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        else if (response.num_records !== 1) {
            globals_1.default.updateResponse(400, 'Non unique record', 'User/password not match', helper_1.default.basename(`${__filename}`), 'profile');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        else if (auth.date_updated_user !== req.body.date_updated_user) {
            globals_1.default.updateResponse(400, 'Record modified by another user', 'Record modified by another user. Refresh it, please. Logout and login again.', helper_1.default.basename(`${__filename}`), 'profile');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        else if (auth.token_user !== req.body.token) {
            globals_1.default.updateResponse(400, 'Token not match', 'Token not match', helper_1.default.basename(`${__filename}`), 'profile');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        else if (auth.id_user !== req.body.user) {
            globals_1.default.updateResponse(400, 'User not authorized to modify this profile', 'User not authorized to modify this profile.', helper_1.default.basename(`${__filename}`), 'profile');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        auth.id_user = req.body.id_user;
        auth.id_asociation_user = req.body.id_asociation_user;
        auth.user_name_user = req.body.user_name_user;
        auth.name_user = req.body.name_user;
        auth.last_name_user = req.body.last_name_user;
        auth.phone_user = req.body.phone_user;
        auth.date_updated_user = req.body.date_updated_user;
        // console.log('profile --->');
        response = yield auth.updateProfile();
        console.log('Componente ' + _name + ': profile: response  ─> ', response);
        if (response.message !== 'success') {
            globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'profile');
            // console.log('Componente ' + _name + ': profile: Globals.httpResponse()  ─> ', Globals.httpResponse());
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
            // return res.status(response.status).json({ message: response.error });
        }
        else if (response.num_records !== 1) {
            globals_1.default.updateResponse(400, 'Non unique record', 'User not match', helper_1.default.basename(`${__filename}`), 'profile');
            // console.log('Componente ' + _name + ': profile: Globals.httpResponse()  ─> ', Globals.httpResponse());
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
            // return res.status(response.status).json({ message: response.error });
        }
        let dataUser = {};
        response = yield auth.getDataUserById();
        if (response.message === 'success') {
            dataUser = response.records[0];
        }
        else {
            globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'profile');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        let dataAsoc = {};
        if (auth.id_asociation_user > 0) {
            const asoc = new asoc_1.default();
            asoc.id_asociation = auth.id_asociation_user;
            response = yield asoc.getAsociationById();
            if (response.message !== 'success') {
                globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'profile');
                return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
            }
            dataAsoc = response.records[0];
        }
        else if (auth.profile_user !== 'superadmin') {
            globals_1.default.updateResponse(400, 'Missing asociation', 'Missing asociation. Please, contact with the association manager.', helper_1.default.basename(`${__filename}`), 'profile');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        const result = { data_user: dataUser, data_asoc: dataAsoc };
        globals_1.default.updateResponse(200, '', 'ok', helper_1.default.basename(`${__filename}`), 'profile', result);
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
    catch (error) {
        // console.log('Componente ' + _name + ': profile: catch error  ─> ', error);
        globals_1.default.updateResponse(500, error, 'Something goes wrong: ', helper_1.default.basename(`${__filename}`), 'profile');
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        // return res.status(500).json({ message: 'Something goes wrong: ' + error });
    }
});
exports.profile = profile;
const changePassword = (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const _name = 'auth.controler';
    let response = null;
    console.log('Componente ' + _name + ': changePassword: response  ─> ', response);
    const auth = new auth_1.default();
    auth.email_user = req.body.email_user;
    response = yield auth.getUserByEmail();
    if (response.message !== 'success') {
        globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'changePassword');
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
    else if (response.num_records !== 1) {
        globals_1.default.updateResponse(400, 'Non unique record', 'User/password not match', helper_1.default.basename(`${__filename}`), 'changePassword');
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
    else if (auth.token_user !== req.body.token) {
        globals_1.default.updateResponse(400, 'Token not match', 'Token not match', helper_1.default.basename(`${__filename}`), 'changePassword');
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
    else if (auth.id_user !== req.body.user) {
        globals_1.default.updateResponse(400, 'User not authorized to modify password', 'User not authorized to modify password.', helper_1.default.basename(`${__filename}`), 'changePassword');
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
    const isCorrect = yield auth.validatePassword(req.body.password_user, auth.password_user);
    if (!isCorrect) {
        globals_1.default.updateResponse(400, 'Missmatch password', 'User/password not match', helper_1.default.basename(`${__filename}`), 'login');
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
    const now = Math.round(new Date().getTime() / 1000);
    auth.token_exp_user = (2 * 60 + 0) * 60 + 0; // (hours * 60 + minuts) * 60 + seconds =  6 hours
    auth.token_user = yield auth.createTokenJwt();
    auth.token_exp_user += now;
    auth.password_user = req.body.new_password_user;
    auth.recover_password_user = 0;
    response = yield auth.updatePassword();
    if (response.message !== 'success') {
        globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'login');
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
    let dataUser = {};
    let dataAsoc = {};
    response = yield auth.getDataUserById();
    if (response.message === 'success' && response.num_records === 1) {
        dataUser = response.records[0];
    }
    else {
        globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'profile');
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
    if (auth.id_asociation_user > 0) {
        const asoc = new asoc_1.default();
        asoc.id_asociation = auth.id_asociation_user;
        response = yield asoc.getAsociationById();
        if (response.message !== 'success') {
            globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'profile');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        dataAsoc = response.records[0];
    }
    else if (auth.profile_user !== 'superadmin') {
        globals_1.default.updateResponse(400, 'Missing asociation', 'Missing asociation. Please, contact with the association manager.', helper_1.default.basename(`${__filename}`), 'profile');
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
    const result = { data_user: dataUser, data_asoc: dataAsoc };
    globals_1.default.updateResponse(200, '', 'ok', helper_1.default.basename(`${__filename}`), 'profile', result);
    return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
});
exports.changePassword = changePassword;
const resetPassword = (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const auth = new auth_1.default();
    let response = null;
    const data = req.body;
    auth.email_user = data.email_user;
    response = yield auth.getUserByEmail();
    if (response.message !== 'success') {
        globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'resetPassword');
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
    else if (response.num_records !== 1) {
        globals_1.default.updateResponse(400, 'Non unique record', 'User/password not match', helper_1.default.basename(`${__filename}`), 'resetPassword');
        // console.log('Componente auth.controller: resetPassword: Globals.httpResponse()  ─> ', Globals.httpResponse());
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
    auth.password_user = helper_1.default.generatePhrase('resetPassword');
    if (auth.password_user === '') {
        globals_1.default.updateResponse(500, 'Error generating new password', 'Error generating new password', helper_1.default.basename(`${__filename}`), 'resetPassword');
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
    const hours = 0;
    const minuts = 20;
    const seconds = 0;
    auth.token_exp_user = (hours * 60 + minuts) * 60 + seconds; // 20 minutes
    auth.token_user = '';
    auth.recover_password_user = 1;
    response = yield auth.updatePassword();
    if (response.message !== 'success') {
        globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'resetPassword');
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
    const asoc = new asoc_1.default();
    if (auth.id_asociation_user > 0) {
        asoc.id_asociation = auth.id_asociation_user;
        response = yield asoc.getAsociationById();
        if (response.message !== 'success') {
            globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'resetPassword');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        else if (response.num_records === 0) {
            globals_1.default.updateResponse(400, 'The asociation of user not exist', 'The asociation of user not exist.', helper_1.default.basename(`${__filename}`), 'resetPassword');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        else if (response.num_records > 1) {
            globals_1.default.updateResponse(400, 'Duplicate asociation selected', 'Duplicate asociation selected.', helper_1.default.basename(`${__filename}`), 'resetPassword');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
    }
    const subject = 'Your Recovered Password';
    // echo "Please use this password to login " + $new_password + PHP_EOL;
    // let headers = 'MIME-Version: 1.0' + '\r\n';
    // headers += 'Content-type: text/html; charset=iso-8859-1' + '\r\n';
    // headers += 'From: ' + asoc.name_contact_asociation + ' <' + asoc.email_asociation + '>' + '\r\n' + 'CC: ' + 'oswal@workmail.com' + '\r\n';
    const from = '"' + asoc.name_contact_asociation + '" <' + asoc.email_asociation + '>';
    const to = [`"${auth.name_user}" <oswal@workmail.com>`];
    const message = messageMail(asoc.name_contact_asociation, asoc.email_asociation, auth.name_user, auth.last_name_user, auth.password_user);
    response = yield (0, emailer_1.sendMail)(subject, from, to, message);
    // await sendMail();
    console.log('Componente auth.controller: resetPassword: sendMail: response  ─> ', response);
    if (response.status === 'success') {
        globals_1.default.updateResponse(200, '', 'ok', helper_1.default.basename(`${__filename}`), 'resetPassword', response.msg);
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
    else {
        globals_1.default.updateResponse(400, response.msg.response, 'Failed to Recover your password, try again', helper_1.default.basename(`${__filename}`), 'resetPassword');
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
});
exports.resetPassword = resetPassword;
const connectedUser = (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const _name = 'auth.controler';
    let response = null;
    let dataUser = {};
    let dataAsoc = {};
    const auth = new auth_1.default();
    auth.id_user = req.body.user;
    response = yield auth.getDataUserById();
    if (response.message === 'success') {
        dataUser = response.records[0];
    }
    else {
        globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'connectedUser');
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
    if (auth.id_asociation_user > 0) {
        const asoc = new asoc_1.default();
        asoc.id_asociation = auth.id_asociation_user;
        response = yield asoc.getAsociationById();
        if (response.message !== 'success') {
            globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'connectedUser');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        dataAsoc = response.records[0];
    }
    else if (auth.profile_user !== 'superadmin') {
        globals_1.default.updateResponse(400, 'Missing asociation', 'Missing asociation. Please, contact with the association manager.', helper_1.default.basename(`${__filename}`), 'connectedUser');
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
    const result = { data_user: dataUser, data_asoc: dataAsoc };
    globals_1.default.updateResponse(200, '', 'ok', helper_1.default.basename(`${__filename}`), 'connectedUser', result);
    return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
});
exports.connectedUser = connectedUser;
const messageMail = (name_contact_asociation, email_asociation, name_user, last_name_user, new_password) => {
    // <html>
    //     <head>
    //         <title>Recuperación de la contraseña</title>
    //     </head>
    //     <body>
    const message = `
                <h1>Recuperación de la contraseña</h1>

                Hola, ${name_user} ${last_name_user}.<br>
                <br>Ha solicitado un nuevo password.
                <br>Utilize este password <br><br>
                <b>${new_password}</b><br>
                <br> para poder ingresar.<br>
                <br>Si no ha sido usted el que has solicitado el nuevo password, póngase en contacto con su administrador, ${name_contact_asociation}.
                <br>
                <hr>
                <br>
                El administrador<br>
                <i>${name_contact_asociation}</i><br>
                <a href="mailto:${email_asociation}">${email_asociation}</a>
                <br>
    `;
    //     </body>
    // </html>
    return message;
};
