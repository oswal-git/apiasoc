import Mysql from '../config/bd/mysql';
import Globals from '../utils/globals';
import Helper from '../utils/helper';

export default class ItemArticle extends Mysql {
    className = 'ItemArticle';

    id_item_article = 0;
    id_article_item_article = 0;
    text_item_article = '';
    image_item_article = '';
    date_created_item_article = '';

    constructor() {
        super();
        // console.log('Componente ' + this.className + ': constructor:  ─> ');
    }

    public getArticleById = async () => {
        const arrData = [this.id_item_article];

        const sql = `SELECT	  i.id_item_article
                            , i.id_article_item_article
                            , i.text_item_article
                            , i.image_item_article
                            , i.date_created_item_article
                    FROM item_article i
                    WHERE i.id_item_article = ?;`;

        const response = await this.getAll(sql, arrData);
        if (response.message !== 'success') {
            console.log('Componente ' + this.className + ': getArticleById: response ─> ', response.message);
            return response;
        } else if (response.num_records == 1) {
            this.fillAsoc(response.records[0]);
            return response;
        } else if (response.num_records == 0) {
            Globals.updateResponse(404, 'Record not found', 'Record not found', Helper.basename(`${__filename}`), 'getArticleById');
            return { status: 500, message: 'Record not found' };
        } else if (response.num_records > 1) {
            Globals.updateResponse(404, 'Duplicate record', 'Duplicate record', Helper.basename(`${__filename}`), 'getArticleById');
            return { status: 500, message: 'Duplicate record' };
        }
    };

    public getListItemsOfArticle = async () => {
        const arrData = [this.id_article_item_article];

        const sql = `SELECT   i.id_item_article
                            , i.id_article_item_article
                            , i.text_item_article
                            , i.image_item_article
                            , i.date_created_item_article
                    FROM item_article i
                    WHERE i.id_article_item_article = ?
                    ORDER BY i.id_item_article ASC;`;

        const response = await this.getAll(sql, arrData);
        return response;
    };

    public createItemArticle = async () => {
        const arrData = [this.id_item_article, this.id_article_item_article, this.text_item_article, this.image_item_article];

        const sql = `INSERT INTO item_article (
                                          id_item_article
                                        , id_article_item_article
                                        , text_item_article
                                        , image_item_article
                                        )
                    VALUES (?${', ?'.repeat(arrData.length - 1)})`;

        Helper.writeDebug('Componente ' + this.className + ': createItemArticle: sql ─> ', sql);
        Helper.writeDebug('Componente ' + this.className + ': createItemArticle: arrData ─> ', arrData);

        const resUpdate = this.insert(sql, arrData);
        return resUpdate;
    };

    public updateImageItem = async () => {
        const arrData = [this.image_item_article, this.id_item_article, this.id_article_item_article];

        const sql = `UPDATE item_article
                    SET image_item_article = ?
                    WHERE id_item_article = ?
                    AND id_article_item_article = ?`;

        console.log('Componente ' + this.className + ': updateAsociation: sql ─> ', sql);
        console.log('Componente ' + this.className + ': updateAsociation: arrData ─> ', arrData);

        const resUpdate = this.update(sql, arrData);
        return resUpdate;
    };

    public deleteItemsOfArticle = async () => {
        const sql = `DELETE FROM item_article
                    WHERE id_article_item_article = ? ;`;

        // console.log('Componente ' + this.className + ': deleteItemsOfArticle: sql ─> ', sql);
        await Helper.writeDebug('Componente ' + this.className + ': deleteItemsOfArticle: sql ─> ', sql);
        const arrData = [this.id_article_item_article];
        await Helper.writeDebug('Componente ' + this.className + ': deleteItemsOfArticle: arrData ─> ', arrData);
        console.log('Componente ' + this.className + ': deleteItemsOfArticle: arrData ─> ', arrData);

        const resUpdate = this.delete(sql, arrData);
        return resUpdate;
    };

    public fillAsoc = async (record: any) => {
        Object.assign(this, record);
    };
}
