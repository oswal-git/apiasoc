import { NextFunction, Request, Response } from 'express';
import User from '../models/user';
import Globals from '../utils/globals';
import Helper from '../utils/helper';
import multer from 'multer';
import path from 'path';
import fs, { PathLike } from 'fs-extra';
import Auth from '../models/auth';
import Asoc from '../models/asoc';
import { v4 } from 'uuid';
import { BASE_URL, DIRECTORY_SEPARATOR, PORT, PREFIX_ARTICLES, PREFIX_AVATAR, PREFIX_LOGO, URL_SEPARATOR } from '../config/config';
import Article from '../models/artic';
import ItemArticle from '../models/item_artic';

// display list of customer

const _name = 'image.controller.ts';

export const uploadImage = async (req: Request, res: Response) => {
    let nameFile = '';
    let response: any = null;
    let prefix = '';
    console.log('Componente ' + _name + ': uploadImage ─> ');

    const auth = new Auth();

    try {
        const storage = multer.diskStorage({
            destination: async (req, _file, cb) => {
                Globals.dataApiRequest = { ...Globals.dataApiRequest, ...req.body, ...req.params, ...req.query, ...req.file };
                Helper.writeDebug('uploadImage: diskStorage Globals.apiRequest -> ', Globals.apiRequest);
                // console.log('uploadImage: diskStorage Globals.apiRequest -> ', Globals.apiRequest);
                console.log('Componente ' + _name + ': uploadImage: jwt ─> ', req.body.token);
                console.log('Componente ' + _name + ': uploadImage: req.body.date_updated ─> ', req.body.date_updated);
                const id =
                    req.body.module === 'users' ? req.body.user_id : req.body.module === 'asociations' ? req.body.asoc_id : req.body.id_article;
                const date_updated =
                    req.body.module === 'users'
                        ? req.body.date_updated
                        : req.body.module === 'asociations'
                        ? req.body.date_updated_asociation
                        : req.body.date_updated_article;
                const resp: any = await auth.checkToken(req.body.module, req.body.token, id, date_updated);
                if (resp.result !== 'valid') {
                    cb(new Error(resp.msg), '');
                } else {
                    prefix = req.body.module === 'users' ? PREFIX_AVATAR : req.body.module === 'asociations' ? PREFIX_LOGO : PREFIX_ARTICLES;
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
                            prefix = prefix + URL_SEPARATOR + 'article-' + req.body.id_article.toString() + URL_SEPARATOR + 'cover';
                        } else {
                            prefix = prefix + URL_SEPARATOR + 'article-' + req.body.id_article.toString() + URL_SEPARATOR + 'items-images';
                        }
                    }
                    const dir = path.join(path.resolve('uploads'), prefix);
                    console.log('Componente ' + _name + ': uploadImage: existsSync dir ─> ', dir, fs.existsSync(dir));
                    try {
                        await fs.emptyDir(dir);
                        console.log('Componente ' + _name + ': uploadImage: ensureDir dir ─> ', dir, fs.existsSync(dir));
                        console.log('Componente ' + _name + ': uploadImage: storage dir ─> ', dir);
                        cb(null, dir);
                    } catch (error: any) {
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
            },
            filename: (req: any, file: any, cb: any) => {
                console.log('Componente ' + _name + ': uploadImage: storage file ─> ', file);
                nameFile = `${req.body.user_name}_${v4()}${path.extname(file.originalname)}`;
                console.log('Componente ' + _name + ': uploadImage: storage: nameFile ─> ', nameFile);
                cb(null, nameFile);
            },
        });

        const upload = multer({ storage: storage }).single('file');

        try {
            let error = '';
            upload(req, res, async (err: any) => {
                if (err instanceof multer.MulterError) {
                    // A Multer error occurred when uploading.

                    console.log('Componente ' + _name + ': uploadImage: MulterError ─> ', err);
                    error = err.toString();
                    return res.status(500).json({ message: 'Something is wrong: ' + error });
                } else if (err) {
                    // An unknown error occurred when uploading.
                    console.log('Componente ' + _name + ': uploadImage: upload err ─> ', err.message);
                    console.log('Componente ' + _name + ': uploadImage: upload req.file ─> ', req.file);
                    error = err;
                    console.log('Componente ' + _name + ': uploadImage: upload dir ─> ', fs.existsSync(req.file?.destination as PathLike));
                    Globals.updateResponse(400, err.message, err.message, Helper.basename(`${__filename}`), 'update', error);
                    return res.status(Globals.getStatus()).json(Globals.httpResponse());
                } else {
                    Globals.dataApiRequest = { ...Globals.dataApiRequest, ...req.body, ...req.params, ...req.query, ...req.file };
                    Helper.writeDebug('uploadImage: upload Globals.apiRequest -> ', Globals.apiRequest);
                    Helper.writeDebug('uploadImage: upload req.file -> ', req.file);
                    // console.log('uploadImage: upload Globals.apiRequest -> ', Globals.apiRequest);
                    console.log('Componente ' + _name + ': uploadImage: upload req.file ─> ', req.file);
                    console.log('res');
                    const image = BASE_URL + ':' + PORT + URL_SEPARATOR + 'uploads' + URL_SEPARATOR + prefix + URL_SEPARATOR + req.file?.filename;
                    console.log('Componente ' + _name + ': uploadImage: upload image ─> ', image);
                    console.log('Componente ' + _name + ': uploadImage: upload path ─> ', req.file?.path);
                    if (req.body.module === 'users') {
                        const user = new User();
                        user.avatar_user = image;
                        user.id_user = req.body.user_id;
                        user.date_updated_user = req.body.date_updated;
                        response = await user.updateAvatar();
                        if (response.message !== 'success') {
                            Globals.updateResponse(
                                response.status,
                                response.message,
                                response.message,
                                Helper.basename(`${__filename}`),
                                'uploadImage'
                            );
                            // console.log('Componente ' + _name + ': uploadImage: Globals.httpResponse()  ─> ', Globals.httpResponse());
                            return res.status(Globals.getStatus()).json(Globals.httpResponse());
                            // return res.status(response.status).json({ message: response.error });
                        } else if (response.num_records !== 1) {
                            Globals.updateResponse(400, 'Non unique record', 'User not match', Helper.basename(`${__filename}`), 'uploadImage');
                            // console.log('Componente ' + _name + ': uploadImage: Globals.httpResponse()  ─> ', Globals.httpResponse());
                            return res.status(Globals.getStatus()).json(Globals.httpResponse());
                            // return res.status(response.status).json({ message: response.error });
                        }

                        response = await user.getDataUserById();
                        if (response.message === 'success') {
                            return res.status(Globals.getStatus()).json(Globals.httpResponse());
                        } else {
                            Globals.updateResponse(
                                response.status,
                                response.message,
                                response.message,
                                Helper.basename(`${__filename}`),
                                'uploadImage'
                            );
                            return res.status(Globals.getStatus()).json(Globals.httpResponse());
                        }
                    } else if (req.body.module === 'asociations') {
                        console.log('Componente ' + _name + ': uploadImage: image ─> ');
                        const asoc = new Asoc();
                        asoc.logo_asociation = image;
                        asoc.id_asociation = req.body.asoc_id;
                        asoc.date_updated_asociation = req.body.date_updated_asociation;
                        response = await asoc.updateLogo();
                        if (response.message !== 'success') {
                            Globals.updateResponse(
                                response.status,
                                response.message,
                                response.message,
                                Helper.basename(`${__filename}`),
                                'uploadImage'
                            );
                            // console.log('Componente ' + _name + ': uploadImage: Globals.httpResponse()  ─> ', Globals.httpResponse());
                            return res.status(Globals.getStatus()).json(Globals.httpResponse());
                            // return res.status(response.status).json({ message: response.error });
                        } else if (response.num_records !== 1) {
                            Globals.updateResponse(400, 'Non unique record', 'User not match', Helper.basename(`${__filename}`), 'uploadImage');
                            // console.log('Componente ' + _name + ': uploadImage: Globals.httpResponse()  ─> ', Globals.httpResponse());
                            return res.status(Globals.getStatus()).json(Globals.httpResponse());
                            // return res.status(response.status).json({ message: response.error });
                        }

                        response = await asoc.getAsociationById();
                        if (response.message === 'success') {
                            return res.status(Globals.getStatus()).json(Globals.httpResponse());
                        } else {
                            Globals.updateResponse(
                                response.status,
                                response.message,
                                response.message,
                                Helper.basename(`${__filename}`),
                                'uploadImage'
                            );
                            return res.status(Globals.getStatus()).json(Globals.httpResponse());
                        }
                    } else if (req.body.module === 'articles') {
                        console.log('Componente ' + _name + ': uploadImage: image ─> articles');
                        const article = new Article();
                        article.id_article = req.body.id_article;
                        article.cover_image_article = image;
                        article.date_updated_article = req.body.date_updated_article;
                        response = await article.updateCover();
                        if (response.message !== 'success') {
                            Globals.updateResponse(
                                response.status,
                                response.message,
                                response.message,
                                Helper.basename(`${__filename}`),
                                'uploadImage'
                            );
                            // console.log('Componente ' + _name + ': uploadImage: Globals.httpResponse()  ─> ', Globals.httpResponse());
                            return res.status(Globals.getStatus()).json(Globals.httpResponse());
                            // return res.status(response.status).json({ message: response.error });
                        } else if (response.num_records !== 1) {
                            Globals.updateResponse(400, 'Non unique record', 'User not match', Helper.basename(`${__filename}`), 'uploadImage');
                            // console.log('Componente ' + _name + ': uploadImage: Globals.httpResponse()  ─> ', Globals.httpResponse());
                            return res.status(Globals.getStatus()).json(Globals.httpResponse());
                            // return res.status(response.status).json({ message: response.error });
                        }

                        let items = [];
                        const item_article = new ItemArticle();
                        item_article.id_article_item_article = article.id_article;
                        response = await item_article.getListItemsOfArticle();
                        if (response.message !== 'success') {
                            Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'update');
                            await Article.abortTransaccion();
                            return res.status(Globals.getStatus()).json(Globals.httpResponse());
                        }
                        items = response.records;
                        Helper.writeDebug('Componente ' + _name + ': update: getListItemsOfArticle items ─> ', items);

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
                    }
                }
            });
        } catch (error: any) {
            console.log('Componente ' + _name + ': uploadImage: catch err ─> ', error.message);
            return res.status(500).json({ message: 'Something goes wrong: ' + error });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Something big goes wrong: ' + error });
    }
};

