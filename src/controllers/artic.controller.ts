import { Request, Response } from 'express';
import Globals from '../utils/globals';
import Helper from '../utils/helper';
import path from 'path';
import fs from 'fs-extra';
import Auth from '../models/auth';
import Asoc from '../models/asoc';
import Article from '../models/artic';
import ItemArticle from '../models/item_artic';
import Notifications from '../models/notifications';
import { PREFIX_ARTICLES, URL_SEPARATOR } from '../config/config';

const _name = 'artic.controller.ts';

export const listAll = async (req: Request, res: Response, _next: any) => {
    let response: any = null;
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
        const auth = new Auth();
        if (req.body.tokenValidate !== 'lack') {
            auth.id_user = req.body.user;
            response = await auth.getDataUserById();
            if (response.message !== 'success') {
                Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'listAll');
                return res.status(Globals.getStatus()).json(Globals.httpResponse());
            } else if (response.num_records !== 1) {
                Globals.updateResponse(400, 'Non unique record', 'User/password not match', Helper.basename(`${__filename}`), 'listAll');
                return res.status(Globals.getStatus()).json(Globals.httpResponse());
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
            } else if (auth.token_user !== req.body.token) {
                Globals.updateResponse(400, 'Token not match', 'Token not match', Helper.basename(`${__filename}`), 'listAll');
                return res.status(Globals.getStatus()).json(Globals.httpResponse());
            }

            isLogged = true;
        }

        const article = new Article();
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
                Globals.updateResponse(
                    400,
                    'User not authorized for try the listArticles list',
                    'User unauthorized.',
                    Helper.basename(`${__filename}`),
                    'create'
                );
                return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }

        article.category_article = category_article.toString();
        article.subcategory_article = subcategory_article.toString();

        // let listArticlesOut: any[] = [];
        let listArticles: any[] = [];
        let items: any[] = [];
        response = await article.getAllArticlesOfAsociation(auth.profile_user);
        if (response.message !== 'success') {
            Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'create');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }
        listArticles = response.records;

        const item_article = new ItemArticle();
        await Promise.all(
            listArticles.map(async (article: any, index: number, theArray: any[]) => {
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
                } else {
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
                response = await item_article.getListItemsOfArticle();
                if (response.message !== 'success') {
                    Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'create');
                    return res.status(Globals.getStatus()).json(Globals.httpResponse());
                }
                items = response.records;

                items.forEach(async (itemArticle: any) => {
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
                    } else {
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
                });

                theArray[index].items_article = items;
                // listArticlesOut.push(article);
                // console.log('Componente ' + _name + ': listArticles: listArticlesOut ─> ');
            })
        );

        // console.log('Componente ' + _name + ': listArticles: *************************  fin listArticlesOut ─> ', listArticles);
        Globals.updateResponse(200, '', 'ok', Helper.basename(`${__filename}`), 'create', listArticles);

        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    } catch (error: any) {
        console.log('Componente asoc.controller: listAll: error ─> ', error);
        Globals.updateResponse(500, error, 'Something goes wrong: ', Helper.basename(`${__filename}`), 'listAll');
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    }
};

