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
const mysql_1 = __importDefault(require("../config/bd/mysql"));
const globals_1 = __importDefault(require("../utils/globals"));
const helper_1 = __importDefault(require("../utils/helper"));
class Article extends mysql_1.default {
    constructor() {
        super();
        this.className = 'Article';
        this.id_article = 0;
        this.id_asociation_article = 0;
        this.id_user_article = 0;
        this.category_article = '';
        this.subcategory_article = '';
        this.class_article = '';
        this.state_article = '';
        this.publication_date_article = '';
        this.effective_date_article = '';
        this.expiration_date_article = '';
        this.cover_image_article = '';
        this.title_article = '';
        this.abstract_article = '';
        this.ubication_article = '';
        this.date_deleted_article = '';
        this.date_created_article = '';
        this.date_updated_article = '';
        this.getArticleById = () => __awaiter(this, void 0, void 0, function* () {
            const arrData = [this.id_article];
            const sql = `SELECT	  a.id_article
                            , a.id_asociation_article
                            , a.id_user_article
                            , a.category_article
                            , a.subcategory_article
                            , a.class_article
                            , a.state_article
                            , a.publication_date_article
                            , a.effective_date_article
                            , a.expiration_date_article
                            , a.cover_image_article
                            , a.title_article
                            , a.abstract_article
                            , a.ubication_article
                            , COALESCE(a.date_deleted_article,'') as date_deleted_article
                            , a.date_created_article
                            , COALESCE(a.date_updated_article,'') as date_updated_article
                    FROM articles a
                    WHERE a.id_article = ?;`;
            const response = yield this.getAll(sql, arrData);
            if (response.message !== 'success') {
                console.log('Componente ' + this.className + ': getArticleById: response ─> ', response.message);
                return response;
            }
            if (response.num_records == 1) {
                this.fillAsoc(response.records[0]);
                return response;
            }
            if (response.num_records == 0) {
                globals_1.default.updateResponse(404, 'Record not found', 'Record not found', helper_1.default.basename(`${__filename}`), 'getArticleById');
                return { status: 500, message: 'Record not found' };
            }
            if (response.num_records > 1) {
                globals_1.default.updateResponse(404, 'Duplicate record', 'Duplicate record', helper_1.default.basename(`${__filename}`), 'getArticleById');
                return { status: 500, message: 'Duplicate record' };
            }
        });
        this.getArticleUserById = () => __awaiter(this, void 0, void 0, function* () {
            const arrData = [this.id_article];
            const sql = `SELECT	  a.id_article
                            , a.id_asociation_article
                            , a.id_user_article
                            , a.category_article
                            , a.subcategory_article
                            , a.class_article
                            , a.state_article
                            , a.publication_date_article
                            , a.effective_date_article
                            , a.expiration_date_article
                            , a.cover_image_article
                            , a.title_article
                            , a.abstract_article
                            , a.ubication_article
                            , COALESCE(a.date_deleted_article,'') as date_deleted_article
                            , a.date_created_article
                            , COALESCE(a.date_updated_article,'') as date_updated_article
                            , u.id_user
                            , u.id_asociation_user
                            , u.email_user
                            , u.profile_user
                            , u.name_user
                            , u.last_name_user
                            , u.avatar_user
                    FROM articles a
                    LEFT OUTER JOIN users u
                    ON ( u.id_user = a.id_user_article )
                    WHERE a.id_article = ?;`;
            const response = yield this.getAll(sql, arrData);
            if (response.message !== 'success') {
                console.log('Componente ' + this.className + ': getArticleUserById: response ─> ', response.message);
                return response;
            }
            else if (response.num_records == 1) {
                this.fillAsoc(response.records[0]);
                return response;
            }
            else if (response.num_records == 0) {
                globals_1.default.updateResponse(404, 'Record not found', 'Record not found', helper_1.default.basename(`${__filename}`), 'getArticleUserById');
                return { status: 500, message: 'Record not found' };
            }
            else if (response.num_records > 1) {
                globals_1.default.updateResponse(404, 'Duplicate record', 'Duplicate record', helper_1.default.basename(`${__filename}`), 'getArticleUserById');
                return { status: 500, message: 'Duplicate record' };
            }
        });
        this.getAllArticlesOfAsociation = () => __awaiter(this, void 0, void 0, function* () {
            const arrData = [this.id_asociation_article];
            if (this.category_article !== '') {
                arrData.push(this.category_article);
            }
            if (this.subcategory_article !== '') {
                arrData.push(this.subcategory_article);
            }
            let sql = `SELECT	  a.id_article
                            , a.id_asociation_article
                            , a.id_user_article
                            , a.category_article
                            , a.subcategory_article
                            , a.class_article
                            , a.state_article
                            , a.publication_date_article
                            , a.effective_date_article
                            , a.expiration_date_article
                            , a.cover_image_article
                            , a.title_article
                            , a.abstract_article
                            , a.ubication_article
                            , COALESCE(a.date_deleted_article,'') as date_deleted_article
                            , a.date_created_article
                            , COALESCE(a.date_updated_article,'') as date_updated_article
                            , u.id_user
                            , u.id_asociation_user
                            , u.email_user
                            , u.profile_user
                            , u.name_user
                            , u.last_name_user
                            , u.avatar_user
                            , COALESCE(aso.long_name_asociation, 'Genérica') as long_name_asociation
                            , COALESCE(aso.short_name_asociation, 'Genérica') as short_name_asociation
                    FROM articles a
                    LEFT OUTER JOIN users u
                    ON ( u.id_user = a.id_user_article )
                    LEFT OUTER JOIN asociations aso
                    ON ( aso.id_asociation = a.id_asociation_article )
                    WHERE ( a.id_asociation_article = ? or a.id_asociation_article = '999999999' ) `;
            sql += this.category_article !== '' ? ' AND a.category_article = ?  ' : ' ';
            sql += this.subcategory_article !== '' ? ' AND a.subcategory_article = ?  ' : ' ';
            sql += ' ORDER BY a.publication_date_article DESC;';
            // console.log('Componente ' + this.className + ': updateAsociation: sql ─> ', sql);
            // console.log('Componente ' + this.className + ': updateAsociation: arrData ─> ', arrData);
            const response = yield this.getAll(sql, arrData);
            return response;
        });
        this.getImages = () => __awaiter(this, void 0, void 0, function* () {
            const arrData = [this.id_article, this.id_article];
            let sql = ` SELECT 'cover' as kind
                         , a.cover_image_article as image
                    FROM articles a
                    WHERE a.id_article = ?
                    AND a.cover_image_article != ''
                    UNION
                    SELECT 'items-images' as kind
                         , i.image_item_article as image
                    FROM item_article i
                    WHERE i.id_article_item_article = ?
                    AND i.image_item_article != '';`;
            const response = yield this.getAll(sql, arrData);
            return response;
        });
        this.createArticle = () => __awaiter(this, void 0, void 0, function* () {
            const sql = `INSERT INTO articles (
                                          id_asociation_article
                                        , id_user_article
                                        , category_article
                                        , subcategory_article
                                        , class_article
                                        , state_article
                                        , publication_date_article
                                        , effective_date_article
                                        , expiration_date_article
                                        , cover_image_article
                                        , title_article
                                        , abstract_article
                                        , ubication_article
                                        )
                VALUES (?${', ?'.repeat(12)})`;
            // console.log('Componente ' + this.className + ': createProfile: sql ─> ', sql);
            const arrData = [
                this.id_asociation_article,
                this.id_user_article,
                this.category_article,
                this.subcategory_article,
                this.class_article,
                this.state_article,
                this.publication_date_article,
                this.effective_date_article,
                this.expiration_date_article,
                this.cover_image_article,
                this.title_article,
                this.abstract_article,
                this.ubication_article,
            ];
            const resUpdate = this.insert(sql, arrData);
            return resUpdate;
        });
        this.updateArticle = () => __awaiter(this, void 0, void 0, function* () {
            const sql = `UPDATE articles
                    SET   id_user_article = ?
                        , category_article = ?
                        , subcategory_article = ?
                        , class_article = ?
                        , state_article = ?
                        , publication_date_article = ?
                        , effective_date_article = ?
                        , expiration_date_article = ?
                        , title_article = ?
                        , abstract_article = ?
                        , ubication_article = ?
                    WHERE id_article = ?
                    AND COALESCE(date_updated_article,'') = ? `;
            // console.log('Componente ' + this.className + ': updateAsociation: sql ─> ', sql);
            const arrData = [
                this.id_user_article,
                this.category_article,
                this.subcategory_article,
                this.class_article,
                this.state_article,
                this.publication_date_article,
                this.effective_date_article,
                this.expiration_date_article,
                this.title_article,
                this.abstract_article,
                this.ubication_article,
                this.id_article,
                this.date_updated_article,
            ];
            const resUpdate = this.update(sql, arrData);
            return resUpdate;
        });
        this.updateCover = () => __awaiter(this, void 0, void 0, function* () {
            const sql = `UPDATE articles
                    SET cover_image_article = ?
                    WHERE id_article = ?
                    AND COALESCE(date_updated_article,'') = ?`;
            // console.log('Componente ' + this.className + ': updateAsociation: sql ─> ', sql);
            const arrData = [this.cover_image_article, this.id_article, this.date_updated_article];
            const resUpdate = this.update(sql, arrData);
            return resUpdate;
        });
        this.deleteArticle = () => __awaiter(this, void 0, void 0, function* () {
            const sql = `DELETE FROM articles
                    WHERE id_article = ?
                    AND COALESCE(date_updated_article,'') = ? `;
            // console.log('Componente ' + this.className + ': createProfile: sql ─> ', sql);
            const arrData = [this.id_article, this.date_updated_article];
            const resUpdate = this.delete(sql, arrData);
            return resUpdate;
        });
        this.fillAsoc = (record) => __awaiter(this, void 0, void 0, function* () {
            Object.assign(this, record);
        });
        // console.log('Componente ' + this.className + ': constructor:  ─> ');
    }
}
exports.default = Article;
