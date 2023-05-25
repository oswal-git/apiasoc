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
const bcryptjs_1 = require("bcryptjs");
const globals_1 = __importDefault(require("../utils/globals"));
const helper_1 = __importDefault(require("../utils/helper"));
class User extends mysql_1.default {
    constructor() {
        super();
        this.className = 'User';
        this.id_user = 0;
        this.id_asociation_user = 0;
        this.user_name_user = '';
        this.email_user = '';
        this.password_user = '';
        this.recover_password_user = 0;
        this.token_user = '';
        this.token_exp_user = 0;
        this.profile_user = '';
        this.status_user = '';
        this.name_user = '';
        this.last_name_user = '';
        this.avatar_user = '';
        this.phone_user = '';
        this.date_deleted_user = '';
        this.date_created_user = '';
        this.date_updated_user = '';
        this.getAllUsers = () => __awaiter(this, void 0, void 0, function* () {
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
            const response = yield this.getAll(sql);
            return response;
        });
        this.getAllByIdAsociations = () => __awaiter(this, void 0, void 0, function* () {
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
            const response = yield this.getAll(sql, arrData);
            return response;
        });
        this.updateAvatar = () => __awaiter(this, void 0, void 0, function* () {
            const sql = `UPDATE users
        SET avatar_user = ?
        WHERE id_user = ?
          and COALESCE(date_updated_user,'') = ?  `;
            const arrDatos = [this.avatar_user, this.id_user, this.date_updated_user];
            console.log('Componente User: updateAvatar: arrDatos ─> ', arrDatos);
            const resUpdate = yield this.update(sql, arrDatos);
            console.log('Componente User: updateAvatar: resUpdate ─> ', resUpdate);
            return resUpdate;
        });
        // console.log('Componente ' + this.className + ': constructor:  ─> ');
    }
    findUserByEmail() {
        return __awaiter(this, void 0, void 0, function* () {
            const arrData = [this.email_user];
            const sql = `SELECT count(*) as num_records
                    FROM users u
                    WHERE u.email_user = ?;`;
            const response = yield this.getAll(sql, arrData);
            if (response.message === 'success') {
                // console.log('Componente ' + this.className + ': findUserByEmail: response.records[0].num_records ─> ', response.records[0].num_records);
                if (response.records[0].num_records > 0) {
                    return true;
                }
                return false;
            }
            else {
                console.log('Componente ' + this.className + ': findUserByEmail: throw new Error ─> ', response.message);
                return false;
            }
        });
    }
    getUserByEmail() {
        return __awaiter(this, void 0, void 0, function* () {
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
            const response = yield this.getAll(sql, arrData);
            if (response.message === 'success' && response.num_records === 1) {
                this.fillUser(response.records[0]);
            }
            return response;
        });
    }
    getDataUserById() {
        return __awaiter(this, void 0, void 0, function* () {
            const arrData = [this.id_user];
            const sql = `SELECT  u.id_user
                            ,u.id_asociation_user
                            ,u.user_name_user
                            ,u.email_user
                            ,COALESCE(u.token_user,'') as token_user
                            ,u.token_exp_user
                            ,u.recover_password_user
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
            const response = yield this.getAll(sql, arrData);
            if (response.message !== 'success') {
                console.log('Componente ' + this.className + ': getDataUserById: response ─> ', response.message);
                return response;
            }
            if (response.num_records == 1) {
                this.fillUser(response.records[0]);
                return response;
            }
            if (response.num_records == 0) {
                globals_1.default.updateResponse(404, 'Record not found', 'Record not found', helper_1.default.basename(`${__filename}`), 'getDataUserById');
                return { status: 500, message: 'Record not found' };
            }
            if (response.num_records > 1) {
                globals_1.default.updateResponse(404, 'Duplicate record', 'Duplicate record', helper_1.default.basename(`${__filename}`), 'getDataUserById');
                return { status: 500, message: 'Duplicate record' };
            }
        });
    }
    userCreate() {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('Componente ' + this.className + ': createProfile: this.password_user  ─> ', this.password_user);
            // console.log('Componente ' + this.className + ': createProfile: MAGIC_SEED  ─> ', MAGIC_SEED);
            let passwordHash = '';
            try {
                // console.log('Componente ' + this.className + ': createProfile: salt  ─> ', genSaltSync(50));
                const salt = yield (0, bcryptjs_1.genSaltSync)(10);
                passwordHash = yield (0, bcryptjs_1.hashSync)(this.password_user, salt);
                // console.log('Componente ' + this.className + ': createProfile: passwordHash  ─> ', passwordHash);
            }
            catch (error) {
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
                        ,profile_user
                        ,status_user
                        ,name_user
                        ,last_name_user
                        ,phone_user
                        )
                VALUES (?${', ?'.repeat(8)})`;
            // VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            // console.log('Componente ' + this.className + ': createProfile: sql ─> ', sql);
            const arrData = [
                this.id_asociation_user,
                this.user_name_user,
                this.email_user,
                passwordHash,
                this.profile_user,
                this.status_user,
                this.name_user,
                this.last_name_user,
                this.phone_user,
            ];
            const resUpdate = this.insert(sql, arrData);
            return resUpdate;
        });
    }
    updateUser() {
        return __awaiter(this, void 0, void 0, function* () {
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
            const resUpdate = yield this.update(sql, arrDatos);
            console.log('Componente Auth: updateToken: resUpdate ─> ', resUpdate);
            return resUpdate;
        });
    }
    createProfile() {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('Componente ' + this.className + ': createProfile: this.password_user  ─> ', this.password_user);
            // console.log('Componente ' + this.className + ': createProfile: MAGIC_SEED  ─> ', MAGIC_SEED);
            let passwordHash = '';
            try {
                // console.log('Componente ' + this.className + ': createProfile: salt  ─> ', genSaltSync(50));
                const salt = yield (0, bcryptjs_1.genSaltSync)(10);
                passwordHash = yield (0, bcryptjs_1.hashSync)(this.password_user, salt);
                // console.log('Componente ' + this.className + ': createProfile: passwordHash  ─> ', passwordHash);
            }
            catch (error) {
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
            const resUpdate = this.insert(sql, arrData);
            return resUpdate;
        });
    }
    deleteUser() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `DELETE FROM users
        WHERE id_user = ?
          and COALESCE(date_updated_user,'') = ?`;
            // console.log('Componente ' + this.className + ': createProfile: sql ─> ', sql);
            const arrData = [this.id_user, this.date_updated_user];
            const resUpdate = this.delete(sql, arrData);
            return resUpdate;
        });
    }
    updateProfile() {
        return __awaiter(this, void 0, void 0, function* () {
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
            const resUpdate = yield this.update(sql, arrDatos);
            console.log('Componente Auth: updateToken: resUpdate ─> ', resUpdate);
            return resUpdate;
        });
    }
    fillUser(record) {
        Object.assign(this, record);
        // Object.keys(this).map((key: string) => {
        //     this[key] = record[key];
        // });
        console.log('Componente ' + this.className + ': fillUser: this ─> ', this);
    }
}
exports.default = User;