export const uploadItemImage = async (req: Request, res: Response) => {
    let nameFile = '';
    let response: any = null;
    let prefix = '';
    let dir = '';
    let dirOld = '';

    console.log('Componente ' + _name + ': uploadItemImage ─> ');

    const auth = new Auth();

    try {
        const storage = multer.diskStorage({
            destination: async (req, file, cb) => {
                Globals.dataApiRequest = { ...Globals.dataApiRequest, ...req.body, ...req.params, ...req.query, ...req.file, ...file };
                Helper.writeDebug('uploadItemImage: diskStorage Globals.apiRequest -> ', Globals.apiRequest);
                console.log('Componente ' + _name + ': uploadItemImage: file ─> ', file);
                // console.log('uploadItemImage: diskStorage Globals.apiRequest -> ', Globals.apiRequest);
                console.log('Componente ' + _name + ': uploadItemImage: jwt ─> ', req.body.token);
                console.log('Componente ' + _name + ': uploadItemImage: req.body.date_updated ─> ', req.body.date_updated);
                const resp: any = await auth.checkToken(req.body.module, req.body.token, req.body.id_article, req.body.date_updated_article);
                if (resp.result !== 'valid') {
                    cb(new Error(resp.msg), '');
                } else {
                    prefix =
                        PREFIX_ARTICLES +
                        req.body.id_asociation_article +
                        URL_SEPARATOR +
                        'article-' +
                        req.body.id_article.toString() +
                        URL_SEPARATOR +
                        'items-images';
                    //  'images' + '/asociation-' + asoc + '/article-' + image.id_article.toString() + '/cover'
                    // console.log('Componente ' + _name + ': uploadItemImage: storage prefix 2─> ', prefix);

                    dir = path.join(path.resolve('uploads'), prefix);
                    dirOld = dir + '-old';
                    console.log('Componente ' + _name + ': uploadItemImage: existsSync dir ─> ', dir, fs.existsSync(dir));
                    console.log('Componente ' + _name + ': uploadItemImage: req.body.first ─> ', req.body.first);

                    const existsDir = await fs.pathExists(dir);
                    console.log('Componente ' + _name + ': uploadItemImage: existsSync dir existsDir ─> ', dir, existsDir);
                    if (req.body.first === 'true') {
                        try {
                            if (existsDir) {
                                console.log('Componente ' + _name + ': uploadItemImage: req.body.first ─> move');
                                await fs.move(dir, dirOld, { overwrite: true });
                                console.log('Componente ' + _name + ': uploadItemImage: req.body.first + ─> emptyDir');
                                await fs.emptyDir(dir);
                            } else {
                                console.log('Componente ' + _name + ': uploadItemImage: req.body.first ─> emptyDir');
                                await fs.emptyDir(dir);
                            }
                        } catch (error: any) {
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
            },
            filename: (req: any, file: any, cb: any) => {
                console.log('Componente ' + _name + ': uploadItemImage: storage file ─> ', file);
                nameFile = `${req.body.user_name}_${v4()}${path.extname(file.originalname)}`;
                console.log('Componente ' + _name + ': uploadItemImage: storage: nameFile ─> ', nameFile);
                cb(null, nameFile);
            },
        });

        const upload = multer({ storage: storage }).single('file');

        try {
            let error = '';
            upload(req, res, async (err: any) => {
                if (err instanceof multer.MulterError) {
                    // A Multer error occurred when uploading.
                    console.log('Componente ' + _name + ': uploadItemImage: MulterError ─> ', err);
                    error = err.toString();
                    return res.status(500).json({ message: 'Something is wrong: ' + error });
                } else if (err) {
                    // An unknown error occurred when uploading.
                    console.log('Componente ' + _name + ': uploadItemImage: upload err ─> ', err.message);
                    console.log('Componente ' + _name + ': uploadItemImage: upload req.file ─> ', req.file);
                    error = err;
                    console.log('Componente ' + _name + ': uploadItemImage: upload dir ─> ', fs.existsSync(req.file?.destination as PathLike));
                    Globals.updateResponse(400, err.message, err.message, Helper.basename(`${__filename}`), 'update', error);
                    return res.status(Globals.getStatus()).json(Globals.httpResponse());
                } else {
                    Globals.dataApiRequest = { ...Globals.dataApiRequest, ...req.body, ...req.params, ...req.query, ...req.file };
                    Helper.writeDebug('uploadItemImage: upload Globals.apiRequest -> ', Globals.apiRequest);
                    Helper.writeDebug('uploadItemImage: upload req.file -> ', req.file);
                    // console.log('uploadItemImage: upload Globals.apiRequest -> ', Globals.apiRequest);
                    console.log('Componente ' + _name + ': uploadItemImage: upload req.file ─> ', req.file);
                    console.log('res');

                    // ----------------- make the image path                              //
                    const image = BASE_URL + ':' + PORT + URL_SEPARATOR + 'uploads' + URL_SEPARATOR + prefix + URL_SEPARATOR + req.file?.filename;
                    console.log('Componente ' + _name + ': uploadItemImage: upload image ─> ', image);
                    console.log('Componente ' + _name + ': uploadItemImage: upload path ─> ', req.file?.path);

                    console.log('Componente ' + _name + ': uploadItemImage: image ─> articles');

                    // ----------------------------------------------------------------------//
                    //                          UPDATE ITEMARTICLE                           //
                    // ----------------------------------------------------------------------//
                    const item_article = new ItemArticle();
                    item_article.id_item_article = req.body.id_item_article;
                    item_article.id_article_item_article = req.body.id_article;
                    item_article.image_item_article = image;
                    response = await item_article.updateImageItem();
                    if (response.message !== 'success') {
                        Globals.updateResponse(
                            response.status,
                            response.message,
                            response.message,
                            Helper.basename(`${__filename}`),
                            'uploadItemImage'
                        );
                        // console.log('Componente ' + _name + ': uploadItemImage: Globals.httpResponse()  ─> ', Globals.httpResponse());
                        return res.status(Globals.getStatus()).json(Globals.httpResponse());
                        // return res.status(response.status).json({ message: response.error });
                    } else if (response.num_records !== 1) {
                        Globals.updateResponse(400, 'Non unique record', 'Item not match', Helper.basename(`${__filename}`), 'uploadItemImage');
                        // console.log('Componente ' + _name + ': uploadItemImage: Globals.httpResponse()  ─> ', Globals.httpResponse());
                        return res.status(Globals.getStatus()).json(Globals.httpResponse());
                        // return res.status(response.status).json({ message: response.error });
                    }

                    // ----------------------------------------------------------------------//
                    //                            DELETE OLD DIR                             //
                    // ----------------------------------------------------------------------//
                    const existsDirOld = await fs.pathExists(dirOld);

                    if (req.body.last === 'true' && existsDirOld) {
                        try {
                            await fs.remove(dirOld);
                        } catch (error) {
                            Globals.updateResponse(
                                400,
                                'Error delete old images directory',
                                'Error delete old images directory',
                                Helper.basename(`${__filename}`),
                                'uploadItemImage'
                            );
                            // console.log('Componente ' + _name + ': uploadItemImage: Globals.httpResponse()  ─> ', Globals.httpResponse());
                            return res.status(Globals.getStatus()).json(Globals.httpResponse());
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

                    const article = new Article();
                    article.id_article = req.body.id_article;
                    let article_data: any = {};
                    response = await article.getArticleUserById();
                    if (response.message !== 'success') {
                        Globals.updateResponse(
                            response.status,
                            response.message,
                            response.message,
                            Helper.basename(`${__filename}`),
                            'uploadItemImage'
                        );
                        await Article.abortTransaccion();
                        return res.status(Globals.getStatus()).json(Globals.httpResponse());
                    }

                    article_data = response.records[0];

                    //  -------------------------------------------------------------------  //
                    //                         GET ITEMARTICLE                               //
                    //  -------------------------------------------------------------------  //

                    let items = [];

                    item_article.id_article_item_article = article.id_article;
                    response = await item_article.getListItemsOfArticle();
                    if (response.message !== 'success') {
                        Globals.updateResponse(
                            response.status,
                            response.message,
                            response.message,
                            Helper.basename(`${__filename}`),
                            'uploadItemImage'
                        );
                        await Article.abortTransaccion();
                        return res.status(Globals.getStatus()).json(Globals.httpResponse());
                    }
                    items = response.records;
                    Helper.writeDebug('Componente ' + _name + ': uploadItemImage: getListItemsOfArticle items ─> ', items);

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

                    //  -------------------------------------------------------------------  //
                    //                         FINAL RESPONSE                               //
                    //  -------------------------------------------------------------------  //

                    Globals.updateResponse(200, '', 'ok', Helper.basename(`${__filename}`), 'uploadItemImage', article_data);

                    return res.status(Globals.getStatus()).json(Globals.httpResponse());
                }
            });
        } catch (error: any) {
            console.log('Componente ' + _name + ': uploadItemImage: catch err ─> ', error.message);
            return res.status(500).json({ message: 'Something goes wrong: ' + error });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Something big goes wrong: ' + error });
    }
};

export const moveItemImage = async (req: Request, res: Response) => {
    let nameOldFile = '';
    let nameFile = '';
    let response: any = null;
    let prefix = '';
    let dir = '';
    let dirOld = '';
    console.log('Componente ' + _name + ': moveItemImage ─> ');

    const data = req.body;
    console.log('Componente ' + _name + ': moveItemImage: data ─> ', data);

    try {
        const auth = new Auth();
        auth.id_user = data.user;
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

        console.log('Componente ' + _name + ': moveItemImage: find auth ─> ');
        const article = new Article();
        article.id_article = data.id_article;
        response = await article.getArticleById();
        if (response.message !== 'success') {
            Globals.updateResponse(400, response.message, response.message, Helper.basename(`${__filename}`), 'update');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        } else if (article.date_updated_article !== data.date_updated_article) {
            Globals.updateResponse(
                400,
                'Record modified by another user. Refresh it, please.',
                'Record modified by another user. Refresh it, please.',
                Helper.basename(`${__filename}`),
                'update'
            );
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }

        if (auth.profile_user === 'superadmin' && article.id_asociation_article === parseInt('9'.repeat(9))) {
            // power
        } else if (['admin', 'editor'].includes(auth.profile_user) && article.id_asociation_article === auth.id_asociation_user) {
            // partial power
        } else {
            Globals.updateResponse(
                400,
                'User not authorized to modify images',
                'User not authorized to modify images',
                Helper.basename(`${__filename}`),
                'update'
            );
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }

        console.log('Componente ' + _name + ': moveItemImage: data.date_updated ─> ', data.date_updated);
        prefix =
            PREFIX_ARTICLES + data.id_asociation_article + URL_SEPARATOR + 'article-' + data.id_article.toString() + URL_SEPARATOR + 'items-images';
        //  'images' + '/asociation-' + asoc + '/article-' + image.id_article.toString() + '/cover'
        // console.log('Componente ' + _name + ': moveItemImage: storage prefix 2─> ', prefix);

        dir = path.join(path.resolve('uploads'), prefix);
        dirOld = dir + '-old';
        console.log('Componente ' + _name + ': moveItemImage: existsSync dir ─> ', data.index, dir, fs.existsSync(dir));

        const existsDir = await fs.pathExists(dir);
        console.log('Componente ' + _name + ': moveItemImage: existsSync dir existsDir ─> ', data.index, dir, existsDir);

        if (data.first === 'true') {
            try {
                if (existsDir) {
                    await fs.move(dir, dirOld, { overwrite: true });
                    await fs.emptyDir(dir);
                } else {
                    await fs.emptyDir(dir);
                }
            } catch (error: any) {
                console.log('Componente ' + _name + ': uploadItemImage: move error ─> ', error);
                Globals.updateResponse(
                    400,
                    'Error moving images directory',
                    'Error moving images directory',
                    Helper.basename(`${__filename}`),
                    'uploadItemImage'
                );
                // console.log('Componente ' + _name + ': uploadItemImage: Globals.httpResponse()  ─> ', Globals.httpResponse());
                return res.status(Globals.getStatus()).json(Globals.httpResponse());
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
        console.log('Componente ' + _name + ': moveItemImage: dir ─> ', dir, fs.existsSync(dir));
        console.log('Componente ' + _name + ': moveItemImage: storage dir ─> ', dir);

        console.log('Componente ' + _name + ': moveItemImage: file_src ─> ', data.file_src);
        nameOldFile = `${path.basename(data.file_src)}`;
        nameFile = `${data.user_name}_${v4()}${path.extname(data.name)}`;
        const target_file_old = dirOld + DIRECTORY_SEPARATOR + nameOldFile;
        const target_file = dir + DIRECTORY_SEPARATOR + nameFile;

        // fs.moveSync(target_file_old, target_file, { overwrite: true });
        await fs.move(target_file_old, target_file, { overwrite: true });

        const existsDirOld = await fs.pathExists(dirOld);

        if (data.last === 'true' && existsDirOld) {
            try {
                await fs.remove(dirOld);
            } catch (error) {
                Globals.updateResponse(
                    400,
                    'Error delete old images directory',
                    'Error delete old images directory',
                    Helper.basename(`${__filename}`),
                    'uploadItemImage'
                );
                // console.log('Componente ' + _name + ': uploadItemImage: Globals.httpResponse()  ─> ', Globals.httpResponse());
                return res.status(Globals.getStatus()).json(Globals.httpResponse());
            }

            // if (fs.existsSync(dirOld)) {
            //     console.log('Componente ' + _name + ': moveItemImage: emptyDirSync dir ─> ', dir, fs.existsSync(dirOld));
            //     fs.emptyDirSync(dirOld);
            // }
        }

        console.log('Componente ' + _name + ': moveItemImage: storage: nameFile ─> ', nameFile);

        Helper.writeDebug('moveItemImage: upload Globals.apiRequest -> ', Globals.apiRequest);
        Helper.writeDebug('moveItemImage: upload req.file -> ', req.file);
        // console.log('moveItemImage: upload Globals.apiRequest -> ', Globals.apiRequest);
        console.log('Componente ' + _name + ': moveItemImage: upload req.file ─> ', req.file);
        console.log('res');

        const image = BASE_URL + ':' + PORT + URL_SEPARATOR + 'uploads' + URL_SEPARATOR + prefix + URL_SEPARATOR + nameFile;
        console.log('Componente ' + _name + ': moveItemImage: upload image ─> ', image);
        console.log('Componente ' + _name + ': moveItemImage: upload path ─> ', req.file?.path);

        console.log('Componente ' + _name + ': moveItemImage: image ─> articles');

        const item_article = new ItemArticle();
        item_article.id_item_article = data.id_item_article;
        item_article.id_article_item_article = data.id_article;
        item_article.image_item_article = image;
        response = await item_article.updateImageItem();
        if (response.message !== 'success') {
            Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'moveItemImage');
            // console.log('Componente ' + _name + ': moveItemImage: Globals.httpResponse()  ─> ', Globals.httpResponse());
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
            // return res.status(response.status).json({ message: response.error });
        } else if (response.num_records !== 1) {
            Globals.updateResponse(400, 'Non unique record', 'Item not match', Helper.basename(`${__filename}`), 'moveItemImage');
            // console.log('Componente ' + _name + ': moveItemImage: Globals.httpResponse()  ─> ', Globals.httpResponse());
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
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
        let article_data: any = {};
        response = await article.getArticleUserById();
        if (response.message !== 'success') {
            Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'moveItemImage');
            await Article.abortTransaccion();
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }

        article_data = response.records[0];

        let items = [];

        item_article.id_article_item_article = article.id_article;
        response = await item_article.getListItemsOfArticle();
        if (response.message !== 'success') {
            Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'moveItemImage');
            await Article.abortTransaccion();
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }
        items = response.records;
        Helper.writeDebug('Componente ' + _name + ': moveItemImage: getListItemsOfArticle items ─> ', items);

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

        Globals.updateResponse(200, '', 'ok', Helper.basename(`${__filename}`), 'moveItemImage', article_data);

        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    } catch (error) {
        return res.status(500).json({ message: 'Something big goes wrong: ' + error });
    }
};

export const deleteImage = async (req: Request, res: Response) => {
    const _name = 'user.controler';
    let response: any = null;
    // const { prefix, id_user, date_updated_user } = req.params;
    //.toString().replace(/\//g, '#');
    const data = req.params;
    const id_auth = req.body.user;
    console.log('Componente ' + _name + ': deleteImage: data ─> ', data);
    let prefix = req.body.module === 'users' ? PREFIX_AVATAR : req.body.module === 'asociations' ? PREFIX_LOGO : PREFIX_ARTICLES;
    prefix = prefix + data.id_user;

    console.log('Componente ' + _name + ': deleteImage: prefix ─> ', prefix);
    console.log('Componente ' + _name + ': deleteImage: id_user ─> ', data.id_user);
    console.log('Componente ' + _name + ': deleteImage: date_updated_user ─> ', data.date_updated_user);

    const auth = new Auth();
    auth.id_user = id_auth;

    response = await auth.getDataUserById();
    if (response.message !== 'success') {
        Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'deleteImage');
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    } else if (response.num_records !== 1) {
        Globals.updateResponse(400, 'Non unique record', 'User/password not match', Helper.basename(`${__filename}`), 'deleteImage');
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    } else if (auth.token_user !== req.body.token) {
        Globals.updateResponse(400, 'Token not match', 'Token not match', Helper.basename(`${__filename}`), 'deleteImage');
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    }

    const user = new User();
    user.id_user = parseInt(data.id_user);

    response = await user.getDataUserById();
    if (response.message !== 'success') {
        Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'deleteImage');
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    } else if (response.num_records !== 1) {
        Globals.updateResponse(400, 'Non unique record', 'User/password not match', Helper.basename(`${__filename}`), 'deleteImage');
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    } else if (user.date_updated_user !== data.date_updated_user) {
        Globals.updateResponse(
            400,
            'Record modified by another user',
            'Record modified by another user. Refresh it, please. Logout and login again.',
            Helper.basename(`${__filename}`),
            'deleteImage'
        );
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    }

    if (user.id_user === auth.id_user) {
        Helper.writeDebug('user modifies his own avatar', '');
        // user modifies his own avatar
    } else if (auth.profile_user === 'superadmin') {
        // power
    } else if (auth.profile_user === 'admin' && auth.id_asociation_user === user.id_asociation_user) {
        // partial power
    } else {
        Globals.updateResponse(
            400,
            'User not authorized to delete image',
            'User not authorized to delete image.',
            Helper.basename(`${__filename}`),
            'deleteImage'
        );
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    }

    // const dir = path.join(path.resolve('uploads'), prefix?.toString().replace(/:/g, '/'));
    const dir = path.join(path.resolve('uploads'), prefix);

    console.log('Componente ' + _name + ': deleteImage: dir ─> ', dir);

    await fs.remove(dir);

    // if (fs.existsSync(dir)) {
    //     // fs.emptyDirSync(dir);
    //     fs.rmSync(dir, { recursive: true, force: true });
    // }

    user.avatar_user = '';
    response = await user.updateAvatar();
    if (response.message !== 'success') {
        Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'uploadImage');
        // console.log('Componente ' + _name + ': uploadImage: Globals.httpResponse()  ─> ', Globals.httpResponse());
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
        // return res.status(response.status).json({ message: response.error });
    } else if (response.num_records !== 1) {
        Globals.updateResponse(400, 'Non unique record', 'User not match', Helper.basename(`${__filename}`), 'uploadImage');
        // console.log('Componente ' + _name + ': uploadImage: Globals.httpResponse()  ─> ', Globals.httpResponse());
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
        // return res.status(response.status).json({ message: response.error });
    }

    response = await user.getDataUserById();
    if (response.message === 'success') {
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    } else {
        Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'uploadImage');
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    }
};

export const deleteCover = async (req: Request, res: Response) => {
    let response: any = null;
    const data = req.params;
    const id_auth = req.body.user;
    console.log('Componente ' + _name + ': deleteCover: data ─> ', data);

    console.log('Componente ' + _name + ': deleteCover: id_article ─> ', data.id_article);
    console.log('Componente ' + _name + ': deleteCover: date_updated_article ─> ', data.date_updated_article);

    let prefix = PREFIX_ARTICLES + data.id_asociation_article + URL_SEPARATOR + 'article-' + req.body.id_article + URL_SEPARATOR + 'cover';
    console.log('Componente ' + _name + ': deleteCover: prefix ─> ', prefix);

    const auth = new Auth();
    auth.id_user = id_auth;

    response = await auth.getDataUserById();
    if (response.message !== 'success') {
        Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'deleteCover');
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    } else if (response.num_records !== 1) {
        Globals.updateResponse(400, 'Non unique record', 'User/password not match', Helper.basename(`${__filename}`), 'deleteCover');
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    } else if (auth.token_user !== req.body.token) {
        Globals.updateResponse(400, 'Token not match', 'Token not match', Helper.basename(`${__filename}`), 'deleteCover');
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    }

    const article = new Article();
    article.id_article = parseInt(data.id_article);
    response = await article.getArticleById();
    if (response.message !== 'success') {
        Globals.updateResponse(400, response.message, response.message, Helper.basename(`${__filename}`), 'deleteCover');
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    } else if (article.date_updated_article !== data.date_updated_article) {
        Globals.updateResponse(
            400,
            'Record modified by another user. Refresh it, please.',
            'Record modified by another user. Refresh it, please.',
            Helper.basename(`${__filename}`),
            'deleteCover'
        );
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    }

    if (auth.profile_user === 'superadmin' && article.id_asociation_article === parseInt('9'.repeat(9))) {
        // power
    } else if (['admin', 'editor'].includes(auth.profile_user) && article.id_asociation_article === auth.id_asociation_user) {
        // partial power
    } else {
        Globals.updateResponse(
            400,
            'User not authorized to modify images',
            'User not authorized to modify images',
            Helper.basename(`${__filename}`),
            'deleteCover'
        );
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    }

    // const dir = path.join(path.resolve('uploads'), prefix?.toString().replace(/:/g, '/'));
    const dir = path.join(path.resolve('uploads'), prefix);

    console.log('Componente ' + _name + ': deleteCover: dir ─> ', dir);

    await fs.remove(dir);
    // if (fs.existsSync(dir)) {
    //     // fs.emptyDirSync(dir);
    //     fs.rmSync(dir, { recursive: true, force: true });
    // }

    console.log('Componente ' + _name + ': deleteCover: cover ─> articles');

    article.id_article = parseInt(data.id_article);
    article.cover_image_article = '';
    article.date_updated_article = data.date_updated_article;
    response = await article.updateCover();
    if (response.message !== 'success') {
        Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'deleteCover');
        // console.log('Componente ' + _name + ': deleteCover: Globals.httpResponse()  ─> ', Globals.httpResponse());
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
        // return res.status(response.status).json({ message: response.error });
    } else if (response.num_records !== 1) {
        Globals.updateResponse(400, 'Non unique record', 'User not match', Helper.basename(`${__filename}`), 'deleteCover');
        // console.log('Componente ' + _name + ': deleteCover: Globals.httpResponse()  ─> ', Globals.httpResponse());
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
        // return res.status(response.status).json({ message: response.error });
    }

    let items = [];
    const item_article = new ItemArticle();
    item_article.id_article_item_article = article.id_article;
    response = await item_article.getListItemsOfArticle();
    if (response.message !== 'success') {
        Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'deleteCover');
        await Article.abortTransaccion();
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    }
    items = response.records;
    Helper.writeDebug('Componente ' + _name + ': deleteCover: getListItemsOfArticle items ─> ', items);

    let article_data: any = {};
    response = await article.getArticleUserById();
    if (response.message !== 'success') {
        Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'deleteCover');
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

    Globals.updateResponse(200, '', 'ok', Helper.basename(`${__filename}`), 'deleteCover', article_data);

    return res.status(Globals.getStatus()).json(Globals.httpResponse());
};
