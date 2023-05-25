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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("./connection"));
const globals_1 = __importDefault(require("../../utils/globals"));
const helper_1 = __importDefault(require("../../utils/helper"));
class Mysql extends connection_1.default {
    constructor() {
        super();
        this.nameParent = 'Mysql';
        this.strQuery = '';
        this.arrValues = [];
        // console.log('Componente ' + this.nameParent + ': constructor:  ─> ');
    }
    getAll(strQuery, arrValues = []) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('Componente ' + 'Mysql' + ': getAll:  ─> ');
            // console.log('Componente ' + 'Mysql' + ': getAll: strQuery ─> ', strQuery);
            // console.log('Componente ' + this.className + ': findUserByEmail: strQuery ─> ', strQuery);
            // console.log('Componente ' + this.className + ': findUserByEmail: strQuery ─> ', strQuery);
            try {
                const [results] = (yield connection_1.default.connection.query(strQuery, arrValues));
                // console.log('Componente ' + 'Mysql' + ': getAll: results ─> ', results[0].num_records);
                globals_1.default.updateResponse(200, '', 'success', helper_1.default.basename(`${__filename}`), 'getAll', { num_records: results.length, records: results });
                return { status: 200, message: 'success', num_records: results.length, records: results };
            }
            catch (error) {
                console.log('Componente ' + 'Mysql' + ': getAll: error ─> ', error);
                globals_1.default.updateResponse(500, error, error, helper_1.default.basename(`${__filename}`), 'getAll');
                console.log('getAll: ' + error);
                return { status: 500, message: error };
            }
        });
    }
    update(strQuery, arrValues) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [results, error, fields] = (yield connection_1.default.connection.query(strQuery, arrValues));
                helper_1.default.writeDebug(helper_1.default.basename(`${__filename}`) + 'update: results', results);
                globals_1.default.updateResponse(200, '', 'success', helper_1.default.basename(`${__filename}`), 'update', { records_update: results.changedRows });
                return { status: 200, message: 'success', num_records: results.affectedRows, records: results };
            }
            catch (error) {
                console.log('Componente ' + 'Mysql' + ': update: error ─> ', error);
                globals_1.default.updateResponse(404, error, error, helper_1.default.basename(`${__filename}`), 'update');
                return { status: 500, message: error.sqlMessage };
            }
        });
    }
    insert(strQuery, arrValues = []) {
        return __awaiter(this, void 0, void 0, function* () {
            this.strQuery = strQuery;
            this.arrValues = arrValues;
            try {
                const [results, fields, error] = (yield connection_1.default.connection.query(this.strQuery, this.arrValues));
                // console.log('Componente ' + 'mysql' + ': insert: this.strQuery ─> ', results);
                // console.log('Componente ' + 'mysql' + ': insert: error ─> ', error);
                // console.log('Componente ' + 'mysql' + ': insert: fields ─> ', fields);
                // console.log('Componente ' + 'mysql' + ': insert: serverStatus: ─> ', results.serverStatus);
                globals_1.default.updateResponse(200, '', 'success', helper_1.default.basename(`${__filename}`), 'update', { id: results.insertId });
                return { status: 200, message: 'success', num_records: results.affectedRows, records: { id: results.insertId } };
            }
            catch (error) {
                globals_1.default.updateResponse(404, error.sqlMessage, error.sqlMessage, helper_1.default.basename(`${__filename}`), 'update');
                // console.log('Componente ' + 'mysql' + ': insert: catch error ─> ', error.sqlMessage);
                return { status: 500, message: error.sqlMessage };
            }
        });
    }
    delete(strQuery, arrValues = []) {
        return __awaiter(this, void 0, void 0, function* () {
            this.strQuery = strQuery;
            this.arrValues = arrValues;
            try {
                const [results, fields, error] = (yield connection_1.default.connection.query(this.strQuery, this.arrValues));
                // console.log('Componente ' + 'mysql' + ': delete: this.strQuery ─> ', results);
                // console.log('Componente ' + 'mysql' + ': delete: error ─> ', error);
                // console.log('Componente ' + 'mysql' + ': delete: fields ─> ', fields);
                console.log('Componente ' + 'mysql' + ': delete: serverStatus: ─> ', results.serverStatus);
                globals_1.default.updateResponse(200, '', 'success', helper_1.default.basename(`${__filename}`), 'delete', { num_records: results.affectedRows });
                return { status: 200, message: 'success', num_records: results.affectedRows, records: results };
            }
            catch (error) {
                globals_1.default.updateResponse(404, error.sqlMessage, error.sqlMessage, helper_1.default.basename(`${__filename}`), 'delete');
                // console.log('Componente ' + 'mysql' + ': delete: catch error ─> ', error.sqlMessage);
                return { status: 500, message: error.sqlMessage };
            }
        });
    }
}
exports.default = Mysql;
_a = Mysql;
Mysql.initTransaccion = () => __awaiter(void 0, void 0, void 0, function* () {
    // return await Connection.connection!.beginTransaction();
    return yield connection_1.default.connection.query('START TRANSACTION');
});
Mysql.endTransaccion = () => __awaiter(void 0, void 0, void 0, function* () {
    // await Connection.connection!.commit();
    // return await Connection.connection!.end();
    return yield connection_1.default.connection.query('COMMIT');
});
Mysql.abortTransaccion = () => __awaiter(void 0, void 0, void 0, function* () {
    // await Connection.connection!.rollback();
    // return await Connection.connection!.end();
    return yield connection_1.default.connection.query('ROLLBACK');
});
