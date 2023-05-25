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
exports.deleteCover = exports.deleteImage = exports.moveItemImage = exports.uploadItemImage = exports.uploadImage = void 0;
const user_1 = __importDefault(require("../models/user"));
const globals_1 = __importDefault(require("../utils/globals"));
const helper_1 = __importDefault(require("../utils/helper"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const auth_1 = __importDefault(require("../models/auth"));
const asoc_1 = __importDefault(require("../models/asoc"));
const uuid_1 = require("uuid");
const config_1 = require("../config/config");
const artic_1 = __importDefault(require("../models/artic"));
const item_artic_1 = __importDefault(require("../models/item_artic"));
// display list of customer
const _name = 'image.controller.ts';
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let nameFile = '';
    let response = null;
    let prefix = '';
    console.log('Componente ' + _name + ': uploadImage ─> ');
    const auth = new auth_1.default();
    try {
        const storage = multer_1.default.diskStorage({
            destination: (req, _file, cb) => __awaiter(void 0, void 0, void 0, function* () {
                globals_1.default.dataApiRequest = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, globals_1.default.dataApiRequest), req.body), req.params), req.query), req.file);
                helper_1.default.writeDebug('uploadImage: diskStorage Globals.apiRequest -> ', globals_1.default.apiRequest);
                // console.log('uploadImage: diskStorage Globals.apiRequest -> ', Globals.apiRequest);
                console.log('Componente ' + _name + ': uploadImage: jwt ─> ', req.body.token);
                console.log('Componente ' + _name + ': uploadImage: req.body.date_updated ─> ', req.body.date_updated);
                const id = req.body.module === 'users' ? req.body.user_id : req.body.module === 'asociations' ? req.body.asoc_id : req.body.id_article;
                const date_updated = req.body.module === 'users'
                    ? req.body.date_updated
                    : req.body.module === 'asociations'
                        ? req.body.date_updated_asociation
                        : req.body.date_updated_article;
                const resp = yield auth.checkToken(req.body.module, req.body.token, id, date_updated);
                if (resp.result !== 'valid') {
                    cb(new Error(resp.msg), '');
                }
                else {
                    prefix = req.body.module === 'users' ? config_1.PREFIX_AVATAR : req.body.module === 'asociations' ? config_1.PREFIX_LOGO : config_1.PREFIX_ARTICLES;
                    // console.log('Componente ' + _name + ': uploadImage: storage prefix 1─> ', prefix);
                    prefix =
                        prefix +
                            (req.body.module === 'users'
                                ? resp.id
                                : req.body.module === 'asociations'
                                    ? req.body.asoc_id
                                    : req.body.id_asociation_article);
                    //  'images' + '/asociation-' + asoc + '/article-' + image.id_article.toString() + '/cover'
                    // console.log('Componente ' + _name + ': uploadImage: storage prefix 2─> ', prefix);
                    if (req.body.module === 'articles') {
                        if (req.body.cover === 'cover') {
                            prefix = prefix + config_1.URL_SEPARATOR + 'article-' + req.body.id_article.toString() + config_1.URL_SEPARATOR + 'cover';
                        }
                        else {
                            prefix = prefix + config_1.URL_SEPARATOR + 'article-' + req.body.id_article.toString() + config_1.URL_SEPARATOR + 'items-images';
                        }
                    }
                    const dir = path_1.default.join(path_1.default.resolve('uploads'), prefix);
                    console.log('Componente ' + _name + ': uploadImage: existsSync dir ─> ', dir, fs_extra_1.default.existsSync(dir));
                    try {
                        yield fs_extra_1.default.emptyDir(dir);
                        console.log('Componente ' + _name + ': uploadImage: ensureDir dir ─> ', dir, fs_extra_1.default.existsSync(dir));
                        console.log('Componente ' + _name + ': uploadImage: storage dir ─> ', dir);
                        cb(null, dir);
                    }
                    catch (error) {
                        console.log('Componente ' + _name + ': uploadImage: storage error ─> ', error);
                        cb(new Error(error), '');
                    }
                    // if (fs.existsSync(dir)) {
                    //     console.log('Componente ' + _name + ': uploadImage: existsSync dir ─> ');
                    //     fs.emptyDirSync(dir);
                    //     console.log('Componente ' + _name + ': uploadImage: emptyDirSync dir ─> ');
                    // }
                    // fs.ensureDir(dir, (err) => {
                    //     console.log('Componente ' + _name + ': uploadImage: ensureDir dir ─> ');
                    //     if (err) console.log('ensureDir err: ', err); // => null
                    //     // dir has now been created, including the directory it is to be placed in
                    // });
                }
            }),
            filename: (req, file, cb) => {
                console.log('Componente ' + _name + ': uploadImage: storage file ─> ', file);
                nameFile = `${req.body.user_name}_${(0, uuid_1.v4)()}${path_1.default.extname(file.originalname)}`;
                console.log('Componente ' + _name + ': uploadImage: storage: nameFile ─> ', nameFile);
                cb(null, nameFile);
            },
        });
        const upload = (0, multer_1.default)({ storage: storage }).single('file');
        try {
            let error = '';
            upload(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
                var _a, _b, _c;
                if (err instanceof multer_1.default.MulterError) {
                    // A Multer error occurred when uploading.
                    console.log('Componente ' + _name + ': uploadImage: MulterError ─> ', err);
                    error = err.toString();
                    return res.status(500).json({ message: 'Something is wrong: ' + error });
                }
                else if (err) {
                    // An unknown error occurred when uploading.
                    console.log('Componente ' + _name + ': uploadImage: upload err ─> ', err.message);
                    console.log('Componente ' + _name + ': uploadImage: upload req.file ─> ', req.file);
                    error = err;
                    console.log('Componente ' + _name + ': uploadImage: upload dir ─> ', fs_extra_1.default.existsSync((_a = req.file) === null || _a === void 0 ? void 0 : _a.destination));
                    globals_1.default.updateResponse(400, err.message, err.message, helper_1.default.basename(`${__filename}`), 'update', error);
                    return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
                }
                else {
                    globals_1.default.dataApiRequest = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, globals_1.default.dataApiRequest), req.body), req.params), req.query), req.file);
                    helper_1.default.writeDebug('uploadImage: upload Globals.apiRequest -> ', globals_1.default.apiRequest);
                    helper_1.default.writeDebug('uploadImage: upload req.file -> ', req.file);
                    // console.log('uploadImage: upload Globals.apiRequest -> ', Globals.apiRequest);
                    console.log('Componente ' + _name + ': uploadImage: upload req.file ─> ', req.file);
                    console.log('res');
                    const image = config_1.BASE_URL + ':' + config_1.PORT + config_1.URL_SEPARATOR + 'uploads' + config_1.URL_SEPARATOR + prefix + config_1.URL_SEPARATOR + ((_b = req.file) === null || _b === void 0 ? void 0 : _b.filename);
                    console.log('Componente ' + _name + ': uploadImage: upload image ─> ', image);
                    console.log('Componente ' + _name + ': uploadImage: upload path ─> ', (_c = req.file) === null || _c === void 0 ? void 0 : _c.path);
                    if (req.body.module === 'users') {
                        const user = new user_1.default();
                        user.avatar_user = image;
                        user.id_user = req.body.user_id;
                        user.date_updated_user = req.body.date_updated;
                        response = yield user.updateAvatar();
                        if (response.message !== 'success') {
                            globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'uploadImage');
                            // console.log('Componente ' + _name + ': uploadImage: Globals.httpResponse()  ─> ', Globals.httpResponse());
                            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
                            // return res.status(response.status).json({ message: response.error });
                        }
                        else if (response.num_records !== 1) {
                            globals_1.default.updateResponse(400, 'Non unique record', 'User not match', helper_1.default.basename(`${__filename}`), 'uploadImage');
                            // console.log('Componente ' + _name + ': uploadImage: Globals.httpResponse()  ─> ', Globals.httpResponse());
                            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
                            // return res.status(response.status).json({ message: response.error });
                        }
                        response = yield user.getDataUserById();
                        if (response.message === 'success') {
                            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
                        }
                        else {
                            globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'uploadImage');
                            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
                        }
                    }
                    else if (req.body.module === 'asociations') {
                        console.log('Componente ' + _name + ': uploadImage: image ─> ');
                        const asoc = new asoc_1.default();
                        asoc.logo_asociation = image;
                        asoc.id_asociation = req.body.asoc_id;
                        asoc.date_updated_asociation = req.body.date_updated_asociation;
                        response = yield asoc.updateLogo();
                        if (response.message !== 'success') {
                            globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'uploadImage');
                            // console.log('Componente ' + _name + ': uploadImage: Globals.httpResponse()  ─> ', Globals.httpResponse());
                            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
                            // return res.status(response.status).json({ message: response.error });
                        }
                        else if (response.num_records !== 1) {
                            globals_1.default.updateResponse(400, 'Non unique record', 'User not match', helper_1.default.basename(`${__filename}`), 'uploadImage');
                            // console.log('Componente ' + _name + ': uploadImage: Globals.httpResponse()  ─> ', Globals.httpResponse());
                            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
                            // return res.status(response.status).json({ message: response.error });
                        }
                        response = yield asoc.getAsociationById();
                        if (response.message === 'success') {
                            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
                        }
                        else {
                            globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'uploadImage');
                            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
                        }
                    }
                    else if (req.body.module === 'articles') {
                        console.log('Componente ' + _name + ': uploadImage: image ─> articles');
                        const article = new artic_1.default();
                        article.id_article = req.body.id_article;
                        article.cover_image_article = image;
                        article.date_updated_article = req.body.date_updated_article;
                        response = yield article.updateCover();
                        if (response.message !== 'success') {
                            globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'uploadImage');
                            // console.log('Componente ' + _name + ': uploadImage: Globals.httpResponse()  ─> ', Globals.httpResponse());
                            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
                            // return res.status(response.status).json({ message: response.error });
                        }
                        else if (response.num_records !== 1) {
                            globals_1.default.updateResponse(400, 'Non unique record', 'User not match', helper_1.default.basename(`${__filename}`), 'uploadImage');
                            // console.log('Componente ' + _name + ': uploadImage: Globals.httpResponse()  ─> ', Globals.httpResponse());
                            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
                            // return res.status(response.status).json({ message: response.error });
                        }
                        let items = [];
                        const item_article = new item_artic_1.default();
                        item_article.id_article_item_article = article.id_article;
                        response = yield item_article.getListItemsOfArticle();
                        if (response.message !== 'success') {
                            globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'update');
                            yield artic_1.default.abortTransaccion();
                            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
                        }
                        items = response.records;
                        helper_1.default.writeDebug('Componente ' + _name + ': update: getListItemsOfArticle items ─> ', items);
                        let article_data = {};
                        response = yield article.getArticleUserById();
                        if (response.message !== 'success') {
                            globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'update');
                            yield artic_1.default.abortTransaccion();
                            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
                        }
                        article_data = response.records[0];
                        yield Promise.all(items.map((itemArticle) => __awaiter(void 0, void 0, void 0, function* () {
                            if (itemArticle.image_item_article === '') {
                                itemArticle.image_item_article = {
                                    src: '',
                                    nameFile: '',
                                    filePath: '',
                                    fileImage: null,
                                    isSelectedFile: false,
                                    isDefault: true,
                                    isChange: false,
                                };
                            }
                            else {
                                itemArticle.image_item_article = {
                                    src: itemArticle.image_item_article,
                                    nameFile: '',
                                    filePath: '',
                                    fileImage: null,
                                    isSelectedFile: false,
                                    isDefault: false,
                                    isChange: false,
                                };
                            }
                        })));
                        if (article_data.cover_image_article === '') {
                            article_data.cover_image_article = {
                                src: '',
                                nameFile: '',
                                filePath: '',
                                fileImage: null,
                                isSelectedFile: false,
                                isDefault: true,
                                isChange: false,
                            };
                        }
                        else {
                            article_data.cover_image_article = {
                                src: article_data.cover_image_article,
                                nameFile: '',
                                filePath: '',
                                fileImage: null,
                                isSelectedFile: false,
                                isDefault: false,
                                isChange: false,
                            };
                        }
                        article_data.items_article = items;
                        globals_1.default.updateResponse(200, '', 'ok', helper_1.default.basename(`${__filename}`), 'update', article_data);
                        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
                    }
                }
            }));
        }
        catch (error) {
            console.log('Componente ' + _name + ': uploadImage: catch err ─> ', error.message);
            return res.status(500).json({ message: 'Something goes wrong: ' + error });
        }
    }
    catch (error) {
        return res.status(500).json({ message: 'Something big goes wrong: ' + error });
    }
});
exports.uploadImage = uploadImage;
const uploadItemImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let nameFile = '';
    let response = null;
    let prefix = '';
    let dir = '';
    let dirOld = '';
    console.log('Componente ' + _name + ': uploadItemImage ─> ');
    const auth = new auth_1.default();
    try {
        const storage = multer_1.default.diskStorage({
            destination: (req, file, cb) => __awaiter(void 0, void 0, void 0, function* () {
                globals_1.default.dataApiRequest = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, globals_1.default.dataApiRequest), req.body), req.params), req.query), req.file), file);
                helper_1.default.writeDebug('uploadItemImage: diskStorage Globals.apiRequest -> ', globals_1.default.apiRequest);
                console.log('Componente ' + _name + ': uploadItemImage: file ─> ', file);
                // console.log('uploadItemImage: diskStorage Globals.apiRequest -> ', Globals.apiRequest);
                console.log('Componente ' + _name + ': uploadItemImage: jwt ─> ', req.body.token);
                console.log('Componente ' + _name + ': uploadItemImage: req.body.date_updated ─> ', req.body.date_updated);
                const resp = yield auth.checkToken(req.body.module, req.body.token, req.body.id_article, req.body.date_updated_article);
                if (resp.result !== 'valid') {
                    cb(new Error(resp.msg), '');
                }
                else {
                    prefix =
                        config_1.PREFIX_ARTICLES +
                            req.body.id_asociation_article +
                            config_1.URL_SEPARATOR +
                            'article-' +
                            req.body.id_article.toString() +
                            config_1.URL_SEPARATOR +
                            'items-images';
                    //  'images' + '/asociation-' + asoc + '/article-' + image.id_article.toString() + '/cover'
                    // console.log('Componente ' + _name + ': uploadItemImage: storage prefix 2─> ', prefix);
                    dir = path_1.default.join(path_1.default.resolve('uploads'), prefix);
                    dirOld = dir + '-old';
                    console.log('Componente ' + _name + ': uploadItemImage: existsSync dir ─> ', dir, fs_extra_1.default.existsSync(dir));
                    console.log('Componente ' + _name + ': uploadItemImage: req.body.first ─> ', req.body.first);
                    const existsDir = yield fs_extra_1.default.pathExists(dir);
                    console.log('Componente ' + _name + ': uploadItemImage: existsSync dir existsDir ─> ', dir, existsDir);
                    if (req.body.first === 'true') {
                        try {
                            if (existsDir) {
                                console.log('Componente ' + _name + ': uploadItemImage: req.body.first ─> move');
                                yield fs_extra_1.default.move(dir, dirOld, { overwrite: true });
                                console.log('Componente ' + _name + ': uploadItemImage: req.body.first + ─> emptyDir');
                                yield fs_extra_1.default.emptyDir(dir);
                            }
                            else {
                                console.log('Componente ' + _name + ': uploadItemImage: req.body.first ─> emptyDir');
                                yield fs_extra_1.default.emptyDir(dir);
                            }
                        }
                        catch (error) {
                            console.log('Componente ' + _name + ': uploadItemImage: storage error ─> ', error);
                            cb(new Error(error), '');
                        }
                    }
                    // if (req.body.first === 'true') {
                    //     if (fs.existsSync(dir)) {
                    //         fs.moveSync(dir, dirOld, { overwrite: true });
                    //     }
                    //     if (fs.existsSync(dir)) {
                    //         console.log('Componente ' + _name + ': uploadItemImage: emptyDirSync dir ─> ', dir, fs.existsSync(dir));
                    //         fs.emptyDirSync(dir);
                    //     }
                    //     fs.ensureDir(dir, (err) => {
                    //         console.log('Componente ' + _name + ': uploadItemImage: ensureDir dir ─> ', dir, fs.existsSync(dir));
                    //         if (err) console.log('ensureDir err: ', err); // => null
                    //         // dir has now been created, including the directory it is to be placed in
                    //     });
                    // }
                    console.log('Componente ' + _name + ': uploadItemImage: storage dir ─> ', dir);
                    cb(null, dir);
                }
            }),
            filename: (req, file, cb) => {
                console.log('Componente ' + _name + ': uploadItemImage: storage file ─> ', file);
                nameFile = `${req.body.user_name}_${(0, uuid_1.v4)()}${path_1.default.extname(file.originalname)}`;
                console.log('Componente ' + _name + ': uploadItemImage: storage: nameFile ─> ', nameFile);
                cb(null, nameFile);
            },
        });
        const upload = (0, multer_1.default)({ storage: storage }).single('file');
        try {
            let error = '';
            upload(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
                var _d, _e, _f;
                if (err instanceof multer_1.default.MulterError) {
                    // A Multer error occurred when uploading.
                    console.log('Componente ' + _name + ': uploadItemImage: MulterError ─> ', err);
                    error = err.toString();
                    return res.status(500).json({ message: 'Something is wrong: ' + error });
                }
                else if (err) {
                    // An unknown error occurred when uploading.
                    console.log('Componente ' + _name + ': uploadItemImage: upload err ─> ', err.message);
                    console.log('Componente ' + _name + ': uploadItemImage: upload req.file ─> ', req.file);
                    error = err;
                    console.log('Componente ' + _name + ': uploadItemImage: upload dir ─> ', fs_extra_1.default.existsSync((_d = req.file) === null || _d === void 0 ? void 0 : _d.destination));
                    globals_1.default.updateResponse(400, err.message, err.message, helper_1.default.basename(`${__filename}`), 'update', error);
                    return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
                }
                else {
                    globals_1.default.dataApiRequest = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, globals_1.default.dataApiRequest), req.body), req.params), req.query), req.file);
                    helper_1.default.writeDebug('uploadItemImage: upload Globals.apiRequest -> ', globals_1.default.apiRequest);
                    helper_1.default.writeDebug('uploadItemImage: upload req.file -> ', req.file);
                    // console.log('uploadItemImage: upload Globals.apiRequest -> ', Globals.apiRequest);
                    console.log('Componente ' + _name + ': uploadItemImage: upload req.file ─> ', req.file);
                    console.log('res');
                    // ----------------- make the image path                              //
                    const image = config_1.BASE_URL + ':' + config_1.PORT + config_1.URL_SEPARATOR + 'uploads' + config_1.URL_SEPARATOR + prefix + config_1.URL_SEPARATOR + ((_e = req.file) === null || _e === void 0 ? void 0 : _e.filename);
                    console.log('Componente ' + _name + ': uploadItemImage: upload image ─> ', image);
                    console.log('Componente ' + _name + ': uploadItemImage: upload path ─> ', (_f = req.file) === null || _f === void 0 ? void 0 : _f.path);
                    console.log('Componente ' + _name + ': uploadItemImage: image ─> articles');
                    // ----------------------------------------------------------------------//
                    //                          UPDATE ITEMARTICLE                           //
                    // ----------------------------------------------------------------------//
                    const item_article = new item_artic_1.default();
                    item_article.id_item_article = req.body.id_item_article;
                    item_article.id_article_item_article = req.body.id_article;
                    item_article.image_item_article = image;
                    response = yield item_article.updateImageItem();
                    if (response.message !== 'success') {
                        globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'uploadItemImage');
                        // console.log('Componente ' + _name + ': uploadItemImage: Globals.httpResponse()  ─> ', Globals.httpResponse());
                        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
                        // return res.status(response.status).json({ message: response.error });
                    }
                    else if (response.num_records !== 1) {
                        globals_1.default.updateResponse(400, 'Non unique record', 'Item not match', helper_1.default.basename(`${__filename}`), 'uploadItemImage');
                        // console.log('Componente ' + _name + ': uploadItemImage: Globals.httpResponse()  ─> ', Globals.httpResponse());
                        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
                        // return res.status(response.status).json({ message: response.error });
                    }
                    // ----------------------------------------------------------------------//
                    //                            DELETE OLD DIR                             //
                    // ----------------------------------------------------------------------//
                    const existsDirOld = yield fs_extra_1.default.pathExists(dirOld);
                    if (req.body.last === 'true' && existsDirOld) {
                        try {
                            yield fs_extra_1.default.remove(dirOld);
                        }
                        catch (error) {
                            globals_1.default.updateResponse(400, 'Error delete old images directory', 'Error delete old images directory', helper_1.default.basename(`${__filename}`), 'uploadItemImage');
                            // console.log('Componente ' + _name + ': uploadItemImage: Globals.httpResponse()  ─> ', Globals.httpResponse());
                            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
                        }
                        // if (fs.existsSync(dirOld)) {
                        //     console.log('Componente ' + _name + ': moveItemImage: emptyDirSync dir ─> ', dir, fs.existsSync(dirOld));
                        //     fs.emptyDirSync(dirOld);
                        // }
                    }
                    // **********************************************************************//
                    // **********************************************************************//
                    //                          GET RESPONSE                                 //
                    // **********************************************************************//
                    // **********************************************************************//
                    //  -------------------------------------------------------------------  //
                    //                          GET ARTICLE                                  //
                    //  -------------------------------------------------------------------  //
                    const article = new artic_1.default();
                    article.id_article = req.body.id_article;
                    let article_data = {};
                    response = yield article.getArticleUserById();
                    if (response.message !== 'success') {
                        globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'uploadItemImage');
                        yield artic_1.default.abortTransaccion();
                        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
                    }
                    article_data = response.records[0];
                    //  -------------------------------------------------------------------  //
                    //                         GET ITEMARTICLE                               //
                    //  -------------------------------------------------------------------  //
                    let items = [];
                    item_article.id_article_item_article = article.id_article;
                    response = yield item_article.getListItemsOfArticle();
                    if (response.message !== 'success') {
                        globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'uploadItemImage');
                        yield artic_1.default.abortTransaccion();
                        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
                    }
                    items = response.records;
                    helper_1.default.writeDebug('Componente ' + _name + ': uploadItemImage: getListItemsOfArticle items ─> ', items);
                    yield Promise.all(items.map((itemArticle) => __awaiter(void 0, void 0, void 0, function* () {
                        if (itemArticle.image_item_article === '') {
                            itemArticle.image_item_article = {
                                src: '',
                                nameFile: '',
                                filePath: '',
                                fileImage: null,
                                isSelectedFile: false,
                                isDefault: true,
                                isChange: false,
                            };
                        }
                        else {
                            itemArticle.image_item_article = {
                                src: itemArticle.image_item_article,
                                nameFile: '',
                                filePath: '',
                                fileImage: null,
                                isSelectedFile: false,
                                isDefault: false,
                                isChange: false,
                            };
                        }
                    })));
                    if (article_data.cover_image_article === '') {
                        article_data.cover_image_article = {
                            src: '',
                            nameFile: '',
                            filePath: '',
                            fileImage: null,
                            isSelectedFile: false,
                            isDefault: true,
                            isChange: false,
                        };
                    }
                    else {
                        article_data.cover_image_article = {
                            src: article_data.cover_image_article,
                            nameFile: '',
                            filePath: '',
                            fileImage: null,
                            isSelectedFile: false,
                            isDefault: false,
                            isChange: false,
                        };
                    }
                    article_data.items_article = items;
                    //  -------------------------------------------------------------------  //
                    //                         FINAL RESPONSE                               //
                    //  -------------------------------------------------------------------  //
                    globals_1.default.updateResponse(200, '', 'ok', helper_1.default.basename(`${__filename}`), 'uploadItemImage', article_data);
                    return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
                }
            }));
        }
        catch (error) {
            console.log('Componente ' + _name + ': uploadItemImage: catch err ─> ', error.message);
            return res.status(500).json({ message: 'Something goes wrong: ' + error });
        }
    }
    catch (error) {
        return res.status(500).json({ message: 'Something big goes wrong: ' + error });
    }
});
exports.uploadItemImage = uploadItemImage;
const moveItemImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _g;
    let nameOldFile = '';
    let nameFile = '';
    let response = null;
    let prefix = '';
    let dir = '';
    let dirOld = '';
    console.log('Componente ' + _name + ': moveItemImage ─> ');
    const data = req.body;
    console.log('Componente ' + _name + ': moveItemImage: data ─> ', data);
    try {
        const auth = new auth_1.default();
        auth.id_user = data.user;
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
        console.log('Componente ' + _name + ': moveItemImage: find auth ─> ');
        const article = new artic_1.default();
        article.id_article = data.id_article;
        response = yield article.getArticleById();
        if (response.message !== 'success') {
            globals_1.default.updateResponse(400, response.message, response.message, helper_1.default.basename(`${__filename}`), 'update');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        else if (article.date_updated_article !== data.date_updated_article) {
            globals_1.default.updateResponse(400, 'Record modified by another user. Refresh it, please.', 'Record modified by another user. Refresh it, please.', helper_1.default.basename(`${__filename}`), 'update');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        if (auth.profile_user === 'superadmin' && article.id_asociation_article === parseInt('9'.repeat(9))) {
            // power
        }
        else if (['admin', 'editor'].includes(auth.profile_user) && article.id_asociation_article === auth.id_asociation_user) {
            // partial power
        }
        else {
            globals_1.default.updateResponse(400, 'User not authorized to modify images', 'User not authorized to modify images', helper_1.default.basename(`${__filename}`), 'update');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        console.log('Componente ' + _name + ': moveItemImage: data.date_updated ─> ', data.date_updated);
        prefix =
            config_1.PREFIX_ARTICLES + data.id_asociation_article + config_1.URL_SEPARATOR + 'article-' + data.id_article.toString() + config_1.URL_SEPARATOR + 'items-images';
        //  'images' + '/asociation-' + asoc + '/article-' + image.id_article.toString() + '/cover'
        // console.log('Componente ' + _name + ': moveItemImage: storage prefix 2─> ', prefix);
        dir = path_1.default.join(path_1.default.resolve('uploads'), prefix);
        dirOld = dir + '-old';
        console.log('Componente ' + _name + ': moveItemImage: existsSync dir ─> ', data.index, dir, fs_extra_1.default.existsSync(dir));
        const existsDir = yield fs_extra_1.default.pathExists(dir);
        console.log('Componente ' + _name + ': moveItemImage: existsSync dir existsDir ─> ', data.index, dir, existsDir);
        if (data.first === 'true') {
            try {
                if (existsDir) {
                    yield fs_extra_1.default.move(dir, dirOld, { overwrite: true });
                    yield fs_extra_1.default.emptyDir(dir);
                }
                else {
                    yield fs_extra_1.default.emptyDir(dir);
                }
            }
            catch (error) {
                console.log('Componente ' + _name + ': uploadItemImage: move error ─> ', error);
                globals_1.default.updateResponse(400, 'Error moving images directory', 'Error moving images directory', helper_1.default.basename(`${__filename}`), 'uploadItemImage');
                // console.log('Componente ' + _name + ': uploadItemImage: Globals.httpResponse()  ─> ', Globals.httpResponse());
                return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
            }
            // if (fs.existsSync(dir)) {
            //     fs.moveSync(dir, dirOld, { overwrite: true });
            //     console.log('Componente ' + _name + ': moveItemImage: moveSync dirOld ─> ', data.index, dirOld, fs.existsSync(dirOld));
            // }
            // if (fs.existsSync(dir)) {
            //     console.log('Componente ' + _name + ': moveItemImage: emptyDirSync dir ─> ', data.index, dir, fs.existsSync(dir));
            //     fs.emptyDirSync(dir);
            // }
            // fs.ensureDir(dir, (err) => {
            //     console.log('Componente ' + _name + ': moveItemImage: ensureDir dir ─> ', data.index, dir, fs.existsSync(dir));
            //     if (err) console.log('ensureDir err: ', err); // => null
            //     // dir has now been created, including the directory it is to be placed in
            // });
        }
        console.log('Componente ' + _name + ': moveItemImage: dir ─> ', dir, fs_extra_1.default.existsSync(dir));
        console.log('Componente ' + _name + ': moveItemImage: storage dir ─> ', dir);
        console.log('Componente ' + _name + ': moveItemImage: file_src ─> ', data.file_src);
        nameOldFile = `${path_1.default.basename(data.file_src)}`;
        nameFile = `${data.user_name}_${(0, uuid_1.v4)()}${path_1.default.extname(data.name)}`;
        const target_file_old = dirOld + config_1.DIRECTORY_SEPARATOR + nameOldFile;
        const target_file = dir + config_1.DIRECTORY_SEPARATOR + nameFile;
        // fs.moveSync(target_file_old, target_file, { overwrite: true });
        yield fs_extra_1.default.move(target_file_old, target_file, { overwrite: true });
        const existsDirOld = yield fs_extra_1.default.pathExists(dirOld);
        if (data.last === 'true' && existsDirOld) {
            try {
                yield fs_extra_1.default.remove(dirOld);
            }
            catch (error) {
                globals_1.default.updateResponse(400, 'Error delete old images directory', 'Error delete old images directory', helper_1.default.basename(`${__filename}`), 'uploadItemImage');
                // console.log('Componente ' + _name + ': uploadItemImage: Globals.httpResponse()  ─> ', Globals.httpResponse());
                return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
            }
            // if (fs.existsSync(dirOld)) {
            //     console.log('Componente ' + _name + ': moveItemImage: emptyDirSync dir ─> ', dir, fs.existsSync(dirOld));
            //     fs.emptyDirSync(dirOld);
            // }
        }
        console.log('Componente ' + _name + ': moveItemImage: storage: nameFile ─> ', nameFile);
        helper_1.default.writeDebug('moveItemImage: upload Globals.apiRequest -> ', globals_1.default.apiRequest);
        helper_1.default.writeDebug('moveItemImage: upload req.file -> ', req.file);
        // console.log('moveItemImage: upload Globals.apiRequest -> ', Globals.apiRequest);
        console.log('Componente ' + _name + ': moveItemImage: upload req.file ─> ', req.file);
        console.log('res');
        const image = config_1.BASE_URL + ':' + config_1.PORT + config_1.URL_SEPARATOR + 'uploads' + config_1.URL_SEPARATOR + prefix + config_1.URL_SEPARATOR + nameFile;
        console.log('Componente ' + _name + ': moveItemImage: upload image ─> ', image);
        console.log('Componente ' + _name + ': moveItemImage: upload path ─> ', (_g = req.file) === null || _g === void 0 ? void 0 : _g.path);
        console.log('Componente ' + _name + ': moveItemImage: image ─> articles');
        const item_article = new item_artic_1.default();
        item_article.id_item_article = data.id_item_article;
        item_article.id_article_item_article = data.id_article;
        item_article.image_item_article = image;
        response = yield item_article.updateImageItem();
        if (response.message !== 'success') {
            globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'moveItemImage');
            // console.log('Componente ' + _name + ': moveItemImage: Globals.httpResponse()  ─> ', Globals.httpResponse());
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
            // return res.status(response.status).json({ message: response.error });
        }
        else if (response.num_records !== 1) {
            globals_1.default.updateResponse(400, 'Non unique record', 'Item not match', helper_1.default.basename(`${__filename}`), 'moveItemImage');
            // console.log('Componente ' + _name + ': moveItemImage: Globals.httpResponse()  ─> ', Globals.httpResponse());
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
            // return res.status(response.status).json({ message: response.error });
        }
        // **********************************************************************//
        // **********************************************************************//
        //                          GET RESPONSE                                 //
        // **********************************************************************//
        // **********************************************************************//
        // ----------------------------------------------------------------------//
        //                          GET ARTICLE                                  //
        // ----------------------------------------------------------------------//
        let article_data = {};
        response = yield article.getArticleUserById();
        if (response.message !== 'success') {
            globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'moveItemImage');
            yield artic_1.default.abortTransaccion();
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        article_data = response.records[0];
        let items = [];
        item_article.id_article_item_article = article.id_article;
        response = yield item_article.getListItemsOfArticle();
        if (response.message !== 'success') {
            globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'moveItemImage');
            yield artic_1.default.abortTransaccion();
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        items = response.records;
        helper_1.default.writeDebug('Componente ' + _name + ': moveItemImage: getListItemsOfArticle items ─> ', items);
        yield Promise.all(items.map((itemArticle) => __awaiter(void 0, void 0, void 0, function* () {
            if (itemArticle.image_item_article === '') {
                itemArticle.image_item_article = {
                    src: '',
                    nameFile: '',
                    filePath: '',
                    fileImage: null,
                    isSelectedFile: false,
                    isDefault: true,
                    isChange: false,
                };
            }
            else {
                itemArticle.image_item_article = {
                    src: itemArticle.image_item_article,
                    nameFile: '',
                    filePath: '',
                    fileImage: null,
                    isSelectedFile: false,
                    isDefault: false,
                    isChange: false,
                };
            }
        })));
        if (article_data.cover_image_article === '') {
            article_data.cover_image_article = {
                src: '',
                nameFile: '',
                filePath: '',
                fileImage: null,
                isSelectedFile: false,
                isDefault: true,
                isChange: false,
            };
        }
        else {
            article_data.cover_image_article = {
                src: article_data.cover_image_article,
                nameFile: '',
                filePath: '',
                fileImage: null,
                isSelectedFile: false,
                isDefault: false,
                isChange: false,
            };
        }
        article_data.items_article = items;
        globals_1.default.updateResponse(200, '', 'ok', helper_1.default.basename(`${__filename}`), 'moveItemImage', article_data);
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
    catch (error) {
        return res.status(500).json({ message: 'Something big goes wrong: ' + error });
    }
});
exports.moveItemImage = moveItemImage;
const deleteImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _name = 'user.controler';
    let response = null;
    // const { prefix, id_user, date_updated_user } = req.params;
    //.toString().replace(/\//g, '#');
    const data = req.params;
    const id_auth = req.body.user;
    console.log('Componente ' + _name + ': deleteImage: data ─> ', data);
    let prefix = req.body.module === 'users' ? config_1.PREFIX_AVATAR : req.body.module === 'asociations' ? config_1.PREFIX_LOGO : config_1.PREFIX_ARTICLES;
    prefix = prefix + data.id_user;
    console.log('Componente ' + _name + ': deleteImage: prefix ─> ', prefix);
    console.log('Componente ' + _name + ': deleteImage: id_user ─> ', data.id_user);
    console.log('Componente ' + _name + ': deleteImage: date_updated_user ─> ', data.date_updated_user);
    const auth = new auth_1.default();
    auth.id_user = id_auth;
    response = yield auth.getDataUserById();
    if (response.message !== 'success') {
        globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'deleteImage');
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
    else if (response.num_records !== 1) {
        globals_1.default.updateResponse(400, 'Non unique record', 'User/password not match', helper_1.default.basename(`${__filename}`), 'deleteImage');
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
    else if (auth.token_user !== req.body.token) {
        globals_1.default.updateResponse(400, 'Token not match', 'Token not match', helper_1.default.basename(`${__filename}`), 'deleteImage');
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
    const user = new user_1.default();
    user.id_user = parseInt(data.id_user);
    response = yield user.getDataUserById();
    if (response.message !== 'success') {
        globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'deleteImage');
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
    else if (response.num_records !== 1) {
        globals_1.default.updateResponse(400, 'Non unique record', 'User/password not match', helper_1.default.basename(`${__filename}`), 'deleteImage');
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
    else if (user.date_updated_user !== data.date_updated_user) {
        globals_1.default.updateResponse(400, 'Record modified by another user', 'Record modified by another user. Refresh it, please. Logout and login again.', helper_1.default.basename(`${__filename}`), 'deleteImage');
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
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
        globals_1.default.updateResponse(400, 'User not authorized to delete image', 'User not authorized to delete image.', helper_1.default.basename(`${__filename}`), 'deleteImage');
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
    // const dir = path.join(path.resolve('uploads'), prefix?.toString().replace(/:/g, '/'));
    const dir = path_1.default.join(path_1.default.resolve('uploads'), prefix);
    console.log('Componente ' + _name + ': deleteImage: dir ─> ', dir);
    yield fs_extra_1.default.remove(dir);
    // if (fs.existsSync(dir)) {
    //     // fs.emptyDirSync(dir);
    //     fs.rmSync(dir, { recursive: true, force: true });
    // }
    user.avatar_user = '';
    response = yield user.updateAvatar();
    if (response.message !== 'success') {
        globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'uploadImage');
        // console.log('Componente ' + _name + ': uploadImage: Globals.httpResponse()  ─> ', Globals.httpResponse());
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        // return res.status(response.status).json({ message: response.error });
    }
    else if (response.num_records !== 1) {
        globals_1.default.updateResponse(400, 'Non unique record', 'User not match', helper_1.default.basename(`${__filename}`), 'uploadImage');
        // console.log('Componente ' + _name + ': uploadImage: Globals.httpResponse()  ─> ', Globals.httpResponse());
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        // return res.status(response.status).json({ message: response.error });
    }
    response = yield user.getDataUserById();
    if (response.message === 'success') {
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
    else {
        globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'uploadImage');
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
});
exports.deleteImage = deleteImage;
const deleteCover = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let response = null;
    const data = req.params;
    const id_auth = req.body.user;
    console.log('Componente ' + _name + ': deleteCover: data ─> ', data);
    console.log('Componente ' + _name + ': deleteCover: id_article ─> ', data.id_article);
    console.log('Componente ' + _name + ': deleteCover: date_updated_article ─> ', data.date_updated_article);
    let prefix = config_1.PREFIX_ARTICLES + data.id_asociation_article + config_1.URL_SEPARATOR + 'article-' + req.body.id_article + config_1.URL_SEPARATOR + 'cover';
    console.log('Componente ' + _name + ': deleteCover: prefix ─> ', prefix);
    const auth = new auth_1.default();
    auth.id_user = id_auth;
    response = yield auth.getDataUserById();
    if (response.message !== 'success') {
        globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'deleteCover');
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
    else if (response.num_records !== 1) {
        globals_1.default.updateResponse(400, 'Non unique record', 'User/password not match', helper_1.default.basename(`${__filename}`), 'deleteCover');
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
    else if (auth.token_user !== req.body.token) {
        globals_1.default.updateResponse(400, 'Token not match', 'Token not match', helper_1.default.basename(`${__filename}`), 'deleteCover');
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
    const article = new artic_1.default();
    article.id_article = parseInt(data.id_article);
    response = yield article.getArticleById();
    if (response.message !== 'success') {
        globals_1.default.updateResponse(400, response.message, response.message, helper_1.default.basename(`${__filename}`), 'deleteCover');
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
    else if (article.date_updated_article !== data.date_updated_article) {
        globals_1.default.updateResponse(400, 'Record modified by another user. Refresh it, please.', 'Record modified by another user. Refresh it, please.', helper_1.default.basename(`${__filename}`), 'deleteCover');
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
    if (auth.profile_user === 'superadmin' && article.id_asociation_article === parseInt('9'.repeat(9))) {
        // power
    }
    else if (['admin', 'editor'].includes(auth.profile_user) && article.id_asociation_article === auth.id_asociation_user) {
        // partial power
    }
    else {
        globals_1.default.updateResponse(400, 'User not authorized to modify images', 'User not authorized to modify images', helper_1.default.basename(`${__filename}`), 'deleteCover');
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
    // const dir = path.join(path.resolve('uploads'), prefix?.toString().replace(/:/g, '/'));
    const dir = path_1.default.join(path_1.default.resolve('uploads'), prefix);
    console.log('Componente ' + _name + ': deleteCover: dir ─> ', dir);
    yield fs_extra_1.default.remove(dir);
    // if (fs.existsSync(dir)) {
    //     // fs.emptyDirSync(dir);
    //     fs.rmSync(dir, { recursive: true, force: true });
    // }
    console.log('Componente ' + _name + ': deleteCover: cover ─> articles');
    article.id_article = parseInt(data.id_article);
    article.cover_image_article = '';
    article.date_updated_article = data.date_updated_article;
    response = yield article.updateCover();
    if (response.message !== 'success') {
        globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'deleteCover');
        // console.log('Componente ' + _name + ': deleteCover: Globals.httpResponse()  ─> ', Globals.httpResponse());
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        // return res.status(response.status).json({ message: response.error });
    }
    else if (response.num_records !== 1) {
        globals_1.default.updateResponse(400, 'Non unique record', 'User not match', helper_1.default.basename(`${__filename}`), 'deleteCover');
        // console.log('Componente ' + _name + ': deleteCover: Globals.httpResponse()  ─> ', Globals.httpResponse());
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        // return res.status(response.status).json({ message: response.error });
    }
    let items = [];
    const item_article = new item_artic_1.default();
    item_article.id_article_item_article = article.id_article;
    response = yield item_article.getListItemsOfArticle();
    if (response.message !== 'success') {
        globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'deleteCover');
        yield artic_1.default.abortTransaccion();
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
    items = response.records;
    helper_1.default.writeDebug('Componente ' + _name + ': deleteCover: getListItemsOfArticle items ─> ', items);
    let article_data = {};
    response = yield article.getArticleUserById();
    if (response.message !== 'success') {
        globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'deleteCover');
        yield artic_1.default.abortTransaccion();
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
    article_data = response.records[0];
    yield Promise.all(items.map((itemArticle) => __awaiter(void 0, void 0, void 0, function* () {
        if (itemArticle.image_item_article === '') {
            itemArticle.image_item_article = {
                src: '',
                nameFile: '',
                filePath: '',
                fileImage: null,
                isSelectedFile: false,
                isDefault: true,
                isChange: false,
            };
        }
        else {
            itemArticle.image_item_article = {
                src: itemArticle.image_item_article,
                nameFile: '',
                filePath: '',
                fileImage: null,
                isSelectedFile: false,
                isDefault: false,
                isChange: false,
            };
        }
    })));
    if (article_data.cover_image_article === '') {
        article_data.cover_image_article = {
            src: '',
            nameFile: '',
            filePath: '',
            fileImage: null,
            isSelectedFile: false,
            isDefault: true,
            isChange: false,
        };
    }
    else {
        article_data.cover_image_article = {
            src: article_data.cover_image_article,
            nameFile: '',
            filePath: '',
            fileImage: null,
            isSelectedFile: false,
            isDefault: false,
            isChange: false,
        };
    }
    article_data.items_article = items;
    globals_1.default.updateResponse(200, '', 'ok', helper_1.default.basename(`${__filename}`), 'deleteCover', article_data);
    return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
});
exports.deleteCover = deleteCover;
