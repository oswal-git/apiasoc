import Connection from './connection';
import Globals from '../../utils/globals';
import Helper from '../../utils/helper';

export default class Mysql extends Connection {
    nameParent = 'Mysql';
    strQuery = '';
    arrValues: any[] = [];

    constructor() {
        super();
        // console.log('Componente ' + this.nameParent + ': constructor:  ─> ');
    }

    async getAll(strQuery: string, arrValues: any[] = []) {
        // console.log('Componente ' + 'Mysql' + ': getAll:  ─> ');
        // console.log('Componente ' + 'Mysql' + ': getAll: strQuery ─> ', strQuery);
        // console.log('Componente ' + this.className + ': findUserByEmail: strQuery ─> ', strQuery);
        // console.log('Componente ' + this.className + ': findUserByEmail: strQuery ─> ', strQuery);
        try {
            const [results] = (await Connection.connection!!.query(strQuery, arrValues)) as any;

            // console.log('Componente ' + 'Mysql' + ': getAll: results ─> ', results[0].num_records);
            Globals.updateResponse(200, '', 'success', Helper.basename(`${__filename}`), 'getAll', { num_records: results.length, records: results });
            return { status: 200, message: 'success', num_records: results.length, records: results };
        } catch (error: any) {
            console.log('Componente ' + 'Mysql' + ': getAll: error ─> ', error);
            Globals.updateResponse(500, error, error, Helper.basename(`${__filename}`), 'getAll');
            console.log('getAll: ' + error);
            return { status: 500, message: error };
        }
    }

    public async update(strQuery: string, arrValues: any) {
        try {
            const [results, error, fields] = (await Connection.connection!.query(strQuery, arrValues)) as any;

            Helper.writeDebug(Helper.basename(`${__filename}`) + 'update: results', results);
            Globals.updateResponse(200, '', 'success', Helper.basename(`${__filename}`), 'update', { records_update: results.changedRows });
            return { status: 200, message: 'success', num_records: results.affectedRows, records: results };
        } catch (error: any) {
            console.log('Componente ' + 'Mysql' + ': update: error ─> ', error);
            Globals.updateResponse(404, error, error, Helper.basename(`${__filename}`), 'update');
            return { status: 500, message: error.sqlMessage };
        }
    }

    public async insert(strQuery: string, arrValues: any[] = []) {
        this.strQuery = strQuery;
        this.arrValues = arrValues;

        try {
            const [results, fields, error] = (await Connection.connection!.query(this.strQuery, this.arrValues)) as any;
            // console.log('Componente ' + 'mysql' + ': insert: this.strQuery ─> ', results);
            // console.log('Componente ' + 'mysql' + ': insert: error ─> ', error);
            // console.log('Componente ' + 'mysql' + ': insert: fields ─> ', fields);

            // console.log('Componente ' + 'mysql' + ': insert: serverStatus: ─> ', results.serverStatus);
            Globals.updateResponse(200, '', 'success', Helper.basename(`${__filename}`), 'update', { id: results.insertId });
            return { status: 200, message: 'success', num_records: results.affectedRows, records: { id: results.insertId } };
        } catch (error: any) {
            Globals.updateResponse(404, error.sqlMessage, error.sqlMessage, Helper.basename(`${__filename}`), 'update');
            // console.log('Componente ' + 'mysql' + ': insert: catch error ─> ', error.sqlMessage);
            return { status: 500, message: error.sqlMessage };
        }
    }

    public async delete(strQuery: string, arrValues: any[] = []) {
        this.strQuery = strQuery;
        this.arrValues = arrValues;

        try {
            const [results, fields, error] = (await Connection.connection!.query(this.strQuery, this.arrValues)) as any;
            // console.log('Componente ' + 'mysql' + ': delete: this.strQuery ─> ', results);
            // console.log('Componente ' + 'mysql' + ': delete: error ─> ', error);
            // console.log('Componente ' + 'mysql' + ': delete: fields ─> ', fields);

            console.log('Componente ' + 'mysql' + ': delete: serverStatus: ─> ', results.serverStatus);
            Globals.updateResponse(200, '', 'success', Helper.basename(`${__filename}`), 'delete', { num_records: results.affectedRows });
            return { status: 200, message: 'success', num_records: results.affectedRows, records: results };
        } catch (error: any) {
            Globals.updateResponse(404, error.sqlMessage, error.sqlMessage, Helper.basename(`${__filename}`), 'delete');
            // console.log('Componente ' + 'mysql' + ': delete: catch error ─> ', error.sqlMessage);
            return { status: 500, message: error.sqlMessage };
        }
    }

    public static initTransaccion = async () => {
        // return await Connection.connection!.beginTransaction();
        return await Connection.connection!.query('START TRANSACTION');
    };

    public static endTransaccion = async () => {
        // await Connection.connection!.commit();
        // return await Connection.connection!.end();
        return await Connection.connection!.query('COMMIT');
    };

    public static abortTransaccion = async () => {
        // await Connection.connection!.rollback();
        // return await Connection.connection!.end();
        return await Connection.connection!.query('ROLLBACK');
    };
}
