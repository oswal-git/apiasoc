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
exports.update = exports.create = exports.listAll = void 0;
const globals_1 = __importDefault(require("../utils/globals"));
const helper_1 = __importDefault(require("../utils/helper"));
const auth_1 = __importDefault(require("../models/auth"));
const asoc_1 = __importDefault(require("../models/asoc"));
const artic_1 = __importDefault(require("../models/artic"));
const item_artic_1 = __importDefault(require("../models/item_artic"));
const notifications_1 = __importDefault(require("../models/notifications"));
const _name = 'artic.controller.ts';
const listAll = (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    let response = null;
    let isLogged = false;
    const data = req.query;
    console.log('Componente ' + _name + ': listAll: req.params ─> ', req.params);
    console.log('Componente ' + _name + ': listAll: req.body  ─> ', req.body);
    console.log('Componente ' + _name + ': listAll: req.query  ─> ', req.query);
    // const id_asociation_article = data.id_asociation_article || 0;
    const category_article = data.category_article || '';
    const subcategory_article = data.subcategory_article || '';
    console.log('Componente ' + _name + ': listAll: data  ─> ', data);
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
                // } else if (auth.token_exp_user !== req.body.exp) {
                //     console.log('Componente ' + _name + ': listAll: auth.token_exp_user  ─> ', auth.token_exp_user);
                //     console.log('Componente ' + _name + ': listAll: req.body.exp  ─> ', req.body.exp);
                //     Globals.updateResponse(
                //         400,
                //         'Expired date token not match',
                //         'Expired date token not match',
                //         Helper.basename(`${__filename}`),
                //         'listAll'
                //     );
                //     return res.status(Globals.getStatus()).json(Globals.httpResponse());
            }
            else if (auth.token_user !== req.body.token) {
                globals_1.default.updateResponse(400, 'Token not match', 'Token not match', helper_1.default.basename(`${__filename}`), 'listAll');
                return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
            }
            isLogged = true;
        }
        const article = new artic_1.default();
        switch (true) {
            case !isLogged:
                article.id_asociation_article = parseInt('9'.repeat(9));
                break;
            case isLogged && auth.profile_user === 'superadmin':
                article.id_asociation_article = parseInt('9'.repeat(9));
                break;
            case isLogged:
                article.id_asociation_article = auth.id_asociation_user;
                break;
            default:
                globals_1.default.updateResponse(400, 'User not authorized for try the listArticles list', 'User unauthorized.', helper_1.default.basename(`${__filename}`), 'create');
                return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        article.category_article = category_article.toString();
        article.subcategory_article = subcategory_article.toString();
        // let listArticlesOut: any[] = [];
        let listArticles = [];
        let items = [];
        response = yield article.getAllArticlesOfAsociation();
        if (response.message !== 'success') {
            globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'create');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        listArticles = response.records;
        const item_article = new item_artic_1.default();
        yield Promise.all(listArticles.map((article, index, theArray) => __awaiter(void 0, void 0, void 0, function* () {
            if (article.cover_image_article === '') {
                article.cover_image_article = {
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
                article.cover_image_article = {
                    src: article.cover_image_article,
                    nameFile: '',
                    filePath: '',
                    fileImage: null,
                    isSelectedFile: false,
                    isDefault: false,
                    isChange: false,
                };
            }
            item_article.id_article_item_article = article.id_article;
            response = yield item_article.getListItemsOfArticle();
            if (response.message !== 'success') {
                globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'create');
                return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
            }
            items = response.records;
            items.forEach((itemArticle) => __awaiter(void 0, void 0, void 0, function* () {
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
            }));
            theArray[index].items_article = items;
            // listArticlesOut.push(article);
            // console.log('Componente ' + _name + ': listArticles: listArticlesOut ─> ');
        })));
        // console.log('Componente ' + _name + ': listArticles: *************************  fin listArticlesOut ─> ', listArticles);
        globals_1.default.updateResponse(200, '', 'ok', helper_1.default.basename(`${__filename}`), 'create', listArticles);
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
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
    let inTransaction = false;
    try {
        const auth = new auth_1.default();
        auth.id_user = req.body.user;
        console.log('Componente ' + _name + ': create: auth.id_user ─> ', auth.id_user);
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
        let id_asociation_article = parseInt(req.body.data.id_asociation_article);
        console.log('Componente ' + _name + ': create: id_asociation_article ─> ', id_asociation_article);
        if (auth.profile_user === 'superadmin' && id_asociation_article === 0) {
            // power
            id_asociation_article = parseInt('9'.repeat(9));
        }
        else if (['admin', 'editor'].includes(auth.profile_user) && id_asociation_article === auth.id_asociation_user) {
            // power
            const asoc = new asoc_1.default();
            asoc.id_asociation = id_asociation_article;
            response = yield asoc.getAsociationById();
            if (response.message !== 'success') {
                globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'create');
                return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
            }
            else if (response.num_records !== 1) {
                globals_1.default.updateResponse(400, 'Non unique record', 'Asociation not match', helper_1.default.basename(`${__filename}`), 'create');
                return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
            }
        }
        else {
            globals_1.default.updateResponse(400, 'User not authorized to edit Articles', 'User not authorized to edit Articles.', helper_1.default.basename(`${__filename}`), 'create');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        console.log('Componente ' + _name + ': create: id_asociation_article ─> ', id_asociation_article);
        const article = new artic_1.default();
        article.id_asociation_article = id_asociation_article;
        article.id_user_article = req.body.data.id_user_article;
        article.category_article = req.body.data.category_article;
        article.subcategory_article = req.body.data.subcategory_article;
        article.class_article = req.body.data.class_article;
        article.state_article = req.body.data.state_article;
        article.publication_date_article = req.body.data.publication_date_article;
        article.effective_date_article = req.body.data.effective_date_article;
        article.expiration_date_article = req.body.data.expiration_date_article;
        article.cover_image_article = '';
        article.title_article = req.body.data.title_article;
        article.abstract_article = req.body.data.abstract_article;
        article.ubication_article = req.body.data.ubication_article;
        let state_article = article.state_article;
        if (article.state_article === 'notificar') {
            article.state_article = 'publicado';
        }
        article.id_article = req.body.data.id_article;
        yield artic_1.default.initTransaccion();
        console.log('Componente ' + _name + ': create: initTransaccion ─> ');
        response = yield article.createArticle();
        // console.log('Componente ' + _name + ': create: response  ─> ', response);
        if (response.message !== 'success') {
            globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'create');
            // console.log('Componente ' + _name + ': create: Globals.httpResponse()  ─> ', Globals.httpResponse());
            yield artic_1.default.abortTransaccion();
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
            // return res.status(response.status).json({ message: response.error });
        }
        article.id_article = response.records.id;
        console.log('Componente ' + _name + ': create: article.id_article ─> ', article.id_article);
        if (state_article === 'notificar') {
            const notifications = new notifications_1.default();
            notifications.id_asociation_notifications = article.id_asociation_article;
            notifications.id_article_notifications = article.id_article;
            response = yield notifications.createNotification();
            if (response.message !== 'success') {
                yield artic_1.default.abortTransaccion();
                return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
            }
        }
        let items = {};
        if (req.body.items.length > 0) {
            yield Promise.all(req.body.items.forEach((item, index) => __awaiter(void 0, void 0, void 0, function* () {
                const item_article = new item_artic_1.default();
                item_article.id_item_article = index;
                item_article.id_article_item_article = article.id_article;
                item_article.text_item_article = item.text_item_article;
                response = yield item_article.createItemArticle();
                // console.log('Componente ' + _name + ': create: response  ─> ', response);
                if (response.message !== 'success') {
                    globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'create');
                    // console.log('Componente ' + _name + ': create: Globals.httpResponse()  ─> ', Globals.httpResponse());
                    yield artic_1.default.abortTransaccion();
                    return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
                    // return res.status(response.status).json({ message: response.error });
                }
            })));
            const item_article = new item_artic_1.default();
            item_article.id_article_item_article = article.id_article;
            response = yield item_article.getListItemsOfArticle();
            if (response.message === 'success') {
                items = response.records[0];
            }
            else {
                globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'create');
                yield artic_1.default.abortTransaccion();
                return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
            }
        }
        let article_data = {};
        response = yield article.getArticleById();
        if (response.message === 'success') {
            article_data = response.records[0];
        }
        else {
            globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'create');
            yield artic_1.default.abortTransaccion();
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        article_data.items_article = items;
        yield artic_1.default.endTransaccion();
        globals_1.default.updateResponse(200, '', 'ok', helper_1.default.basename(`${__filename}`), 'create', article_data);
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
    catch (error) {
        console.log('Componente asoc.controller: create: error ─> ', error);
        globals_1.default.updateResponse(500, error, 'Something goes wrong: ', helper_1.default.basename(`${__filename}`), 'create');
        if (inTransaction)
            yield artic_1.default.abortTransaccion();
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
});
exports.create = create;
const update = (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    let response = null;
    let inTransaction = false;
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
        let id_asociation_article = parseInt(req.body.data.id_asociation_article);
        if (auth.profile_user === 'superadmin') {
            // power
        }
        else if (['admin', 'editor'].includes(auth.profile_user) && id_asociation_article === auth.id_asociation_user) {
            // power
            const asoc = new asoc_1.default();
            asoc.id_asociation = id_asociation_article;
            response = yield asoc.getAsociationById();
            if (response.message !== 'success') {
                globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'update');
                return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
            }
            else if (response.num_records !== 1) {
                globals_1.default.updateResponse(400, 'Non unique record', 'Asociation not match', helper_1.default.basename(`${__filename}`), 'update');
                return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
            }
        }
        else {
            globals_1.default.updateResponse(400, 'User not authorized to update Articles', 'User not authorized to update Articles.', helper_1.default.basename(`${__filename}`), 'update');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        const article = new artic_1.default();
        article.id_article = req.body.data.id_article;
        response = yield article.getArticleById();
        if (response.message !== 'success') {
            globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'update');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        else if (req.body.data.date_updated_article !== article.date_updated_article) {
            globals_1.default.updateResponse(400, 'Record modified by another user', 'Record modified by another user', helper_1.default.basename(`${__filename}`), 'update');
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
        }
        const state_article_before = article.state_article;
        article.id_asociation_article = id_asociation_article;
        article.id_user_article = req.body.data.id_user_article;
        article.category_article = req.body.data.category_article;
        article.subcategory_article = req.body.data.subcategory_article;
        article.class_article = req.body.data.class_article;
        article.publication_date_article = req.body.data.publication_date_article;
        article.effective_date_article = req.body.data.effective_date_article;
        article.expiration_date_article = req.body.data.expiration_date_article;
        article.cover_image_article = '';
        article.title_article = req.body.data.title_article;
        article.abstract_article = req.body.data.abstract_article;
        article.ubication_article = req.body.data.ubication_article;
        article.date_updated_article = req.body.data.date_updated_article;
        if (article.state_article !== req.body.data.state_article && req.body.data.state_article === 'notificar') {
            article.state_article = 'publicado';
        }
        else {
            article.state_article = req.body.data.state_article;
        }
        inTransaction = true;
        // await Article.initTransaccion();
        response = yield article.updateArticle();
        if (response.message !== 'success') {
            globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'update');
            // console.log('Componente ' + _name + ': update: Globals.httpResponse()  ─> ', Globals.httpResponse());
            yield artic_1.default.abortTransaccion();
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
            // return res.status(response.status).json({ message: response.error });
        }
        else if (response.num_records !== 1) {
            globals_1.default.updateResponse(400, 'Non unique record', 'User not match', helper_1.default.basename(`${__filename}`), 'update');
            // console.log('Componente ' + _name + ': update: Globals.httpResponse()  ─> ', Globals.httpResponse());
            yield artic_1.default.abortTransaccion();
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
            // return res.status(response.status).json({ message: response.error });
        }
        const item_article = new item_artic_1.default();
        item_article.id_article_item_article = article.id_article;
        response = yield item_article.deleteItemsOfArticle();
        if (response.message !== 'success') {
            globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'update');
            // console.log('Componente ' + _name + ': update: Globals.httpResponse()  ─> ', Globals.httpResponse());
            yield artic_1.default.abortTransaccion();
            return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
            // return res.status(response.status).json({ message: response.error });
        }
        let items = [];
        helper_1.default.writeDebug('Componente ' + _name + ': createItemArticle: req.body.items  ─> ', req.body.items);
        yield insertItems(req.body.items, article.id_article, res);
        if (req.body.items.length > 0) {
            response = yield item_article.getListItemsOfArticle();
            if (response.message !== 'success') {
                globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'update');
                yield artic_1.default.abortTransaccion();
                return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
            }
            items = response.records;
            helper_1.default.writeDebug('Componente ' + _name + ': update: getListItemsOfArticle items ─> ', items);
        }
        if (state_article_before !== article.state_article && article.state_article === 'notificar') {
            const notifications = new notifications_1.default();
            notifications.id_asociation_notifications = article.id_asociation_article;
            notifications.id_article_notifications = article.id_article;
            response = yield notifications.createNotification();
            if (response.message !== 'success') {
                yield artic_1.default.abortTransaccion();
                return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse);
            }
            else if (response.num_records === 0) {
                response = yield notifications.createNotification();
                if (response.message !== 'success') {
                    yield artic_1.default.abortTransaccion();
                    return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse);
                }
                else if (response.num_records !== 1) {
                    globals_1.default.updateResponse(400, 'Non unique record for insert', 'Notification not match', helper_1.default.basename(`${__filename}`), 'update');
                    yield artic_1.default.abortTransaccion();
                    return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse);
                }
            }
            else if (response.num_records === 1) {
                notifications.state_notifications = (parseInt(notifications.state_notifications) + 1).toString();
                response = yield notifications.updateNotification();
                if (response.message !== 'success') {
                    yield artic_1.default.abortTransaccion();
                    return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse);
                }
                else if (response.num_records !== 1) {
                    globals_1.default.updateResponse(400, 'Non unique record for update', 'Notification not match', helper_1.default.basename(`${__filename}`), 'update');
                    yield artic_1.default.abortTransaccion();
                    return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse);
                }
            }
            else {
                globals_1.default.updateResponse(400, 'Non unique record', 'Notification not match', helper_1.default.basename(`${__filename}`), 'update');
                yield artic_1.default.abortTransaccion();
                return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse);
            }
        }
        // await Article.endTransaccion();
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
    catch (error) {
        console.log('Componente asoc.controller: update: error ─> ', error);
        globals_1.default.updateResponse(500, error, 'Something goes wrong: ', helper_1.default.basename(`${__filename}`), 'update');
        if (inTransaction)
            yield artic_1.default.abortTransaccion();
        return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
    }
});
exports.update = update;
const insertItems = (data, id_article, res) => __awaiter(void 0, void 0, void 0, function* () {
    let response = null;
    return new Promise((resolve, _reject) => __awaiter(void 0, void 0, void 0, function* () {
        if (data.length > 0) {
            const item_article = new item_artic_1.default();
            yield Promise.all(data.map((item, index) => __awaiter(void 0, void 0, void 0, function* () {
                helper_1.default.writeDebug('Componente ' + _name + ': createItemArticle:  index  ─> ', index);
                helper_1.default.writeDebug('Componente ' + _name + ': createItemArticle: item  ─> ', item);
                item_article.id_item_article = index;
                item_article.id_article_item_article = id_article;
                item_article.text_item_article = item.text_item_article;
                response = yield item_article.createItemArticle();
                if (response.message !== 'success') {
                    globals_1.default.updateResponse(response.status, response.message, response.message, helper_1.default.basename(`${__filename}`), 'create');
                    // console.log('Componente ' + _name + ': create: Globals.httpResponse()  ─> ', Globals.httpResponse());
                    yield artic_1.default.abortTransaccion();
                    return res.status(globals_1.default.getStatus()).json(globals_1.default.httpResponse());
                    // return res.status(response.status).json({ message: response.error });
                }
            })));
            resolve(true);
        }
        else {
            resolve(false);
        }
    }));
});
