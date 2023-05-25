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
exports.deleteUser = exports.update = exports.create = exports.listAll = void 0;
const asoc_1 = __importDefault(require("../models/asoc"));
const auth_1 = __importDefault(require("../models/auth"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const globals_1 = __importDefault(require("../utils/globals"));
const helper_1 = __importDefault(require("../utils/helper"));
const path_1 = __importDefault(require("path"));
const user_1 = __importDefault(require("../models/user"));
// display list of customer
const _name = 'user.controller.ts';
const listAll = (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = new user_1.default();
        const response = yield user.getAllUsers();
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
    catch (error) {
        console.log('Componente user.controller: listAll: error ─> ', error);
        globals_1.default.updateResponse(500, error, 'Something goes wrong: ', helper_1.default.basename(`${__filename}`), 'listAll');
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        // return res.status(500).json({ message: 'Something goes wrong: ' + error });
    }
});
exports.listAll = listAll;
const create = (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const _name = 'user.controler';
    let response = null;
    console.log('Componente ' + _name + ': create:  ─> ');
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
        else if (auth.profile_user === 'admin' && auth.id_asociation_user === req.body.id_asociation_user) {
            // partial power
        }
        else {
            globals_1.default.updateResponse(400, 'User not authorized to create user', 'User not authorized to create user.', helper_1.default.basename(`${__filename}`), 'create');
            return true;
        }
        const user = new user_1.default();
        user.email_user = req.body.email_user;
        const checkUser = yield user.findUserByEmail();
        if (checkUser) {
            globals_1.default.updateResponse(400, 'There is already a user with this email', 'There is already a user with this email.', helper_1.default.basename(`${__filename}`), 'create');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        let asociation_user = 0;
        if (req.body.id_asociation_user > 0) {
            asociation_user = req.body.id_asociation_user;
            const asoc = new asoc_1.default();
            asoc.id_asociation = req.body.id_asociation_user;
            response = yield asoc.getAsociationById();
            if (response.message !== 'success') {
                globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'create');
                return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
            }
            else if (response.num_records === 0) {
                globals_1.default.updateResponse(400, 'The asociation selected not exist', 'The asociation selected not exist.', helper_1.default.basename(`${__filename}`), 'create');
                return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
            }
            else if (response.num_records > 1) {
                globals_1.default.updateResponse(400, 'Duplicate asociation selected', 'Duplicate asociation selected.', helper_1.default.basename(`${__filename}`), 'create');
                return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
            }
        }
        else if (auth.profile_user !== 'superadmin') {
            globals_1.default.updateResponse(400, 'There is not asociation selected', 'There is not asociation selected.', helper_1.default.basename(`${__filename}`), 'create');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        user.id_asociation_user = asociation_user;
        user.user_name_user = req.body.user_name_user;
        user.name_user = req.body.name_user;
        user.last_name_user = req.body.last_name_user;
        user.email_user = req.body.email_user;
        user.password_user = req.body.password_user;
        user.phone_user = req.body.phone_user;
        user.profile_user = req.body.profile_user;
        user.status_user = req.body.status_user;
        // console.log('create --->');
        response = yield user.userCreate();
        // console.log('Componente ' + _name + ': create: response  ─> ', response);
        if (response.message !== 'success') {
            globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'create');
            // console.log('Componente ' + _name + ': create: Globals.httpResponse()  ─> ', Globals.httpResponse());
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
            // return res.status(response.status).json({ message: response.error });
        }
        user.id_user = response.records.id;
        response = yield user.getDataUserById();
        if (response.message === 'success') {
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        else {
            globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'create');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
    }
    catch (error) {
        console.log('Componente user.controller: create: error ─> ', error);
        globals_1.default.updateResponse(500, error, 'Something goes wrong: ', helper_1.default.basename(`${__filename}`), 'create');
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
});
exports.create = create;
const update = (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const _name = 'user.controler';
    let response = null;
    console.log('Componente ' + _name + ': update:  ─> ');
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
        const user = new user_1.default();
        user.id_user = req.body.id_user;
        response = yield user.getDataUserById();
        if (response.message !== 'success') {
            globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'update');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        else if (response.num_records !== 1) {
            globals_1.default.updateResponse(400, 'Non unique record', 'User/password not match', helper_1.default.basename(`${__filename}`), 'update');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        else if (user.date_updated_user !== req.body.date_updated_user) {
            globals_1.default.updateResponse(400, 'Record modified by another user', 'Record modified by another user. Refresh it, please. Logout and login again.', helper_1.default.basename(`${__filename}`), 'update');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        user.id_user = req.body.id_user;
        user.id_asociation_user = req.body.id_asociation_user;
        user.user_name_user = req.body.user_name_user;
        user.name_user = req.body.name_user;
        user.last_name_user = req.body.last_name_user;
        user.profile_user = req.body.profile_user;
        user.status_user = req.body.status_user;
        user.phone_user = req.body.phone_user;
        user.date_updated_user = req.body.date_updated_user;
        if (auth.profile_user === 'superadmin') {
            // power
        }
        else if (auth.profile_user === 'admin' && auth.id_asociation_user === req.body.id_asociation_user) {
            if (user.profile_user === 'superadmin') {
                user.profile_user = 'asociado';
            }
        }
        else {
            globals_1.default.updateResponse(400, 'User not authorized to create user', 'User not authorized to create user.', helper_1.default.basename(`${__filename}`), 'update');
            return true;
        }
        response = yield user.updateUser();
        if (response.message !== 'success') {
            globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'update');
            // console.log('Componente ' + _name + ': update: Globals.httpResponse()  ─> ', Globals.httpResponse());
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
            // return res.status(response.status).json({ message: response.error });
        }
        else if (response.num_records !== 1) {
            globals_1.default.updateResponse(400, 'Non unique record', 'User not match', helper_1.default.basename(`${__filename}`), 'update');
            // console.log('Componente ' + _name + ': update: Globals.httpResponse()  ─> ', Globals.httpResponse());
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
            // return res.status(response.status).json({ message: response.error });
        }
        let dataUser = {};
        response = yield user.getDataUserById();
        if (response.message === 'success') {
            dataUser = response.records[0];
        }
        else {
            globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'update');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        let dataAsoc = {};
        if (user.id_asociation_user > 0) {
            const asoc = new asoc_1.default();
            asoc.id_asociation = user.id_asociation_user;
            response = yield asoc.getAsociationById();
            if (response.message !== 'success') {
                globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'update');
                return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
            }
            dataAsoc = response.records[0];
        }
        else if (user.profile_user !== 'superadmin') {
            globals_1.default.updateResponse(400, 'Missing asociation', 'Missing asociation. Please, contact with the association manager.', helper_1.default.basename(`${__filename}`), 'update');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        const result = { data_user: dataUser, data_asoc: dataAsoc };
        globals_1.default.updateResponse(200, '', 'ok', helper_1.default.basename(`${__filename}`), 'update', result);
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
    catch (error) {
        console.log('Componente user.controller: update: error ─> ', error);
        globals_1.default.updateResponse(500, error, 'Something goes wrong: ', helper_1.default.basename(`${__filename}`), 'update');
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
});
exports.update = update;
const deleteUser = (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    let response = null;
    const data = req.params;
    //{ id_user, date_updated_user }
    const id_auth = req.body.user;
    try {
        const auth = new auth_1.default();
        auth.id_user = id_auth;
        response = yield auth.getDataUserById();
        if (response.message !== 'success') {
            globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'remove');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        else if (response.num_records !== 1) {
            globals_1.default.updateResponse(400, 'Non unique record', 'User/password not match', helper_1.default.basename(`${__filename}`), 'remove');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        else if (auth.token_user !== req.body.token) {
            globals_1.default.updateResponse(400, 'Token not match', 'Token not match', helper_1.default.basename(`${__filename}`), 'remove');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        const user = new user_1.default();
        user.id_user = parseInt(data.id_user);
        response = yield user.getDataUserById();
        if (response.message !== 'success') {
            globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'remove');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        else if (response.num_records !== 1) {
            globals_1.default.updateResponse(400, 'Non unique record', 'User/password not match', helper_1.default.basename(`${__filename}`), 'remove');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        else if (user.date_updated_user !== data.date_updated_user) {
            globals_1.default.updateResponse(400, 'Record modified by another user', 'Record modified by another user. Refresh it, please. Logout and login again.', helper_1.default.basename(`${__filename}`), 'remove');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        if (auth.profile_user === 'superadmin') {
            // power
        }
        else if (auth.profile_user === 'admin' && auth.id_asociation_user === user.id_asociation_user) {
            // partial power
        }
        else {
            globals_1.default.updateResponse(400, 'User not authorized to delete user', 'User not authorized to delete user.', helper_1.default.basename(`${__filename}`), 'remove');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        const now = Math.round(new Date().getTime() / 1000);
        if (user.token_user !== '' && user.token_exp_user > now) {
            globals_1.default.updateResponse(400, 'User to delete has an active session', 'User to delete has an active session', helper_1.default.basename(`${__filename}`), 'remove');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        if (user.avatar_user !== '') {
            const upPos = user.avatar_user.indexOf('avatars');
            console.log(upPos);
            if (upPos > -1) {
                const restUrl = user.avatar_user.substring(upPos);
                const dir = path_1.default.join(path_1.default.resolve('uploads'), restUrl);
                const absolutePath = path_1.default.dirname(dir);
                if (fs_extra_1.default.existsSync(absolutePath)) {
                    console.log('delete: ', absolutePath);
                    fs_extra_1.default.rmSync(absolutePath, { recursive: true, force: true });
                    // fs.emptyDirSync(absolutePath);
                }
            }
        }
        response = yield user.deleteUser();
        if (response.message !== 'success') {
            globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'remove');
            // console.log('Componente ' + _name + ': remove: Globals.httpResponse()  ─> ', Globals.httpResponse());
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
            // return res.status(response.status).json({ message: response.error });
        }
        else if (response.num_records !== 1) {
            globals_1.default.updateResponse(400, 'Non unique record', 'User not match', helper_1.default.basename(`${__filename}`), 'remove');
            // console.log('Componente ' + _name + ': remove: Globals.httpResponse()  ─> ', Globals.httpResponse());
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
            // return res.status(response.status).json({ message: response.error });
        }
        return res.status(200).json(globals_1.default.httpResponse());
    }
    catch (error) {
        console.log('Componente user.controller: remove: error ─> ', error);
        globals_1.default.updateResponse(500, error, 'Something goes wrong: ', helper_1.default.basename(`${__filename}`), 'remove');
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
});
exports.deleteUser = deleteUser;
// export const uploadAvatar = async (req: Request, res: Response) => {
//     let nameFile = '';
//     let response: any = null;
//     let prefix = '';
//     console.log('Componente ' + _name + ': uploadAvatar ─> ');
//     const auth = new Auth();
//     try {
//         const storage = multer.diskStorage({
//             destination: async (req, file, cb) => {
//                 Globals.dataApiRequest = { ...Globals.dataApiRequest, ...req.body, ...req.params, ...req.query, ...req.file };
//                 Helper.writeDebug('uploadAvatar: diskStorage Globals.apiRequest -> ', Globals.apiRequest);
//                 // console.log('uploadAvatar: diskStorage Globals.apiRequest -> ', Globals.apiRequest);
//                 console.log('Componente user.controler: uploadAvatar: jwt ─> ', req.body.token);
//                 const resp: any = await auth.checkToken(req.body.token, req.body.user_id, req.body.date_updated);
//                 if (resp.result !== 'valid') {
//                     cb(new Error(resp.msg), '');
//                 } else {
//                     prefix = req.body.module === 'users' ? PREFIX_AVATAR : req.body.module === 'asociations' ? PREFIX_LOGO : PREFIX_ARTICLES;
//                     // console.log('Componente ' + _name + ': uploadAvatar: storage prefix 1─> ', prefix);
//                     prefix =
//                         prefix + (req.body.module === 'users' ? resp.id : req.body.module === 'asociations' ? req.body.asoc_id : req.body.article_id);
//                     // console.log('Componente ' + _name + ': uploadAvatar: storage prefix 2─> ', prefix);
//                     const dir = path.join(path.resolve('uploads'), prefix);
//                     if (fs.existsSync(dir)) {
//                         fs.emptyDirSync(dir);
//                     }
//                     fs.ensureDir(dir, (err) => {
//                         if (err) console.log('ensureDir err: ', err); // => null
//                         // dir has now been created, including the directory it is to be placed in
//                     });
//                     console.log('Componente ' + _name + ': uploadAvatar: storage dir ─> ', dir);
//                     cb(null, dir);
//                 }
//             },
//             filename: (req: any, file: any, cb: any) => {
//                 nameFile = `${req.body.user_name}_${v4()}${path.extname(file.originalname)}`;
//                 console.log('Componente user.Controller: uploadAvatar: storage: nameFile ─> ', nameFile);
//                 cb(null, nameFile);
//             },
//         });
//         const upload = multer({ storage: storage }).single('file');
//         try {
//             let error = '';
//             upload(req, res, async (err: any) => {
//                 if (err instanceof multer.MulterError) {
//                     // A Multer error occurred when uploading.
//                     console.log('Componente user.Controller: uploadAvatar: MulterError ─> ', err);
//                     error = err.toString();
//                     return res.status(500).json({ message: 'Something is wrong: ' + error });
//                 } else if (err) {
//                     // An unknown error occurred when uploading.
//                     console.log('Componente user.Controller: uploadAvatar: upload err ─> ', err.message);
//                     error = err;
//                     Globals.updateResponse(400, err.message, err.message, Helper.basename(`${__filename}`), 'update');
//                     return res.status(Globals.getStatus()).json(Globals.httpResponse());
//                 } else {
//                     Globals.dataApiRequest = { ...Globals.dataApiRequest, ...req.body, ...req.params, ...req.query, ...req.file };
//                     Helper.writeDebug('uploadAvatar: upload Globals.apiRequest -> ', Globals.apiRequest);
//                     Helper.writeDebug('uploadAvatar: upload req.file -> ', req.file);
//                     // console.log('uploadAvatar: upload Globals.apiRequest -> ', Globals.apiRequest);
//                     console.log('Componente user.Controller: uploadAvatar: upload req.file ─> ', req.file);
//                     console.log('res');
//                     const image = BASE_URL + ':' + PORT + URL_SEPARATOR + 'uploads' + URL_SEPARATOR + prefix + URL_SEPARATOR + req.file?.filename;
//                     console.log('Componente ' + _name + ': uploadAvatar: upload image ─> ', image);
//                     if (req.body.module === 'users') {
//                         const user = new User();
//                         user.avatar_user = image;
//                         user.id_user = req.body.user_id;
//                         user.date_updated_user = req.body.date_updated;
//                         response = await user.updateAvatar();
//                         if (response.message !== 'success') {
//                             Globals.updateResponse(
//                                 response.status,
//                                 response.message,
//                                 response.message,
//                                 Helper.basename(`${__filename}`),
//                                 'uploadAvatar'
//                             );
//                             // console.log('Componente ' + _name + ': uploadAvatar: Globals.httpResponse()  ─> ', Globals.httpResponse());
//                             return res.status(Globals.getStatus()).json(Globals.httpResponse());
//                             // return res.status(response.status).json({ message: response.error });
//                         } else if (response.num_records !== 1) {
//                             Globals.updateResponse(400, 'Non unique record', 'User not match', Helper.basename(`${__filename}`), 'uploadAvatar');
//                             // console.log('Componente ' + _name + ': uploadAvatar: Globals.httpResponse()  ─> ', Globals.httpResponse());
//                             return res.status(Globals.getStatus()).json(Globals.httpResponse());
//                             // return res.status(response.status).json({ message: response.error });
//                         }
//                         response = await user.getDataUserById();
//                         if (response.message === 'success') {
//                             return res.status(Globals.getStatus()).json(Globals.httpResponse());
//                         } else {
//                             Globals.updateResponse(
//                                 response.status,
//                                 response.message,
//                                 response.message,
//                                 Helper.basename(`${__filename}`),
//                                 'uploadAvatar'
//                             );
//                             return res.status(Globals.getStatus()).json(Globals.httpResponse());
//                         }
//                     } else if (req.body.module === 'asociations') {
//                         console.log('Componente ' + _name + ': uploadAvatar: image ─> ');
//                         const asoc = new Asoc();
//                         asoc.logo_asociation = image;
//                         asoc.id_asociation = req.body.asoc_id;
//                         asoc.date_updated_asociation = req.body.date_updated_asociation;
//                         response = await asoc.updateLogo();
//                         if (response.message !== 'success') {
//                             Globals.updateResponse(
//                                 response.status,
//                                 response.message,
//                                 response.message,
//                                 Helper.basename(`${__filename}`),
//                                 'uploadAvatar'
//                             );
//                             // console.log('Componente ' + _name + ': uploadAvatar: Globals.httpResponse()  ─> ', Globals.httpResponse());
//                             return res.status(Globals.getStatus()).json(Globals.httpResponse());
//                             // return res.status(response.status).json({ message: response.error });
//                         } else if (response.num_records !== 1) {
//                             Globals.updateResponse(400, 'Non unique record', 'User not match', Helper.basename(`${__filename}`), 'uploadAvatar');
//                             // console.log('Componente ' + _name + ': uploadAvatar: Globals.httpResponse()  ─> ', Globals.httpResponse());
//                             return res.status(Globals.getStatus()).json(Globals.httpResponse());
//                             // return res.status(response.status).json({ message: response.error });
//                         }
//                         response = await asoc.getAsociationById();
//                         if (response.message === 'success') {
//                             return res.status(Globals.getStatus()).json(Globals.httpResponse());
//                         } else {
//                             Globals.updateResponse(
//                                 response.status,
//                                 response.message,
//                                 response.message,
//                                 Helper.basename(`${__filename}`),
//                                 'uploadAvatar'
//                             );
//                             return res.status(Globals.getStatus()).json(Globals.httpResponse());
//                         }
//                     }
//                 }
//             });
//         } catch (error: any) {
//             console.log('Componente user.Controller: uploadAvatar: catch err ─> ', error.message);
//             return res.status(500).json({ message: 'Something goes wrong: ' + error });
//         }
//     } catch (error) {
//         return res.status(500).json({ message: 'Something big goes wrong: ' + error });
//     }
// };
// export const deleteImage = async (req: Request, res: Response) => {
//     const _name = 'user.controler';
//     let response: any = null;
//     // const { prefix, id_user, date_updated_user } = req.params;
//     //.toString().replace(/\//g, '#');
//     const data = req.params;
//     const id_auth = req.body.user;
//     console.log('Componente ' + _name + ': deleteImage: data ─> ', data);
//     let prefix = req.body.module === 'users' ? PREFIX_AVATAR : req.body.module === 'asociations' ? PREFIX_LOGO : PREFIX_ARTICLES;
//     prefix = prefix + data.id_user;
//     console.log('Componente ' + _name + ': deleteImage: prefix ─> ', prefix);
//     console.log('Componente ' + _name + ': deleteImage: id_user ─> ', data.id_user);
//     console.log('Componente ' + _name + ': deleteImage: date_updated_user ─> ', data.date_updated_user);
//     const auth = new Auth();
//     auth.id_user = id_auth;
//     response = await auth.getDataUserById();
//     if (response.message !== 'success') {
//         Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'deleteImage');
//         return res.status(Globals.getStatus()).json(Globals.httpResponse());
//     } else if (response.num_records !== 1) {
//         Globals.updateResponse(400, 'Non unique record', 'User/password not match', Helper.basename(`${__filename}`), 'deleteImage');
//         return res.status(Globals.getStatus()).json(Globals.httpResponse());
//     } else if (auth.token_user !== req.body.token) {
//         Globals.updateResponse(400, 'Token not match', 'Token not match', Helper.basename(`${__filename}`), 'deleteImage');
//         return res.status(Globals.getStatus()).json(Globals.httpResponse());
//     }
//     const user = new User();
//     user.id_user = parseInt(data.id_user);
//     response = await user.getDataUserById();
//     if (response.message !== 'success') {
//         Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'deleteImage');
//         return res.status(Globals.getStatus()).json(Globals.httpResponse());
//     } else if (response.num_records !== 1) {
//         Globals.updateResponse(400, 'Non unique record', 'User/password not match', Helper.basename(`${__filename}`), 'deleteImage');
//         return res.status(Globals.getStatus()).json(Globals.httpResponse());
//     } else if (user.date_updated_user !== data.date_updated_user) {
//         Globals.updateResponse(
//             400,
//             'Record modified by another user',
//             'Record modified by another user. Refresh it, please. Logout and login again.',
//             Helper.basename(`${__filename}`),
//             'deleteImage'
//         );
//         return res.status(Globals.getStatus()).json(Globals.httpResponse());
//     }
//     if (user.id_user === auth.id_user) {
//         Helper.writeDebug('user modifies his own avatar', '');
//         // user modifies his own avatar
//     } else if (auth.profile_user === 'superadmin') {
//         // power
//     } else if (auth.profile_user === 'admin' && auth.id_asociation_user === user.id_asociation_user) {
//         // partial power
//     } else {
//         Globals.updateResponse(
//             400,
//             'User not authorized to delete image',
//             'User not authorized to delete image.',
//             Helper.basename(`${__filename}`),
//             'deleteImage'
//         );
//         return res.status(Globals.getStatus()).json(Globals.httpResponse());
//     }
//     // const dir = path.join(path.resolve('uploads'), prefix?.toString().replace(/:/g, '/'));
//     const dir = path.join(path.resolve('uploads'), prefix);
//     console.log('Componente ' + _name + ': deleteImage: dir ─> ', dir);
//     if (fs.existsSync(dir)) {
//         // fs.emptyDirSync(dir);
//         fs.rmSync(dir, { recursive: true, force: true });
//     }
//     user.avatar_user = '';
//     response = await user.updateAvatar();
//     if (response.message !== 'success') {
//         Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'uploadAvatar');
//         // console.log('Componente ' + _name + ': uploadAvatar: Globals.httpResponse()  ─> ', Globals.httpResponse());
//         return res.status(Globals.getStatus()).json(Globals.httpResponse());
//         // return res.status(response.status).json({ message: response.error });
//     } else if (response.num_records !== 1) {
//         Globals.updateResponse(400, 'Non unique record', 'User not match', Helper.basename(`${__filename}`), 'uploadAvatar');
//         // console.log('Componente ' + _name + ': uploadAvatar: Globals.httpResponse()  ─> ', Globals.httpResponse());
//         return res.status(Globals.getStatus()).json(Globals.httpResponse());
//         // return res.status(response.status).json({ message: response.error });
//     }
//     response = await user.getDataUserById();
//     if (response.message === 'success') {
//         return res.status(Globals.getStatus()).json(Globals.httpResponse());
//     } else {
//         Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'uploadAvatar');
//         return res.status(Globals.getStatus()).json(Globals.httpResponse());
//     }
// };
