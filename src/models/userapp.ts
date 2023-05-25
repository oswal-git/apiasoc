import Mysql from '../config/bd/mysql';
import { genSaltSync, hashSync } from 'bcryptjs';
import Globals from '../utils/globals';
import Helper from '../utils/helper';

export default class Userapp extends Mysql {
    className = 'Userapp';

    id_userapp = 0;
    asociation_id_userapp = 0;
    user_name_userapp = '';
    question_userapp = '';
    answer_userapp = '';
    avatar_userapp = '';
    phone_userapp = '';
    date_deleted_userapp = '';
    date_created_userapp = '';
    date_updated_userapp = '';

    constructor() {
        super();
        // console.log('Componente ' + this.className + ': constructor:  ─> ');
    }

    public async getDataUserappById() {
        const arrData = [this.id_userapp];

        const sql = `SELECT  u.id_userapp
                            ,u.asociation_id_userapp
                            ,u.user_name_userapp
                            ,u.question_userapp
                            ,'' as answer_userapp
                            ,u.avatar_userapp
                            ,u.phone_userapp
                            ,COALESCE(u.date_deleted_userapp,'') as date_deleted_userapp
                            ,u.date_created_userapp
                            ,COALESCE(u.date_updated_userapp,'') as date_updated_userapp
                            ,a.long_name_asociation
                            ,a.short_name_asociation
                            ,a.logo_asociation
                            ,a.email_asociation
                            ,a.name_contact_asociation
                            ,a.phone_asociation
                    FROM usersapp u
                    LEFT OUTER JOIN asociations a
                    ON ( u.asociation_id_userapp = a.id_asociation )
                    WHERE u.id_userapp = ?;`;

        const response = await this.getAll(sql, arrData);
        if (response.message !== 'success') {
            console.log('Componente ' + this.className + ': getDataUserappById: response ─> ', response.message);
            return response;
        }
        if (response.num_records == 1) {
            this.fillUserapp(response.records[0]);
            return response;
        }
        if (response.num_records == 0) {
            Globals.updateResponse(404, 'Record not found', 'Record not found', Helper.basename(`${__filename}`), 'getDataUserappById');
            return { status: 500, message: 'Record not found' };
        }
        if (response.num_records > 1) {
            Globals.updateResponse(404, 'Duplicate record', 'Duplicate record', Helper.basename(`${__filename}`), 'getDataUserappById');
            return { status: 500, message: 'Duplicate record' };
        }
    }

    public getAllUsersapp = async () => {
        const sql = `SELECT  u.id_userapp
							,u.asociation_id_userapp
							,u.user_name_userapp
							,u.token_userapp
							,u.token_exp_userapp
							,u.question_userapp
							,u.answer_userapp
							,u.avatar_userapp
							,u.phone_userapp
							,COALESCE(u.date_deleted_userapp,'') as date_deleted_userapp
							,u.date_created_userapp
							,COALESCE(u.date_updated_userapp,'') as date_updated_userapp
							,a.long_name_asociation
							,a.short_name_asociation
							,a.logo_asociation
							,a.email_asociation
							,a.name_contact_asociation
							,a.phone_asociation
					FROM usersapp u
					LEFT OUTER JOIN asociations a
					ON ( u.asociation_id_userapp = a.id_asociation )
					ORDER BY u.user_name_user ASC;`;
        console.log('getAllUsersapp');
        const response = await this.getAll(sql);
        return response;
    };

    public getAllQuestionByUsernameAndAsociationId = async () => {
        const sql = `SELECT DISTINCT
                             u.id_userapp
                            ,u.asociation_id_userapp
                            ,u.user_name_userapp
							,u.question_userapp
							,COALESCE(u.date_updated_userapp,'') as date_updated_userapp
							,a.long_name_asociation
							,a.short_name_asociation
							,a.logo_asociation
					FROM usersapp u
					LEFT OUTER JOIN asociations a
					ON ( u.asociation_id_userapp = a.id_asociation )
                    WHERE u.user_name_userapp = ? and u.asociation_id_userapp = ?
					ORDER BY u.question_userapp ASC;`;

        const arrData = [this.user_name_userapp, this.asociation_id_userapp];

        console.log('getAllQuestionByUsernameAndAsociationId');
        const response = await this.getAll(sql, arrData);
        return response;
    };

