import Mysql from '../config/bd/mysql';
import { genSaltSync, hashSync } from 'bcryptjs';
import Globals from '../utils/globals';
import Helper from '../utils/helper';

export default class User extends Mysql {
    className = 'User';

    id_user = 0;
    id_asociation_user = 0;
    user_name_user = '';
    email_user = '';
    password_user = '';
    recover_password_user = 0;
    token_user = '';
    token_exp_user = 0;
    question_user = '';
    answer_user = '';
    profile_user = '';
    status_user = '';
    name_user = '';
    last_name_user = '';
    avatar_user = '';
    phone_user = '';
    date_deleted_user = '';
    date_created_user = '';
    date_updated_user = '';

    constructor() {
        super();
        // console.log('Componente ' + this.className + ': constructor:  ─> ');
    }

    public async findUserByEmail() {
        const arrData = [this.email_user];

        const sql = `SELECT count(*) as num_records
                    FROM users u
                    WHERE u.email_user = ?;`;

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
    }

    public async findUserByNameAndAsociation() {
        const arrData = [this.user_name_user, this.id_asociation_user];
        console.log('findUserByNameAndAsociation -> arrData', arrData);

        const sql = `SELECT count(*) as num_records
                    FROM users u
                    WHERE u.user_name_user = ?
                      AND u.id_asociation_user = ? ;`;

        const response = await this.getAll(sql, arrData);

        if (response.message === 'success') {
            console.log('Componente ' + this.className + ': getDataUserById: response.records[0].num_records ─> ', response.records[0].num_records);
            // console.log('Componente ' + this.className + ': findUserByEmail: response.records[0].num_records ─> ', response.records[0].num_records);
            if (response.records[0].num_records > 0) {
                return true;
            }
            return false;
        } else {
            console.log('Componente ' + this.className + ': findUserByEmail: throw new Error ─> ', response.message);
            return false;
        }
    }

    public async getUserByEmail() {
        const arrData = [this.email_user];

        const sql = `SELECT  u.id_user
                            ,u.id_asociation_user
                            ,u.user_name_user
                            ,u.email_user
                            ,u.password_user
                            ,u.recover_password_user
                            ,u.token_user
                            ,u.token_exp_user
                            ,u.profile_user
                            ,u.status_user
                            ,u.name_user
                            ,u.last_name_user
                            ,u.avatar_user
                            ,u.phone_user
                            ,COALESCE(u.date_deleted_user,'') as date_deleted_user
                            ,u.date_created_user
                            ,COALESCE(u.date_updated_user,'') as date_updated_user
                    FROM users u
                    WHERE u.email_user = ?;`;

        const response = await this.getAll(sql, arrData);
        if (response.message === 'success' && response.num_records === 1) {
            this.fillUser(response.records[0]);
        }
        return response;
    }

    public async getUserByNameAndAsociation() {
        const arrData = [this.user_name_user, this.id_asociation_user];
        console.log('getUserByNameAndAsociation -> arrData', arrData);

        const sql = `SELECT  u.id_user
                            ,u.id_asociation_user
                            ,u.user_name_user
                            ,u.email_user
                            ,u.password_user
                            ,u.recover_password_user
                            ,u.token_user
                            ,u.token_exp_user
                            ,u.profile_user
                            ,u.status_user
                            ,u.name_user
                            ,u.last_name_user
                            ,u.avatar_user
                            ,u.phone_user
                            ,COALESCE(u.date_deleted_user,'') as date_deleted_user
                            ,u.date_created_user
                            ,COALESCE(u.date_updated_user,'') as date_updated_user
                    FROM users u
                    WHERE u.user_name_user = ?
                      AND u.id_asociation_user = ? ;`;

        const response = await this.getAll(sql, arrData);
        if (response.message === 'success' && response.num_records === 1) {
            this.fillUser(response.records[0]);
        }
        return response;
    }

