import Mysql from '../config/bd/mysql';
import Globals from '../utils/globals';
import Helper from '../utils/helper';

export default class Article extends Mysql {
    className = 'Article';

    id_article = 0;
    id_asociation_article = 0;
    id_user_article = 0;
    category_article = '';
    subcategory_article = '';
    class_article = '';
    state_article = '';
    publication_date_article = '';
    effective_date_article = '';
    expiration_date_article = '';
    cover_image_article = '';
    title_article = '';
    abstract_article = '';
    ubication_article = '';
    date_deleted_article = '';
    date_created_article = '';
    date_updated_article = '';

    constructor() {
        super();
        // console.log('Componente ' + this.className + ': constructor:  ─> ');
    }

    public getArticleById = async () => {
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

        const response = await this.getAll(sql, arrData);
        if (response.message !== 'success') {
            console.log('Componente ' + this.className + ': getArticleById: response ─> ', response.message);
            return response;
        }
        if (response.num_records == 1) {
            this.fillAsoc(response.records[0]);
            return response;
        }
        if (response.num_records == 0) {
            Globals.updateResponse(404, 'Record not found', 'Record not found', Helper.basename(`${__filename}`), 'getArticleById');
            return { status: 500, message: 'Record not found' };
        }
        if (response.num_records > 1) {
            Globals.updateResponse(404, 'Duplicate record', 'Duplicate record', Helper.basename(`${__filename}`), 'getArticleById');
            return { status: 500, message: 'Duplicate record' };
        }
    };

    public getArticleUserById = async () => {
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

        const response = await this.getAll(sql, arrData);
        if (response.message !== 'success') {
            console.log('Componente ' + this.className + ': getArticleUserById: response ─> ', response.message);
            return response;
        } else if (response.num_records == 1) {
            this.fillAsoc(response.records[0]);
            return response;
        } else if (response.num_records == 0) {
            Globals.updateResponse(404, 'Record not found', 'Record not found', Helper.basename(`${__filename}`), 'getArticleUserById');
            return { status: 500, message: 'Record not found' };
        } else if (response.num_records > 1) {
            Globals.updateResponse(404, 'Duplicate record', 'Duplicate record', Helper.basename(`${__filename}`), 'getArticleUserById');
            return { status: 500, message: 'Duplicate record' };
        }
    };

    public getAllArticlesOfAsociation = async (profile = '') => {
        const arrData: any[] = [this.id_asociation_article];
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
                    ON ( aso.id_asociation = a.id_asociation_article ) `;
        sql +=
            profile === 'superadmin'
                ? ' WHERE ( a.id_asociation_article > 0 )  '
                : " WHERE ( a.id_asociation_article = ? or a.id_asociation_article = '999999999' ) ";
        sql += this.category_article !== '' ? ' AND a.category_article = ?  ' : ' ';
        sql += this.subcategory_article !== '' ? ' AND a.subcategory_article = ?  ' : ' ';
        sql += ' ORDER BY a.publication_date_article DESC;';

        console.log('Componente ' + this.className + ': updateAsociation: sql ─> ', sql);
        // console.log('Componente ' + this.className + ': updateAsociation: arrData ─> ', arrData);
        const response = await this.getAll(sql, arrData);
        return response;
    };

    public getImages = async () => {
        const arrData: any[] = [this.id_article, this.id_article];

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

        const response = await this.getAll(sql, arrData);
        return response;
    };

    public createArticle = async () => {
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
    };

    public updateArticle = async () => {
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
    };

    public updateCover = async () => {
        const sql = `UPDATE articles
                    SET cover_image_article = ?
                    WHERE id_article = ?
                    AND COALESCE(date_updated_article,'') = ?`;

        // console.log('Componente ' + this.className + ': updateAsociation: sql ─> ', sql);
        const arrData = [this.cover_image_article, this.id_article, this.date_updated_article];

        const resUpdate = this.update(sql, arrData);
        return resUpdate;
    };

    public deleteArticle = async () => {
        const sql = `DELETE FROM articles
                    WHERE id_article = ?
                    AND COALESCE(date_updated_article,'') = ? `;

        // console.log('Componente ' + this.className + ': createProfile: sql ─> ', sql);
        const arrData = [this.id_article, this.date_updated_article];

        const resUpdate = this.delete(sql, arrData);
        return resUpdate;
    };

    public fillAsoc = async (record: any) => {
        Object.assign(this, record);
    };
}
