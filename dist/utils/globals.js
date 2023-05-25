"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = __importDefault(require("./helper"));
class Globals {
    static updateResponse(status = 500, error = 'unexpected error', message = '', module = '', func = '', result = null) {
        this.apiResponse['time'] = helper_1.default.getDateTime('YYYY-MM-DD HH:MM:SS.MMM');
        this.apiResponse['status'] = status;
        this.apiResponse['error'] = error;
        this.apiResponse['message'] = message;
        this.apiResponse['module'] = module;
        this.apiResponse['func'] = func;
        this.apiResponse['result'] = result;
        const trace = {
            time: this.apiResponse['time'],
            status: status,
            error: error,
            message: message,
            module: module,
            func: func,
            result: result,
        };
        this.apiResponse['trace'].length > 0 ? this.apiResponse['trace'].push(trace) : (this.apiResponse['trace'] = [trace]);
    }
    static httpResponse(trace = false) {
        if (trace) {
            helper_1.default.writeDebug('apiResponse', this.apiResponse);
        }
        const response = {
            status: this.apiResponse['status'],
            message: this.apiResponse['message'],
            result: this.apiResponse['result'],
        };
        if (this.apiResponse['error'] != '') {
        }
        else {
        }
        helper_1.default.writeLog();
        console.log('Componente Globals: httpResponse: time ─> ', helper_1.default.calcLapse());
        return response;
    }
    static getStatus() {
        return this.apiResponse['status'];
    }
    static getError() {
        return this.apiResponse['error'];
    }
    static getMessage() {
        return this.apiResponse['message'];
    }
    static getResult() {
        return this.apiResponse['result'];
    }
    static get apiRequest() {
        return this._apiRequest;
    }
    static set apiRequest(data) {
        this._apiRequest = data;
    }
    static get dataApiRequest() {
        return this._apiRequest.data;
    }
    static set dataApiRequest(data) {
        this._apiRequest.data = data;
    }
    static set apiResponse(data) {
        this._apiResponse = data;
    }
    static get apiResponse() {
        return this._apiResponse;
    }
}
exports.default = Globals;
Globals._apiRequest = {
    remote_addr: '',
    protocol: '',
    originalUrl: '',
    host: '',
    request_uri: '',
    date: '',
    data: null,
};
Globals._apiResponse = {
    time: '',
    status: 0,
    error: '',
    message: '',
    module: '',
    func: '',
    result: null,
    trace: [],
};