    public getByUsernameAndAsociationIdAndQuestion = async () => {
        let answerHash = '';
        try {
            // console.log('Componente ' + this.className + ': getByUsernameAndAsociationIdAndQuestion: salt  ─> ', genSaltSync(50));
            const salt = await genSaltSync(10);
            answerHash = await hashSync(this.answer_userapp, salt);
            // console.log('Componente ' + this.className + ': getByUsernameAndAsociationIdAndQuestion: answerHash  ─> ', answerHash);
        } catch (error) {
            // console.log('Componente ' + this.className + ': getByUsernameAndAsociationIdAndQuestion: answerHash error ─> ', error);
        }

        const sql = `SELECT  u.id_userapp
                            ,u.asociation_id_userapp
                            ,u.user_name_userapp
							,u.question_userapp
							,u.answer_userapp
							,COALESCE(u.date_updated_userapp,'') as date_updated_userapp
							,a.long_name_asociation
							,a.short_name_asociation
							,a.logo_asociation
					FROM usersapp u
					LEFT OUTER JOIN asociations a
					ON ( u.asociation_id_userapp = a.id_asociation )
                    WHERE u.user_name_userapp = ?
                      and u.asociation_id_userapp = ?
                      and u.question_userapp = ?
					ORDER BY u.question_userapp ASC;`;

        const arrData = [this.user_name_userapp, this.asociation_id_userapp, this.question_userapp];

        console.log('getByUsernameAndAsociationIdAndQuestion -> arrData', arrData);
        // console.log('getByUsernameAndAsociationIdAndQuestion -> sql', sql);
        const response = await this.getAll(sql, arrData);

        if (response.message !== 'success') {
            console.log('Componente ' + this.className + ': getByUsernameAndAsociationIdAndQuestion: response ─> ', response.message);
            return response;
        }
        if (response.num_records == 1) {
            console.log('Componente ' + this.className + ': getByUsernameAndAsociationIdAndQuestion: response ─> ', 'UNO');

            this.fillUserapp(response.records[0]);
            return response;
        }
        if (response.num_records == 0) {
            console.log('Componente ' + this.className + ': getByUsernameAndAsociationIdAndQuestion: response ─> ', 'CERO');
            return response;

            // Globals.updateResponse(
            //     404,
            //     'Invalid key',
            //     'Record not found',
            //     Helper.basename(`${__filename}`),
            //     'getByUsernameAndAsociationIdAndQuestion'
            // );
            // return { status: 500, message: 'Invalid key' };
        }
        if (response.num_records > 1) {
            console.log('Componente ' + this.className + ': getByUsernameAndAsociationIdAndQuestion: response ─> ', 'MUCHOS');

            Globals.updateResponse(
                404,
                'Duplicate record',
                'Duplicate record',
                Helper.basename(`${__filename}`),
                'getByUsernameAndAsociationIdAndQuestion'
            );
            return { status: 500, message: 'Duplicate record' };
        }
    };

    public getAllByIdAsociations = async () => {
        const sql = `SELECT  u.id_userapp
							,u.asociation_id_userapp
							,u.user_name_userapp
							,u.token_userapp
							,u.token_exp_userapp
							,u.question_userapp
							,u.answer_userapp
							,u.avatar_userapp
							,u.phone_userapp
							,COALESCE(u.date_deleted_userapp,'') as date_deleted_userapp
							,u.date_created_userapp
							,COALESCE(u.date_updated_userapp,'') as date_updated_userapp
							,a.long_name_asociation
							,a.short_name_asociation
							,a.logo_asociation
							,a.email_asociation
							,a.name_contact_asociation
							,a.phone_asociation
					FROM usersapp u
					LEFT OUTER JOIN asociations a
					ON ( u.asociation_id_userapp = a.id_asociation )
                    WHERE u.asociation_id_userapp = ?
					ORDER BY u.email_userapp ASC;`;

        const arrData = [this.asociation_id_userapp];

        console.log('getAllByIdAsociations');
        const response = await this.getAll(sql, arrData);
        return response;
    };

    public async createUserapp() {
        // console.log('Componente ' + this.className + ': userappCreate: this.answer_userapp  ─> ', this.answer_userapp);
        // console.log('Componente ' + this.className + ': userappCreate: MAGIC_SEED  ─> ', MAGIC_SEED);
        let answerHash = '';
        try {
            // console.log('Componente ' + this.className + ': userappCreate: salt  ─> ', genSaltSync(50));
            const salt = await genSaltSync(10);
            answerHash = await hashSync(this.answer_userapp, salt);
            // console.log('Componente ' + this.className + ': userappCreate: answerHash  ─> ', answerHash);
        } catch (error) {
            console.log('Componente ' + this.className + ': userappCreate: answerHash error ─> ', error);
        }
        const arrData = [this.asociation_id_userapp, this.user_name_userapp, this.question_userapp, answerHash, this.phone_userapp];
        console.log('Componente ' + this.className + ': userappCreate: arrData.length ─> ', arrData.length);

        const sql = `INSERT INTO usersapp (
                         asociation_id_userapp
                        ,user_name_userapp
                        ,question_userapp
                        ,answer_userapp
                        ,phone_userapp
                        )
                VALUES (?${', ?'.repeat(arrData.length - 1)})`;
        // VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        const resUpdate = this.insert(sql, arrData);
        return resUpdate;
    }