export const create = async (req: Request, res: Response, _next: any) => {
    let response: any = null;
    let inTransaction = false;

    try {
        const auth = new Auth();
        auth.id_user = req.body.user;
        console.log('Componente ' + _name + ': create: auth.id_user ─> ', auth.id_user);

        response = await auth.getDataUserById();
        if (response.message !== 'success') {
            Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'create');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        } else if (response.num_records !== 1) {
            Globals.updateResponse(400, 'Non unique record', 'User/password not match', Helper.basename(`${__filename}`), 'create');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        } else if (auth.token_user !== req.body.token) {
            Globals.updateResponse(400, 'Token not match', 'Token not match', Helper.basename(`${__filename}`), 'create');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }

        let id_asociation_article: number = parseInt(req.body.data.id_asociation_article);
        console.log('Componente ' + _name + ': create: id_asociation_article ─> ', id_asociation_article);
        if (auth.profile_user === 'superadmin' && id_asociation_article === 0) {
            // power
            id_asociation_article = parseInt('9'.repeat(9));
        } else if (['admin', 'editor'].includes(auth.profile_user) && id_asociation_article === auth.id_asociation_user) {
            // power
            const asoc = new Asoc();
            asoc.id_asociation = id_asociation_article;
            response = await asoc.getAsociationById();
            if (response.message !== 'success') {
                Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'create');
                return res.status(Globals.getStatus()).json(Globals.httpResponse());
            } else if (response.num_records !== 1) {
                Globals.updateResponse(400, 'Non unique record', 'Asociation not match', Helper.basename(`${__filename}`), 'create');
                return res.status(Globals.getStatus()).json(Globals.httpResponse());
            }
        } else {
            Globals.updateResponse(
                400,
                'User not authorized to edit Articles',
                'User not authorized to edit Articles.',
                Helper.basename(`${__filename}`),
                'create'
            );
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }

        console.log('Componente ' + _name + ': create: id_asociation_article ─> ', id_asociation_article);
        const article = new Article();
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

        let state_article: string = article.state_article;
        if (article.state_article === 'notificar') {
            article.state_article = 'publicado';
        }
        article.id_article = req.body.data.id_article;

        await Article.initTransaccion();
        console.log('Componente ' + _name + ': create: initTransaccion ─> ');

        response = await article.createArticle();
        // console.log('Componente ' + _name + ': create: response  ─> ', response);
        if (response.message !== 'success') {
            Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'create');
            // console.log('Componente ' + _name + ': create: Globals.httpResponse()  ─> ', Globals.httpResponse());
            await Article.abortTransaccion();
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
            // return res.status(response.status).json({ message: response.error });
        }

        article.id_article = response.records.id;
        console.log('Componente ' + _name + ': create: article.id_article ─> ', article.id_article);

        if (state_article === 'notificar') {
            const notifications = new Notifications();
            notifications.id_asociation_notifications = article.id_asociation_article;
            notifications.id_article_notifications = article.id_article;
            response = await notifications.createNotification();
            if (response.message !== 'success') {
                await Article.abortTransaccion();
                return res.status(Globals.getStatus()).json(Globals.httpResponse());
            }
        }

        let items = {};
        if (req.body.items.length > 0) {
            await Promise.all(
                req.body.items.forEach(async (item: any, index: number) => {
                    const item_article = new ItemArticle();
                    item_article.id_item_article = index;
                    item_article.id_article_item_article = article.id_article;
                    item_article.text_item_article = item.text_item_article;

                    response = await item_article.createItemArticle();
                    // console.log('Componente ' + _name + ': create: response  ─> ', response);
                    if (response.message !== 'success') {
                        Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'create');
                        // console.log('Componente ' + _name + ': create: Globals.httpResponse()  ─> ', Globals.httpResponse());
                        await Article.abortTransaccion();
                        return res.status(Globals.getStatus()).json(Globals.httpResponse());
                        // return res.status(response.status).json({ message: response.error });
                    }
                })
            );

            const item_article = new ItemArticle();
            item_article.id_article_item_article = article.id_article;
            response = await item_article.getListItemsOfArticle();
            if (response.message === 'success') {
                items = response.records[0];
            } else {
                Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'create');
                await Article.abortTransaccion();
                return res.status(Globals.getStatus()).json(Globals.httpResponse());
            }
        }

        let article_data: any = {};
        response = await article.getArticleById();
        if (response.message === 'success') {
            article_data = response.records[0];
        } else {
            Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'create');
            await Article.abortTransaccion();
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }

        article_data.items_article = items;
        await Article.endTransaccion();
        Globals.updateResponse(200, '', 'ok', Helper.basename(`${__filename}`), 'create', article_data);

        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    } catch (error: any) {
        console.log('Componente asoc.controller: create: error ─> ', error);
        Globals.updateResponse(500, error, 'Something goes wrong: ', Helper.basename(`${__filename}`), 'create');
        if (inTransaction) await Article.abortTransaccion();
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    }
};

