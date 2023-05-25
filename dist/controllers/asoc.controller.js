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
exports.deleteAsociation = exports.update = exports.create = exports.listAll = void 0;
const asoc_1 = __importDefault(require("../models/asoc"));
const auth_1 = __importDefault(require("../models/auth"));
const user_1 = __importDefault(require("../models/user"));
const globals_1 = __importDefault(require("../utils/globals"));
const helper_1 = __importDefault(require("../utils/helper"));
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const config_1 = require("../config/config");
const _name = 'asoc.controler';
const listAll = (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    let response = null;
    console.log('Componente ' + _name + ': :  ─> ');
    console.log('Componente ' + _name + ': listAll: time ─> ', helper_1.default.calcLapse());
    try {
        const auth = new auth_1.default();
        if (req.body.tokenValidate !== 'lack') {
            auth.id_user = req.body.user;
            response = yield auth.getDataUserById();
            if (response.message !== 'success') {
                globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'listAll');
                return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
            }
            else if (response.num_records !== 1) {
                globals_1.default.updateResponse(400, 'Non unique record', 'User/password not match', helper_1.default.basename(`${__filename}`), 'listAll');
                return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
            }
            else if (auth.token_user !== req.body.token) {
                globals_1.default.updateResponse(400, 'Token not match', 'Token not match', helper_1.default.basename(`${__filename}`), 'listAll');
                return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
            }
        }
        let id_asociation_user = 0;
        if (req.body.id_asociation_user) {
            id_asociation_user = parseInt(req.body.id_asociation_user);
        }
        else {
            id_asociation_user = auth.id_asociation_user;
        }
        const asoc = new asoc_1.default();
        if (auth.profile_user === 'superadmin') {
            response = yield asoc.getAllAsociations();
            console.log('listAll');
            if (response.message === 'success') {
                return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
            }
            else {
                globals_1.default.updateResponse(response.status, response.error, response.error, helper_1.default.basename(`${__filename}`), 'listAll');
                return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
                // return res.status(response.status).json({ message: response.error });
            }
        }
        else if (auth.profile_user === 'admin' && auth.id_asociation_user === id_asociation_user) {
            asoc.id_asociation = auth.id_asociation_user;
            response = yield asoc.getAsociationById();
            console.log('listAll by asociation');
            if (response.message === 'success') {
                return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
            }
            else {
                globals_1.default.updateResponse(response.status, response.error, response.error, helper_1.default.basename(`${__filename}`), 'listAll');
                return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
                // return res.status(response.status).json({ message: response.error });
            }
        }
        else {
            response = yield asoc.getListAsociations();
            console.log('listAll asociations');
            console.log('Componente asoc.controller: listAll: time ─> ', helper_1.default.calcLapse());
            if (response.message === 'success') {
                return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
            }
            else {
                globals_1.default.updateResponse(response.status, response.error, response.error, helper_1.default.basename(`${__filename}`), 'listAll');
                return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
                // return res.status(response.status).json({ message: response.error });
            }
        }
    }
    catch (error) {
        console.log('Componente asoc.controller: listAll: error ─> ', error);
        globals_1.default.updateResponse(500, error, 'Something goes wrong: ', helper_1.default.basename(`${__filename}`), 'listAll');
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
});
exports.listAll = listAll;
const create = (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    let response = null;
    try {
        const auth = new auth_1.default();
        auth.id_user = req.body.user;
        response = yield auth.getDataUserById();
        if (response.message !== 'success') {
            globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'create');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        else if (response.num_records !== 1) {
            globals_1.default.updateResponse(400, 'Non unique record', 'User/password not match', helper_1.default.basename(`${__filename}`), 'create');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        else if (auth.token_user !== req.body.token) {
            globals_1.default.updateResponse(400, 'Token not match', 'Token not match', helper_1.default.basename(`${__filename}`), 'create');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        if (auth.profile_user === 'superadmin') {
            // power
        }
        else {
            globals_1.default.updateResponse(400, 'User not authorized to create Asociation', 'User not authorized to create Asociation.', helper_1.default.basename(`${__filename}`), 'create');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        const asoc = new asoc_1.default();
        asoc.email_asociation = req.body.email_asociation;
        const checkUser = yield asoc.findAsociationByEmail();
        if (checkUser) {
            globals_1.default.updateResponse(400, 'There is already an asociation with this email', 'There is already an asociation with this email.', helper_1.default.basename(`${__filename}`), 'create');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        asoc.long_name_asociation = req.body.long_name_asociation;
        asoc.short_name_asociation = req.body.short_name_asociation;
        asoc.email_asociation = req.body.email_asociation;
        asoc.name_contact_asociation = req.body.name_contact_asociation;
        asoc.phone_asociation = req.body.phone_asociation;
        response = yield asoc.createAsociation();
        // console.log('Componente ' + _name + ': create: response  ─> ', response);
        if (response.message !== 'success') {
            globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'create');
            // console.log('Componente ' + _name + ': create: Globals.httpResponse()  ─> ', Globals.httpResponse());
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
            // return res.status(response.status).json({ message: response.error });
        }
        asoc.id_asociation = response.records.id;
        response = yield asoc.getAsociationById();
        if (response.message !== 'success') {
            globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'create');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
    catch (error) {
        console.log('Componente asoc.controller: create: error ─> ', error);
        globals_1.default.updateResponse(500, error, 'Something goes wrong: ', helper_1.default.basename(`${__filename}`), 'create');
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
});
exports.create = create;
const update = (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    let response = null;
    try {
        const auth = new auth_1.default();
        auth.id_user = req.body.user;
        response = yield auth.getDataUserById();
        if (response.message !== 'success') {
            globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'update');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        else if (response.num_records !== 1) {
            globals_1.default.updateResponse(400, 'Non unique record', 'User/password not match', helper_1.default.basename(`${__filename}`), 'update');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        else if (auth.token_user !== req.body.token) {
            globals_1.default.updateResponse(400, 'Token not match', 'Token not match', helper_1.default.basename(`${__filename}`), 'update');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        const asoc = new asoc_1.default();
        asoc.id_asociation = req.body.id_asociation;
        if (auth.profile_user === 'superadmin') {
            // power
        }
        else if (auth.profile_user === 'admin' && auth.id_asociation_user === asoc.id_asociation) {
            // less power by can
        }
        else {
            globals_1.default.updateResponse(400, 'User not authorized to update Asociation', 'User not authorized to update Asociation.', helper_1.default.basename(`${__filename}`), 'update');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        response = yield asoc.getAsociationById();
        if (response.message !== 'success') {
            globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'update');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        else if (response.num_records !== 1) {
            globals_1.default.updateResponse(400, 'Non unique record', 'User/password not match', helper_1.default.basename(`${__filename}`), 'update');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        else if (asoc.date_updated_asociation !== req.body.date_updated_asociation) {
            globals_1.default.updateResponse(400, 'Record modified by another user', 'Record modified by another user. Refresh it, please. Logout and login again.', helper_1.default.basename(`${__filename}`), 'update');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        asoc.id_asociation = req.body.id_asociation;
        asoc.long_name_asociation = req.body.long_name_asociation;
        asoc.short_name_asociation = req.body.short_name_asociation;
        asoc.email_asociation = req.body.email_asociation;
        asoc.name_contact_asociation = req.body.name_contact_asociation;
        asoc.phone_asociation = req.body.phone_asociation;
        asoc.date_updated_asociation = req.body.date_updated_asociation;
        response = yield asoc.updateAsociation();
        if (response.message !== 'success') {
            globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'update');
            // console.log('Componente ' + _name + ': update: Globals.httpResponse()  ─> ', Globals.httpResponse());
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
            // return res.status(response.status).json({ message: response.error });
        }
        else if (response.num_records !== 1) {
            globals_1.default.updateResponse(400, 'Non unique record', 'Asociation not match', helper_1.default.basename(`${__filename}`), 'update');
            // console.log('Componente ' + _name + ': update: Globals.httpResponse()  ─> ', Globals.httpResponse());
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
            // return res.status(response.status).json({ message: response.error });
        }
        response = yield asoc.getAsociationById();
        if (response.message !== 'success') {
            globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'update');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        else if (response.num_records !== 1) {
            globals_1.default.updateResponse(400, 'Non unique record', 'User/password not match', helper_1.default.basename(`${__filename}`), 'update');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
    catch (error) {
        console.log('Componente asoc.controller: update: error ─> ', error);
        globals_1.default.updateResponse(500, error, 'Something goes wrong: ', helper_1.default.basename(`${__filename}`), 'update');
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
});
exports.update = update;
const deleteAsociation = (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    let response = null;
    const data = req.params;
    //{ id_asociation, date_updated_asociation }
    const id_auth = req.body.user;
    try {
        const auth = new auth_1.default();
        auth.id_user = id_auth;
        response = yield auth.getDataUserById();
        if (response.message !== 'success') {
            globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'deleteAsociation');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        else if (response.num_records !== 1) {
            globals_1.default.updateResponse(400, 'Non unique record', 'User/password not match', helper_1.default.basename(`${__filename}`), 'deleteAsociation');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        else if (auth.token_user !== req.body.token) {
            globals_1.default.updateResponse(400, 'Token not match', 'Token not match', helper_1.default.basename(`${__filename}`), 'deleteAsociation');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        if (auth.profile_user === 'superadmin') {
            // power
        }
        else {
            globals_1.default.updateResponse(400, 'User not authorized to delete asociation', 'User not authorized to delete asociation.', helper_1.default.basename(`${__filename}`), 'deleteAsociation');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        const user = new user_1.default();
        user.id_asociation_user = parseInt(data.id_asociation);
        response = yield user.getAllByIdAsociations();
        console.log('getAllByIdAsociations');
        if (response.message !== 'success') {
            globals_1.default.updateResponse(response.status, response.error, response.error, helper_1.default.basename(`${__filename}`), 'deleteAsociation');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        else if (response.num_records !== 0) {
            globals_1.default.updateResponse(400, 'There are users of this asociation', 'There are users of this asociation', helper_1.default.basename(`${__filename}`), 'deleteAsociation');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        const asoc = new asoc_1.default();
        asoc.id_asociation = parseInt(data.id_asociation);
        response = yield asoc.getAsociationById();
        if (response.message !== 'success') {
            globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'deleteAsociation');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        else if (response.num_records !== 1) {
            globals_1.default.updateResponse(400, 'Non unique record', 'User/password not match', helper_1.default.basename(`${__filename}`), 'deleteAsociation');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        else if (asoc.date_updated_asociation !== data.date_updated_asociation) {
            globals_1.default.updateResponse(400, 'Record modified by another user', 'Record modified by another user. Refresh it, please. Logout and login again.', helper_1.default.basename(`${__filename}`), 'deleteAsociation');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        const dir = path_1.default.join(path_1.default.resolve('uploads'), config_1.PREFIX_LOGO + data.id_asociation);
        console.log('Componente ' + _name + ': deleteAsociation: dir ─> ', dir);
        if (fs_extra_1.default.existsSync(dir)) {
            // fs.emptyDirSync(dir);
            fs_extra_1.default.rmSync(dir, { recursive: true, force: true });
        }
        response = yield asoc.deleteAsociation();
        if (response.message !== 'success') {
            globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'deleteAsociation');
            // console.log('Componente ' + _name + ': deleteAsociation: Globals.httpResponse()  ─> ', Globals.httpResponse());
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
            // return res.status(response.status).json({ message: response.error });
        }
        else if (response.num_records !== 1) {
            globals_1.default.updateResponse(400, 'Non unique record', 'Asociation not match', helper_1.default.basename(`${__filename}`), 'deleteAsociation');
            // console.log('Componente ' + _name + ': deleteAsociation: Globals.httpResponse()  ─> ', Globals.httpResponse());
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
            // return res.status(response.status).json({ message: response.error });
        }
        return res.status(200).json(globals_1.default.httpResponse());
    }
    catch (error) {
        console.log('Componente ' + _name + ': deleteAsociation: error ─> ', error);
        globals_1.default.updateResponse(500, error, 'Something goes wrong: ', helper_1.default.basename(`${__filename}`), 'deleteAsociation');
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
});
exports.deleteAsociation = deleteAsociation;