    public async getDataUserById() {
        const arrData = [this.id_user];

        const sql = `SELECT  u.id_user
                            ,u.id_asociation_user
                            ,u.user_name_user
                            ,u.email_user
                            ,COALESCE(u.token_user,'') as token_user
                            ,u.token_exp_user
                            ,u.recover_password_user
                            ,u.question_user
                            ,u.answer_user
                            ,u.profile_user
                            ,u.status_user
                            ,u.name_user
                            ,u.last_name_user
                            ,u.avatar_user
                            ,u.phone_user
                            ,COALESCE(u.date_deleted_user,'') as date_deleted_user
                            ,u.date_created_user
                            ,COALESCE(u.date_updated_user,'') as date_updated_user
                            ,a.long_name_asociation
                            ,a.short_name_asociation
                            ,a.logo_asociation
                            ,a.email_asociation
                            ,a.name_contact_asociation
                            ,a.phone_asociation
                    FROM users u
                    LEFT OUTER JOIN asociations a
                    ON ( u.id_asociation_user = a.id_asociation )
                    WHERE u.id_user = ?;`;

        const response = await this.getAll(sql, arrData);
        if (response.message !== 'success') {
            console.log('Componente ' + this.className + ': getDataUserById: response ─> ', response.message);
            return response;
        }
        if (response.num_records == 1) {
            this.fillUser(response.records[0]);
            return response;
        }
        if (response.num_records == 0) {
            Globals.updateResponse(404, 'Record not found', 'Record not found', Helper.basename(`${__filename}`), 'getDataUserById');
            return { status: 500, message: 'Record not found' };
        }
        if (response.num_records > 1) {
            Globals.updateResponse(404, 'Duplicate record', 'Duplicate record', Helper.basename(`${__filename}`), 'getDataUserById');
            return { status: 500, message: 'Duplicate record' };
        }
    }

    public getAllUsers = async () => {
        const sql = `SELECT  u.id_user
							,u.id_asociation_user
							,u.user_name_user
							,u.email_user
							,u.recover_password_user
							,u.token_user
							,u.token_exp_user
							,u.profile_user
							,u.status_user
							,u.name_user
							,u.last_name_user
							,u.avatar_user
							,u.phone_user
							,COALESCE(u.date_deleted_user,'') as date_deleted_user
							,u.date_created_user
							,COALESCE(u.date_updated_user,'') as date_updated_user
							,a.long_name_asociation
							,a.short_name_asociation
							,a.logo_asociation
							,a.email_asociation
							,a.name_contact_asociation
							,a.phone_asociation
					FROM users u
					LEFT OUTER JOIN asociations a
					ON ( u.id_asociation_user = a.id_asociation )
					ORDER BY u.email_user ASC;`;
        console.log('getAllUsers');
        const response = await this.getAll(sql);
        return response;
    };

    public getAllByIdAsociations = async () => {
        const sql = `SELECT  u.id_user
							,u.id_asociation_user
							,u.user_name_user
							,u.email_user
							,u.recover_password_user
							,u.token_user
							,u.token_exp_user
							,u.profile_user
							,u.status_user
							,u.name_user
							,u.last_name_user
							,u.avatar_user
							,u.phone_user
							,COALESCE(u.date_deleted_user,'') as date_deleted_user
							,u.date_created_user
							,COALESCE(u.date_updated_user,'') as date_updated_user
							,a.long_name_asociation
							,a.short_name_asociation
							,a.logo_asociation
							,a.email_asociation
							,a.name_contact_asociation
							,a.phone_asociation
					FROM users u
					LEFT OUTER JOIN asociations a
					ON ( u.id_asociation_user = a.id_asociation )
                    WHERE u.id_asociation_user = ?
					ORDER BY u.email_user ASC;`;

        const arrData = [this.id_asociation_user];

        console.log('getAllByIdAsociations');
        const response = await this.getAll(sql, arrData);
        return response;
    };