export const update = async (req: Request, res: Response, _next: any) => {
    let response: any = null;
    let inTransaction = false;

    try {
        const auth = new Auth();
        auth.id_user = req.body.user;
        if (req.body.tokenValidate !== 'valid') {
            Globals.updateResponse(400, 'User not logged', 'User not logged', Helper.basename(`${__filename}`), 'update');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }

        response = await auth.getDataUserById();
        if (response.message !== 'success') {
            Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'update');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        } else if (response.num_records !== 1) {
            Globals.updateResponse(400, 'Non unique record', 'User/password not match', Helper.basename(`${__filename}`), 'update');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        } else if (auth.token_user !== req.body.token) {
            Globals.updateResponse(400, 'Token not match', 'Token not match', Helper.basename(`${__filename}`), 'update');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }

        let id_asociation_article: number = parseInt(req.body.data.id_asociation_article);
        if (auth.profile_user === 'superadmin') {
            // power
        } else if (['admin', 'editor'].includes(auth.profile_user) && id_asociation_article === auth.id_asociation_user) {
            // power
            const asoc = new Asoc();
            asoc.id_asociation = id_asociation_article;
            response = await asoc.getAsociationById();
            if (response.message !== 'success') {
                Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'update');
                return res.status(Globals.getStatus()).json(Globals.httpResponse());
            } else if (response.num_records !== 1) {
                Globals.updateResponse(400, 'Non unique record', 'Asociation not match', Helper.basename(`${__filename}`), 'update');
                return res.status(Globals.getStatus()).json(Globals.httpResponse());
            }
        } else {
            Globals.updateResponse(
                400,
                'User not authorized to update Articles',
                'User not authorized to update Articles.',
                Helper.basename(`${__filename}`),
                'update'
            );
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }

        const article = new Article();
        article.id_article = req.body.data.id_article;
        response = await article.getArticleById();
        if (response.message !== 'success') {
            Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'update');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        } else if (req.body.data.date_updated_article !== article.date_updated_article) {
            Globals.updateResponse(
                400,
                'Record modified by another user',
                'Record modified by another user',
                Helper.basename(`${__filename}`),
                'update'
            );
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
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
        } else {
            article.state_article = req.body.data.state_article;
        }

        inTransaction = true;
        // await Article.initTransaccion();

        response = await article.updateArticle();
        if (response.message !== 'success') {
            Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'update');
            // console.log('Componente ' + _name + ': update: Globals.httpResponse()  ─> ', Globals.httpResponse());
            await Article.abortTransaccion();
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
            // return res.status(response.status).json({ message: response.error });
        } else if (response.num_records !== 1) {
            Globals.updateResponse(400, 'Non unique record', 'User not match', Helper.basename(`${__filename}`), 'update');
            // console.log('Componente ' + _name + ': update: Globals.httpResponse()  ─> ', Globals.httpResponse());
            await Article.abortTransaccion();
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
            // return res.status(response.status).json({ message: response.error });
        }

        const item_article = new ItemArticle();
        item_article.id_article_item_article = article.id_article;
        response = await item_article.deleteItemsOfArticle();
        if (response.message !== 'success') {
            Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'update');
            // console.log('Componente ' + _name + ': update: Globals.httpResponse()  ─> ', Globals.httpResponse());
            await Article.abortTransaccion();
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
            // return res.status(response.status).json({ message: response.error });
        }

        let items = [];
        Helper.writeDebug('Componente ' + _name + ': createItemArticle: req.body.items  ─> ', req.body.items);

        await insertItems(req.body.items, article.id_article, res);

        if (req.body.items.length > 0) {
            response = await item_article.getListItemsOfArticle();
            if (response.message !== 'success') {
                Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'update');
                await Article.abortTransaccion();
                return res.status(Globals.getStatus()).json(Globals.httpResponse());
            }
            items = response.records;
            Helper.writeDebug('Componente ' + _name + ': update: getListItemsOfArticle items ─> ', items);
        }

        if (state_article_before !== article.state_article && article.state_article === 'notificar') {
            const notifications = new Notifications();
            notifications.id_asociation_notifications = article.id_asociation_article;
            notifications.id_article_notifications = article.id_article;
            response = await notifications.createNotification();
            if (response.message !== 'success') {
                await Article.abortTransaccion();
                return res.status(Globals.getStatus()).json(Globals.httpResponse);
            } else if (response.num_records === 0) {
                response = await notifications.createNotification();
                if (response.message !== 'success') {
                    await Article.abortTransaccion();
                    return res.status(Globals.getStatus()).json(Globals.httpResponse);
                } else if (response.num_records !== 1) {
                    Globals.updateResponse(400, 'Non unique record for insert', 'Notification not match', Helper.basename(`${__filename}`), 'update');
                    await Article.abortTransaccion();
                    return res.status(Globals.getStatus()).json(Globals.httpResponse);
                }
            } else if (response.num_records === 1) {
                notifications.state_notifications = (parseInt(notifications.state_notifications) + 1).toString();
                response = await notifications.updateNotification();
                if (response.message !== 'success') {
                    await Article.abortTransaccion();
                    return res.status(Globals.getStatus()).json(Globals.httpResponse);
                } else if (response.num_records !== 1) {
                    Globals.updateResponse(400, 'Non unique record for update', 'Notification not match', Helper.basename(`${__filename}`), 'update');
                    await Article.abortTransaccion();
                    return res.status(Globals.getStatus()).json(Globals.httpResponse);
                }
            } else {
                Globals.updateResponse(400, 'Non unique record', 'Notification not match', Helper.basename(`${__filename}`), 'update');
                await Article.abortTransaccion();
                return res.status(Globals.getStatus()).json(Globals.httpResponse);
            }
        }

        // await Article.endTransaccion();

        let article_data: any = {};
        response = await article.getArticleUserById();
        if (response.message !== 'success') {
            Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'update');
            await Article.abortTransaccion();
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }

        article_data = response.records[0];

        await Promise.all(
            items.map(async (itemArticle: any) => {
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
                } else {
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
            })
        );

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
        } else {
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

        Globals.updateResponse(200, '', 'ok', Helper.basename(`${__filename}`), 'update', article_data);

        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    } catch (error: any) {
        console.log('Componente asoc.controller: update: error ─> ', error);
        Globals.updateResponse(500, error, 'Something goes wrong: ', Helper.basename(`${__filename}`), 'update');
        if (inTransaction) await Article.abortTransaccion();
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    }
};

