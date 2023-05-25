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
class ItemArticle extends mysql_1.default {
    constructor() {
        super();
        this.className = 'ItemArticle';
        this.id_item_article = 0;
        this.id_article_item_article = 0;
        this.text_item_article = '';
        this.image_item_article = '';
        this.date_created_item_article = '';
        this.getArticleById = () => __awaiter(this, void 0, void 0, function* () {
            const arrData = [this.id_item_article];
            const sql = `SELECT	  i.id_item_article
                            , i.id_article_item_article
                            , i.text_item_article
                            , i.image_item_article
                            , i.date_created_item_article
                    FROM item_article i
                    WHERE i.id_item_article = ?;`;
            const response = yield this.getAll(sql, arrData);
            if (response.message !== 'success') {
                console.log('Componente ' + this.className + ': getArticleById: response ─> ', response.message);
                return response;
            }
            else if (response.num_records == 1) {
                this.fillAsoc(response.records[0]);
                return response;
            }
            else if (response.num_records == 0) {
                globals_1.default.updateResponse(404, 'Record not found', 'Record not found', helper_1.default.basename(`${__filename}`), 'getArticleById');
                return { status: 500, message: 'Record not found' };
            }
            else if (response.num_records > 1) {
                globals_1.default.updateResponse(404, 'Duplicate record', 'Duplicate record', helper_1.default.basename(`${__filename}`), 'getArticleById');
                return { status: 500, message: 'Duplicate record' };
            }
        });
        this.getListItemsOfArticle = () => __awaiter(this, void 0, void 0, function* () {
            const arrData = [this.id_article_item_article];
            const sql = `SELECT   i.id_item_article
                            , i.id_article_item_article
                            , i.text_item_article
                            , i.image_item_article
                            , i.date_created_item_article
                    FROM item_article i
                    WHERE i.id_article_item_article = ?
                    ORDER BY i.id_item_article ASC;`;
            const response = yield this.getAll(sql, arrData);
            return response;
        });
        this.createItemArticle = () => __awaiter(this, void 0, void 0, function* () {
            const arrData = [this.id_item_article, this.id_article_item_article, this.text_item_article, this.image_item_article];
            const sql = `INSERT INTO item_article (
                                          id_item_article
                                        , id_article_item_article
                                        , text_item_article
                                        , image_item_article
                                        )
                    VALUES (?${', ?'.repeat(arrData.length - 1)})`;
            helper_1.default.writeDebug('Componente ' + this.className + ': createItemArticle: sql ─> ', sql);
            helper_1.default.writeDebug('Componente ' + this.className + ': createItemArticle: arrData ─> ', arrData);
            const resUpdate = this.insert(sql, arrData);
            return resUpdate;
        });
        this.updateImageItem = () => __awaiter(this, void 0, void 0, function* () {
            const arrData = [this.image_item_article, this.id_item_article, this.id_article_item_article];
            const sql = `UPDATE item_article
                    SET image_item_article = ?
                    WHERE id_item_article = ?
                    AND id_article_item_article = ?`;
            console.log('Componente ' + this.className + ': updateAsociation: sql ─> ', sql);
            console.log('Componente ' + this.className + ': updateAsociation: arrData ─> ', arrData);
            const resUpdate = this.update(sql, arrData);
            return resUpdate;
        });
        this.deleteItemsOfArticle = () => __awaiter(this, void 0, void 0, function* () {
            const sql = `DELETE FROM item_article
                    WHERE id_article_item_article = ? ;`;
            // console.log('Componente ' + this.className + ': deleteItemsOfArticle: sql ─> ', sql);
            yield helper_1.default.writeDebug('Componente ' + this.className + ': deleteItemsOfArticle: sql ─> ', sql);
            const arrData = [this.id_article_item_article];
            yield helper_1.default.writeDebug('Componente ' + this.className + ': deleteItemsOfArticle: arrData ─> ', arrData);
            console.log('Componente ' + this.className + ': deleteItemsOfArticle: arrData ─> ', arrData);
            const resUpdate = this.delete(sql, arrData);
            return resUpdate;
        });
        this.fillAsoc = (record) => __awaiter(this, void 0, void 0, function* () {
            Object.assign(this, record);
        });
        // console.log('Componente ' + this.className + ': constructor:  ─> ');
    }
}
exports.default = ItemArticle;
