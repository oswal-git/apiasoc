import Helper from './helper';

export interface apiRequest {
    remote_addr: string;
    protocol: string;
    originalUrl: string;
    host: string;
    request_uri: string;
    date: string;
    data: any;
}

export interface apiResponse {
    time: string;
    status: number;
    error: string;
    message: string;
    module: string;
    func: string;
    result: any;
    trace: any[];
}

export default class Globals {
    static _apiRequest: apiRequest = {
        remote_addr: '',
        protocol: '',
        originalUrl: '',
        host: '',
        request_uri: '',
        date: '',
        data: null,
    };

    static _apiResponse: apiResponse = {
        time: '',
        status: 0,
        error: '',
        message: '',
        module: '',
        func: '',
        result: null,
        trace: [],
    };

    static updateResponse(status = 500, error = 'unexpected error', message = '', module = '', func = '', result: any | null = null) {
        this.apiResponse['time'] = Helper.getDateTime('YYYY-MM-DD HH:MM:SS.MMM');
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
            Helper.writeDebug('apiResponse', this.apiResponse);
        }

        const response = {
            status: this.apiResponse['status'],
            message: this.apiResponse['message'],
            result: this.apiResponse['result'],
        };

        if (this.apiResponse['error'] != '') {
        } else {
        }

        Helper.writeLog();

        // console.log('Componente Globals: httpResponse: time ─> ', Helper.calcLapse());

        return response;
    }

    static getStatus(): number {
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

    static set apiRequest(data: any) {
        this._apiRequest = data;
    }

    static get dataApiRequest() {
        return this._apiRequest.data;
    }

    static set dataApiRequest(data: any) {
        this._apiRequest.data = data;
    }

    static set apiResponse(data: any) {
        this._apiResponse = data;
    }

    static get apiResponse() {
        return this._apiResponse;
    }
}
