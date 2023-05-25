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
class Asoc extends mysql_1.default {
    constructor() {
        super();
        this.className = 'Asoc';
        this.id_asociation = 0;
        this.long_name_asociation = '';
        this.short_name_asociation = '';
        this.logo_asociation = '';
        this.email_asociation = '';
        this.name_contact_asociation = '';
        this.phone_asociation = '';
        this.date_deleted_asociation = '';
        this.date_created_asociation = '';
        this.date_updated_asociation = '';
        this.findAsociationByEmail = () => __awaiter(this, void 0, void 0, function* () {
            const arrData = [this.email_asociation];
            const sql = `SELECT	  count(*) as num_records
                    FROM asociations a
                    WHERE a.email_asociation = ?;`;
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
        this.getAsociationByEmail = () => __awaiter(this, void 0, void 0, function* () {
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
            const response = yield this.getAll(sql, arrData);
            if (response.message !== 'success') {
                console.log('Componente ' + this.className + ': getAsociationByEmail: response ─> ', response.message);
                return response;
            }
            if (response.num_records == 1) {
                this.fillAsoc(response.records[0]);
                return response;
            }
            if (response.num_records == 0) {
                globals_1.default.updateResponse(404, 'Record not found', 'Record not found', helper_1.default.basename(`${__filename}`), 'getAsociationByEmail');
                return { status: 500, message: 'Record not found' };
            }
            if (response.num_records > 1) {
                globals_1.default.updateResponse(404, 'Duplicate record', 'Duplicate record', helper_1.default.basename(`${__filename}`), 'getAsociationByEmail');
                return { status: 500, message: 'Duplicate record' };
            }
        });
        this.getAsociationById = () => __awaiter(this, void 0, void 0, function* () {
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
            const response = yield this.getAll(sql, arrData);
            if (response.message !== 'success') {
                console.log('Componente ' + this.className + ': getAsociationById: response ─> ', response.message);
                return response;
            }
            if (response.num_records == 1) {
                this.fillAsoc(response.records[0]);
                return response;
            }
            if (response.num_records == 0) {
                globals_1.default.updateResponse(404, 'Record not found', 'Record not found', helper_1.default.basename(`${__filename}`), 'getAsociationById');
                return { status: 500, message: 'Record not found' };
            }
            if (response.num_records > 1) {
                globals_1.default.updateResponse(404, 'Duplicate record', 'Duplicate record', helper_1.default.basename(`${__filename}`), 'getAsociationById');
                return { status: 500, message: 'Duplicate record' };
            }
        });
        this.getListAsociations = () => __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT	  a.id_asociation
                            , a.long_name_asociation
                            , a.short_name_asociation
                            , a.logo_asociation
                            , a.email_asociation
                            , a.name_contact_asociation
                            , a.phone_asociation
                    FROM asociations a
                    ORDER BY a.long_name_asociation ASC;`;
            const response = yield this.getAll(sql);
            return response;
        });
        this.getAllAsociations = () => __awaiter(this, void 0, void 0, function* () {
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
            const response = yield this.getAll(sql);
            return response;
        });
        this.createAsociation = () => __awaiter(this, void 0, void 0, function* () {
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
        });
        this.updateAsociation = () => __awaiter(this, void 0, void 0, function* () {
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
        });
        this.updateLogo = () => __awaiter(this, void 0, void 0, function* () {
            const sql = `UPDATE asociations
                    SET logo_asociation = ?
                    WHERE id_asociation = ?
                    AND COALESCE(date_updated_asociation,'') = ? `;
            const arrDatos = [this.logo_asociation, this.id_asociation, this.date_updated_asociation];
            console.log('Componente User: updateLogo: arrDatos ─> ', arrDatos);
            const resUpdate = yield this.update(sql, arrDatos);
            console.log('Componente User: updateLogo: resUpdate ─> ', resUpdate);
            return resUpdate;
        });
        this.deleteAsociation = () => __awaiter(this, void 0, void 0, function* () {
            const sql = `DELETE FROM asociations
        WHERE id_asociation = ?
          AND COALESCE(date_updated_asociation,'') = ? `;
            // console.log('Componente ' + this.className + ': createProfile: sql ─> ', sql);
            const arrData = [this.id_asociation, this.date_updated_asociation];
            const resUpdate = this.delete(sql, arrData);
            return resUpdate;
        });
        this.fillAsoc = (record) => __awaiter(this, void 0, void 0, function* () {
            Object.assign(this, record);
        });
        // console.log('Componente ' + this.className + ': constructor:  ─> ');
    }
}
exports.default = Asoc;