const insertItems = async (data: any[], id_article: number, res: Response): Promise<any> => {
    let response = null;
    return new Promise(async (resolve, _reject) => {
        if (data.length > 0) {
            const item_article = new ItemArticle();
            await Promise.all(
                data.map(async (item: any, index: number) => {
                    Helper.writeDebug('Componente ' + _name + ': createItemArticle:  index  ─> ', index);
                    Helper.writeDebug('Componente ' + _name + ': createItemArticle: item  ─> ', item);
                    item_article.id_item_article = index;
                    item_article.id_article_item_article = id_article;
                    item_article.text_item_article = item.text_item_article;

                    response = await item_article.createItemArticle();
                    if (response.message !== 'success') {
                        Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'create');
                        // console.log('Componente ' + _name + ': create: Globals.httpResponse()  ─> ', Globals.httpResponse());
                        await Article.abortTransaccion();
                        return res.status(Globals.getStatus()).json(Globals.httpResponse());
                        // return res.status(response.status).json({ message: response.error });
                    }
                })
            );
            resolve(true);
        } else {
            resolve(false);
        }
    });
};

export const deleteArticle = async (req: Request, res: Response, _next: any) => {
    let response: any = null;
    const data = req.params;
    //{ id_asociation, date_updated_asociation }
    const id_auth = req.body.user;

    let prefix = '';
    let dir = '';

    try {
        const auth = new Auth();
        auth.id_user = id_auth;

        response = await auth.getDataUserById();
        if (response.message !== 'success') {
            Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'deleteArticle');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        } else if (response.num_records !== 1) {
            Globals.updateResponse(400, 'Non unique record', 'User/password not match', Helper.basename(`${__filename}`), 'deleteArticle');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        } else if (auth.token_user !== req.body.token) {
            Globals.updateResponse(400, 'Token not match', 'Token not match', Helper.basename(`${__filename}`), 'deleteArticle');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }

        const article = new Article();
        article.id_article = parseInt(data.id_article);
        response = await article.getArticleById();
        if (response.message !== 'success') {
            Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'deleteArticle');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        } else if (data.date_updated_article !== article.date_updated_article) {
            Globals.updateResponse(
                400,
                'Record modified by another user',
                'Record modified by another user',
                Helper.basename(`${__filename}`),
                'deleteArticle'
            );
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }

        // Validate priveleges
        if (auth.profile_user === 'superadmin' && article.id_asociation_article === parseInt('9'.repeat(9))) {
            // power
        } else if (['admin', 'editor'].includes(auth.profile_user) && article.id_asociation_article === auth.id_asociation_user) {
            // partial power
        } else {
            Globals.updateResponse(
                400,
                'User not authorized to delete articles',
                'User not authorized to delete articles',
                Helper.basename(`${__filename}`),
                'update'
            );
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }

        // Deleting images of items of article
        prefix =
            PREFIX_ARTICLES + data.id_asociation_article + URL_SEPARATOR + 'article-' + data.id_article.toString() + URL_SEPARATOR + 'items-images';
        console.log('Componente ' + _name + ': deleteArticle image itmes: prefix ─> ', prefix);

        dir = path.join(path.resolve('uploads'), prefix);

        console.log('Componente ' + _name + ': deleteArticle image itmes: dir ─> ', dir);

        try {
            await fs.remove(dir);
        } catch (error) {
            Globals.updateResponse(
                400,
                'Error delete image itmes directory',
                'Error delete image itmes directory',
                Helper.basename(`${__filename}`),
                'deleteArticle'
            );
            // console.log('Componente ' + _name + ': deleteArticle image itmes: Globals.httpResponse()  ─> ', Globals.httpResponse());
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }

        // Deleting items of article
        const item_article = new ItemArticle();
        item_article.id_article_item_article = article.id_article;
        response = await item_article.deleteItemsOfArticle();
        if (response.message !== 'success') {
            Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'deleteArticle');
            // console.log('Componente ' + _name + ': update: Globals.httpResponse()  ─> ', Globals.httpResponse());
            await Article.abortTransaccion();
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
            // return res.status(response.status).json({ message: response.error });
        }

        // Delete cover of article
        // prefix = PREFIX_ARTICLES + data.id_asociation_article + URL_SEPARATOR + 'article-' + req.body.id_article + URL_SEPARATOR + 'cover';
        prefix = PREFIX_ARTICLES + data.id_asociation_article + URL_SEPARATOR + 'article-' + req.body.id_article;
        console.log('Componente ' + _name + ': deleteCover: prefix ─> ', prefix);

        dir = path.join(path.resolve('uploads'), prefix);

        console.log('Componente ' + _name + ': deleteArticle cover: dir ─> ', dir);

        try {
            await fs.remove(dir);
        } catch (error) {
            Globals.updateResponse(
                400,
                'Error delete cover directory',
                'Error delete cover directory',
                Helper.basename(`${__filename}`),
                'deleteArticle'
            );
            // console.log('Componente ' + _name + ': deleteArticle cover: Globals.httpResponse()  ─> ', Globals.httpResponse());
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }

        response = await article.deleteArticle();
        if (response.message !== 'success') {
            Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'deleteArticle');
            // console.log('Componente ' + _name + ': deleteArticle: Globals.httpResponse()  ─> ', Globals.httpResponse());
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
            // return res.status(response.status).json({ message: response.error });
        } else if (response.num_records !== 1) {
            Globals.updateResponse(400, 'Non unique record', 'Article not match', Helper.basename(`${__filename}`), 'deleteArticle');
            // console.log('Componente ' + _name + ': deleteArticle: Globals.httpResponse()  ─> ', Globals.httpResponse());
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
            // return res.status(response.status).json({ message: response.error });
        }

        return res.status(200).json(Globals.httpResponse());
    } catch (error: any) {
        console.log('Componente ' + _name + ': deleteArticle: error ─> ', error);
        Globals.updateResponse(500, error, 'Something goes wrong: ', Helper.basename(`${__filename}`), 'deleteArticle');
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    }
};