    public async userCreate() {
        // console.log('Componente ' + this.className + ': createProfile: this.password_user  ─> ', this.password_user);
        // console.log('Componente ' + this.className + ': createProfile: MAGIC_SEED  ─> ', MAGIC_SEED);
        let passwordHash = '';
        try {
            // console.log('Componente ' + this.className + ': createProfile: salt  ─> ', genSaltSync(50));
            const salt = await genSaltSync(10);
            passwordHash = await hashSync(this.password_user, salt);
            // console.log('Componente ' + this.className + ': createProfile: passwordHash  ─> ', passwordHash);
        } catch (error) {
            console.log('Componente ' + this.className + ': createProfile: passwordHash error ─> ', error);
        }
        this.recover_password_user = 0;
        this.token_user = '';
        this.token_exp_user = 0;

        // console.log('Componente ' + this.className + ': createProfile: sql ─> ', sql);
        const arrData = [
            this.id_asociation_user,
            this.user_name_user,
            this.email_user,
            passwordHash,
            this.question_user,
            this.answer_user,
            this.profile_user,
            this.status_user,
            this.name_user,
            this.last_name_user,
            this.phone_user,
        ];

        const sql = `INSERT INTO users (
                         id_asociation_user
                        ,user_name_user
                        ,email_user
                        ,password_user
                        ,question_user
                        ,answer_user
                        ,profile_user
                        ,status_user
                        ,name_user
                        ,last_name_user
                        ,phone_user
                        )
                VALUES (?${', ?'.repeat(arrData.length - 1)})`;
        // VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const resUpdate = this.insert(sql, arrData);
        return resUpdate;
    }

    public async updateUser() {
        const sql = `UPDATE users
                    SET   id_asociation_user = ?
                        , user_name_user = ?
                        , name_user = ?
                        , last_name_user = ?
                        , phone_user = ?
                        , profile_user = ?
                        , status_user = ?
                    WHERE id_user = ?
                    and COALESCE(date_updated_user,'') = ? `;

        const arrDatos = [
            this.id_asociation_user,
            this.user_name_user,
            this.name_user,
            this.last_name_user,
            this.phone_user,
            this.profile_user,
            this.status_user,
            this.id_user,
            this.date_updated_user,
        ];

        console.log('Componente Auth: updateToken: sql ─> ', sql);
        console.log('Componente Auth: updateToken: arrDatos ─> ', arrDatos);
        const resUpdate = await this.update(sql, arrDatos);
        console.log('Componente Auth: updateToken: resUpdate ─> ', resUpdate);
        return resUpdate;
    }

    public async createProfile() {
        // console.log('Componente ' + this.className + ': createProfile: this.password_user  ─> ', this.password_user);
        // console.log('Componente ' + this.className + ': createProfile: MAGIC_SEED  ─> ', MAGIC_SEED);
        let passwordHash = '';
        try {
            // console.log('Componente ' + this.className + ': createProfile: salt  ─> ', genSaltSync(50));
            const salt = await genSaltSync(10);
            passwordHash = await hashSync(this.password_user, salt);
            // console.log('Componente ' + this.className + ': createProfile: passwordHash  ─> ', passwordHash);
        } catch (error) {
            console.log('Componente ' + this.className + ': createProfile: passwordHash error ─> ', error);
        }
        this.recover_password_user = 0;
        this.token_user = '';
        this.token_exp_user = 0;

        // console.log('Componente ' + this.className + ': createProfile: sql ─> ', sql);
        const arrData = [
            this.id_asociation_user,
            this.user_name_user,
            this.email_user,
            passwordHash,
            this.recover_password_user,
            this.token_user,
            this.token_exp_user,
            this.profile_user,
            this.status_user,
            this.name_user,
            this.last_name_user,
            this.avatar_user,
            this.phone_user,
        ];

        const sql = `INSERT INTO users (
                             id_asociation_user
                            ,user_name_user
                            ,email_user
                            ,password_user
                            ,recover_password_user
                            ,token_user
                            ,token_exp_user
                            ,question_user
                            ,answer_user
                            ,profile_user
                            ,status_user
                            ,name_user
                            ,last_name_user
                            ,avatar_user
                            ,phone_user
                        )
                VALUES (?${', ?'.repeat(arrData.length - 1)})`;
        // VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const resUpdate = this.insert(sql, arrData);
        return resUpdate;
    }