    public async updateUserapp() {
        const sql = `UPDATE usersapp
                    SET   asociation_id_userapp = ?
                        , user_name_userapp = ?
                        , phone_userapp = ?
                    WHERE id_userapp = ?
                    and COALESCE(date_updated_userapp,'') = ? `;

        const arrDatos = [this.asociation_id_userapp, this.user_name_userapp, this.phone_userapp, this.date_updated_userapp];

        console.log('Componente Userapp: updateUserapp: sql ─> ', sql);
        console.log('Componente Userapp: updateUserapp: arrDatos ─> ', arrDatos);
        const resUpdate = await this.update(sql, arrDatos);
        console.log('Componente Userapp: updateUserapp: resUpdate ─> ', resUpdate);
        return resUpdate;
    }

    public async createProfile() {
        // console.log('Componente ' + this.className + ': createProfile: this.password_userapp  ─> ', this.password_userapp);
        // console.log('Componente ' + this.className + ': createProfile: MAGIC_SEED  ─> ', MAGIC_SEED);
        let answerHash = '';
        try {
            // console.log('Componente ' + this.className + ': createProfile: salt  ─> ', genSaltSync(50));
            const salt = await genSaltSync(10);
            answerHash = await hashSync(this.answer_userapp, salt);
            // console.log('Componente ' + this.className + ': createProfile: answerHash  ─> ', answerHash);
        } catch (error) {
            console.log('Componente ' + this.className + ': createProfile: answerHash error ─> ', error);
        }

        const sql = `INSERT INTO usersapp (
                             asociation_id_userapp
                            ,user_name_userapp
                            ,question_userapp
                            ,answer_userapp
                            ,avatar_userapp
                            ,phone_userapp
                        )
                VALUES (?${', ?'.repeat(12)})`;
        // VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        // console.log('Componente ' + this.className + ': createProfile: sql ─> ', sql);
        const arrData = [
            this.asociation_id_userapp,
            this.user_name_userapp,
            this.question_userapp,
            answerHash,
            this.avatar_userapp,
            this.phone_userapp,
        ];

        const resUpdate = this.insert(sql, arrData);
        return resUpdate;
    }

    public async deleteUser() {
        const sql = `DELETE FROM usersapp
        WHERE id_userapp = ?
          and COALESCE(date_updated_userapp,'') = ?`;

        // console.log('Componente ' + this.className + ': createProfile: sql ─> ', sql);
        const arrData = [this.id_userapp, this.date_updated_userapp];

        const resUpdate = this.delete(sql, arrData);
        return resUpdate;
    }

    public async updateProfile() {
        let answerHash = '';
        try {
            // console.log('Componente ' + this.className + ': userappCreate: salt  ─> ', genSaltSync(50));
            const salt = await genSaltSync(10);
            answerHash = await hashSync(this.answer_userapp, salt);
            // console.log('Componente ' + this.className + ': userappCreate: answerHash  ─> ', answerHash);
        } catch (error) {
            console.log('Componente ' + this.className + ': userappCreate: answerHash error ─> ', error);
        }

        const sql = `UPDATE usersapp
                    SET   asociation_id_userapp = ?
                        , user_name_userapp = ?
                        , question_userapp = ?
                        , answer_userapp = ?
                        , phone_userapp = ?
                    WHERE id_userapp = ?
                    and COALESCE(date_updated_userapp,'') = ? `;

        const arrDatos = [
            this.asociation_id_userapp,
            this.user_name_userapp,
            this.question_userapp,
            answerHash,
            this.phone_userapp,
            this.date_updated_userapp,
        ];

        console.log('Componente Userapp: updateToken: sql ─> ', sql);
        console.log('Componente Userapp: updateToken: arrDatos ─> ', arrDatos);
        const resUpdate = await this.update(sql, arrDatos);
        console.log('Componente Userapp: updateToken: resUpdate ─> ', resUpdate);
        return resUpdate;
    }

    public fillUserapp(record: any) {
        Object.assign(this, record);
        // Object.keys(this).map((key: string) => {
        //     this[key] = record[key];
        // });
        // console.log('Componente ' + this.className + ': fillUserapp: this ─> ', this);
    }
}
