import Mysql from '../config/bd/mysql';
import Globals from '../utils/globals';
import Helper from '../utils/helper';

export default class Asoc extends Mysql {
    className = 'Asoc';

    id_asociation = 0;
    long_name_asociation = '';
    short_name_asociation = '';
    logo_asociation = '';
    email_asociation = '';
    name_contact_asociation = '';
    phone_asociation = '';
    date_deleted_asociation = '';
    date_created_asociation = '';
    date_updated_asociation = '';

    constructor() {
        super();
        // console.log('Componente ' + this.className + ': constructor:  ─> ');
    }

    public findAsociationByEmail = async () => {
        const arrData = [this.email_asociation];

        const sql = `SELECT	  count(*) as num_records
                    FROM asociations a
                    WHERE a.email_asociation = ?;`;

        const response = await this.getAll(sql, arrData);
        if (response.message === 'success') {
            // console.log('Componente ' + this.className + ': findUserByEmail: response.records[0].num_records ─> ', response.records[0].num_records);
            if (response.records[0].num_records > 0) {
                return true;
            }
            return false;
        } else {
            console.log('Componente ' + this.className + ': findUserByEmail: throw new Error ─> ', response.message);
            return false;
        }
    };

    public getAsociationByEmail = async () => {
        const arrData = [this.email_asociation];

        const sql = `SELECT	  a.id_asociation
                            , a.long_name_asociation
                            , a.short_name_asociation
                            , a.logo_asociation
                            , a.email_asociation
                            , a.name_contact_asociation
                            , a.phone_asociation
                            , COALESCE(a.date_deleted_asociation,'') as date_deleted_asociation
                            , a.date_created_asociation
                            , COALESCE(a.date_updated_asociation,'') as date_updated_asociation
                    FROM asociations a
                    WHERE a.email_asociation = ?;`;

        const response = await this.getAll(sql, arrData);
        if (response.message !== 'success') {
            console.log('Componente ' + this.className + ': getAsociationByEmail: response ─> ', response.message);
            return response;
        }
        if (response.num_records == 1) {
            this.fillAsoc(response.records[0]);
            return response;
        }
        if (response.num_records == 0) {
            Globals.updateResponse(404, 'Record not found', 'Record not found', Helper.basename(`${__filename}`), 'getAsociationByEmail');
            return { status: 500, message: 'Record not found' };
        }
        if (response.num_records > 1) {
            Globals.updateResponse(404, 'Duplicate record', 'Duplicate record', Helper.basename(`${__filename}`), 'getAsociationByEmail');
            return { status: 500, message: 'Duplicate record' };
        }
    };

    public getAsociationById = async () => {
        const arrData = [this.id_asociation];

        const sql = `SELECT	  a.id_asociation
                            , a.long_name_asociation
                            , a.short_name_asociation
                            , a.logo_asociation
                            , a.email_asociation
                            , a.name_contact_asociation
                            , a.phone_asociation
                            , COALESCE(a.date_deleted_asociation,'') as date_deleted_asociation
                            , a.date_created_asociation
                            , COALESCE(a.date_updated_asociation,'') as date_updated_asociation
                    FROM asociations a
                    WHERE a.id_asociation = ?;`;

        const response = await this.getAll(sql, arrData);
        if (response.message !== 'success') {
            console.log('Componente ' + this.className + ': getAsociationById: response ─> ', response.message);
            return response;
        }
        if (response.num_records == 1) {
            this.fillAsoc(response.records[0]);
            return response;
        }
        if (response.num_records == 0) {
            Globals.updateResponse(404, 'Record not found', 'Record not found', Helper.basename(`${__filename}`), 'getAsociationById');
            return { status: 500, message: 'Record not found' };
        }
        if (response.num_records > 1) {
            Globals.updateResponse(404, 'Duplicate record', 'Duplicate record', Helper.basename(`${__filename}`), 'getAsociationById');
            return { status: 500, message: 'Duplicate record' };
        }
    };

    public getListAsociations = async () => {
        const sql = `SELECT	  a.id_asociation
                            , a.long_name_asociation
                            , a.short_name_asociation
                            , a.logo_asociation
                            , a.email_asociation
                            , a.name_contact_asociation
                            , a.phone_asociation
                    FROM asociations a
                    ORDER BY a.long_name_asociation ASC;`;

        const response = await this.getAll(sql);
        return response;
    };

    public getAllAsociations = async () => {
        const sql = `SELECT	  a.id_asociation
                            , a.long_name_asociation
                            , a.short_name_asociation
                            , a.logo_asociation
                            , a.email_asociation
                            , a.name_contact_asociation
                            , a.phone_asociation
                            , COALESCE(a.date_deleted_asociation,'') as date_deleted_asociation
                            , a.date_created_asociation
                            , COALESCE(a.date_updated_asociation,'') as date_updated_asociation
                    FROM asociations a
                    ORDER BY a.long_name_asociation ASC;`;

        const response = await this.getAll(sql);
        return response;
    };

    public createAsociation = async () => {
        const sql = `INSERT INTO asociations (
                         long_name_asociation
                        ,short_name_asociation
                        ,email_asociation
                        ,name_contact_asociation
                        ,phone_asociation
                        )
                VALUES (?${', ?'.repeat(4)})`;

        // console.log('Componente ' + this.className + ': createProfile: sql ─> ', sql);
        const arrData = [
            this.long_name_asociation,
            this.short_name_asociation,
            this.email_asociation,
            this.name_contact_asociation,
            this.phone_asociation,
        ];

        const resUpdate = this.insert(sql, arrData);
        return resUpdate;
    };

    public updateAsociation = async () => {
        const sql = `UPDATE asociations
                    SET   long_name_asociation = ?
                        , short_name_asociation = ?
                        , logo_asociation = ?
                        , email_asociation = ?
                        , name_contact_asociation = ?
                        , phone_asociation = ?
                    WHERE id_asociation = ?
                    AND COALESCE(date_updated_asociation,'') = ?  `;

        // console.log('Componente ' + this.className + ': updateAsociation: sql ─> ', sql);
        const arrData = [
            this.long_name_asociation,
            this.short_name_asociation,
            this.logo_asociation,
            this.email_asociation,
            this.name_contact_asociation,
            this.phone_asociation,
            this.id_asociation,
            this.date_updated_asociation,
        ];

        const resUpdate = this.update(sql, arrData);
        return resUpdate;
    };

    public updateLogo = async () => {
        const sql = `UPDATE asociations
                    SET logo_asociation = ?
                    WHERE id_asociation = ?
                    AND COALESCE(date_updated_asociation,'') = ? `;

        const arrDatos = [this.logo_asociation, this.id_asociation, this.date_updated_asociation];
        console.log('Componente User: updateLogo: arrDatos ─> ', arrDatos);

        const resUpdate = await this.update(sql, arrDatos);
        console.log('Componente User: updateLogo: resUpdate ─> ', resUpdate);
        return resUpdate;
    };

    public deleteAsociation = async () => {
        const sql = `DELETE FROM asociations
        WHERE id_asociation = ?
          AND COALESCE(date_updated_asociation,'') = ? `;

        // console.log('Componente ' + this.className + ': createProfile: sql ─> ', sql);
        const arrData = [this.id_asociation, this.date_updated_asociation];

        const resUpdate = this.delete(sql, arrData);
        return resUpdate;
    };

    public fillAsoc = async (record: any) => {
        Object.assign(this, record);
    };
}