    public async createGenericProfile() {
        // console.log('Componente ' + this.className + ': createProfile: this.password_user  ─> ', this.password_user);
        // console.log('Componente ' + this.className + ': createProfile: MAGIC_SEED  ─> ', MAGIC_SEED);
        let passwordHash = '';
        try {
            // console.log('Componente ' + this.className + ': createProfile: salt  ─> ', genSaltSync(50));
            const salt = await genSaltSync(10);
            passwordHash = await hashSync(this.password_user, salt);
            // console.log('Componente ' + this.className + ': createProfile: passwordHash  ─> ', passwordHash);
        } catch (error) {
            console.log('Componente ' + this.className + ': createProfile: passwordHash error ─> ', error);
        }
        this.recover_password_user = 0;
        this.token_user = '';
        this.token_exp_user = 0;

        const sql = `INSERT INTO users (
                             id_asociation_user
                            ,user_name_user
                            ,email_user
                            ,password_user
                            ,recover_password_user
                            ,token_user
                            ,token_exp_user
                            ,profile_user
                            ,status_user
                            ,name_user
                            ,last_name_user
                            ,avatar_user
                            ,phone_user
                        )
                VALUES (?${', ?'.repeat(12)})`;
        // VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        // console.log('Componente ' + this.className + ': createProfile: sql ─> ', sql);
        const arrData = [
            this.id_asociation_user,
            this.user_name_user,
            this.email_user,
            passwordHash,
            this.recover_password_user,
            this.token_user,
            this.token_exp_user,
            this.profile_user,
            this.status_user,
            this.name_user,
            this.last_name_user,
            this.avatar_user,
            this.phone_user,
        ];

        console.log('createGenericProfile -> arrData', arrData);

        const resUpdate = this.insert(sql, arrData);
        return resUpdate;
    }

    public async deleteUser() {
        const sql = `DELETE FROM users
        WHERE id_user = ?
          and COALESCE(date_updated_user,'') = ?`;

        // console.log('Componente ' + this.className + ': createProfile: sql ─> ', sql);
        const arrData = [this.id_user, this.date_updated_user];

        const resUpdate = this.delete(sql, arrData);
        return resUpdate;
    }

    public async updateProfile() {
        const sql = `UPDATE users
                    SET   id_asociation_user = ?
                        , user_name_user = ?
                        , name_user = ?
                        , last_name_user = ?
                        , phone_user = ?
                    WHERE id_user = ?
                    and COALESCE(date_updated_user,'') = ? `;

        const arrDatos = [
            this.id_asociation_user,
            this.user_name_user,
            this.name_user,
            this.last_name_user,
            this.phone_user,
            this.id_user,
            this.date_updated_user,
        ];

        console.log('Componente Auth: updateToken: sql ─> ', sql);
        console.log('Componente Auth: updateToken: arrDatos ─> ', arrDatos);
        const resUpdate = await this.update(sql, arrDatos);
        console.log('Componente Auth: updateToken: resUpdate ─> ', resUpdate);
        return resUpdate;
    }

    public updateAvatar = async () => {
        const sql = `UPDATE users
        SET avatar_user = ?
        WHERE id_user = ?
          and COALESCE(date_updated_user,'') = ?  `;

        const arrDatos = [this.avatar_user, this.id_user, this.date_updated_user];
        console.log('Componente User: updateAvatar: arrDatos ─> ', arrDatos);

        const resUpdate = await this.update(sql, arrDatos);
        console.log('Componente User: updateAvatar: resUpdate ─> ', resUpdate);
        return resUpdate;
    };

    public fillUser(record: any) {
        Object.assign(this, record);
        // Object.keys(this).map((key: string) => {
        //     this[key] = record[key];
        // });
        console.log('Componente ' + this.className + ': fillUser: this ─> ', this);
    }
}
