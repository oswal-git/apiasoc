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
const globals_1 = __importDefault(require("./globals"));
const config_1 = require("../config/config");
const fs_1 = __importDefault(require("fs"));
class Helper {
    static basename(file) {
        let basename = file.replaceAll(config_1.DIRECTORY_SEPARATOR, config_1.URL_SEPARATOR);
        // let pos = basename.lastIndexOf('/');
        // basename = basename.substr(pos + 1);
        // pos = basename.lastIndexOf('.');
        // return basename.substr(0, pos);
        // const name_array = basename.split('/');
        // basename = name_array[name_array.length - 1].split('.')[0];
        return basename.split(config_1.URL_SEPARATOR)[basename.split(config_1.URL_SEPARATOR).length - 1].split('.')[0];
    }
    static get count() {
        return this._count;
    }
    static set count(data) {
        this._count = data;
    }
    static get key() {
        return this._key;
    }
    static set key(data) {
        this._key = data;
    }
    static get timeFile() {
        return this._timeFile;
    }
    static set timeFile(data) {
        this._timeFile = data;
    }
    static get lastSegment() {
        return this._lastSegment;
    }
    static set lastSegment(data) {
        this._lastSegment = data;
    }
    static initTime() {
        this._initTime = new Date().getTime();
        this._partialTime = this._initTime;
    }
    static writeDebug(comment, message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.debug) {
                return;
            }
            // Get time of request
            // const time = this.getDateTime('HH:MM:SS');
            // Get IP address
            // const remote_addr = req.headers['x-real-ip'] || req.connection.remoteAddress;
            const remote_addr = globals_1.default.apiRequest.remote_addr;
            // Get requested script
            // const request_uri = req.protocol + '://' + req.get('host') + req.originalUrl;
            // const request_uri = req.protocol + '://' + req.get('host') + req.originalUrl;
            const request_uri = globals_1.default.apiRequest.protocol + '://' + globals_1.default.apiRequest.host + globals_1.default.apiRequest.originalUrl;
            if (this.key === '') {
                this.key = this.generatePhrase('writeDebug', 10, 'iW2VvHf7AcLsCej034gSdopKwxB1XaYOZQMIUhb9kul6ztNEn8JrGRFyPTqD5m');
                this.timeFile = this.getDateTime('YYYY-MM-DD HH·MM·SS,MMM');
                this.lastSegment = request_uri.split('/').pop() || '';
            }
            // Determine log file
            const tracefile = (config_1.LOG_FILE + '_' + this.timeFile + '_' + this.lastSegment + '_' + this.key + '.log')
                .replace(config_1.URL_SEPARATOR, config_1.DIRECTORY_SEPARATOR)
                .replace('?', '@');
            // console.log('logfile: ', tracefile);
            // Format the date and time
            const date = this.getDateTime('YYYY-MM-DD HH:MM:SS');
            this.data = '';
            this.objectToString(message);
            const file_data = 
            // this.key +
            // ', ' +
            ++this.count +
                ', ' +
                date +
                ', ' +
                remote_addr +
                ', ' +
                request_uri +
                ', ' +
                comment +
                '\n' +
                '############# message:\n' +
                this.data +
                '\n' +
                // + "#####################################################################:\n\n\n"
                // + "############# salidaText:\n"
                // + salidaText + "\n"
                '#####################################################################:\n\n\n';
            fs_1.default.appendFile(tracefile, file_data, (err) => {
                if (err) {
                    console.log('Unable to write to!', err);
                    return { estado: false, msg: 'Unable to write to ' + tracefile + '! -> ' + err };
                }
                // console.log('Saved!');
                return { estado: true };
            });
            // Append to the log file
        });
    }
    static writeLog(comment = '') {
        const hours = new Date().getHours();
        const minutes = new Date().getMinutes();
        const mins = hours * 60 + minutes;
        const periode = ~~(mins / 30) + 1;
        const tracefile = (config_1.TRACE_LOG + '_' + this.getDateTime('YYYY-MM-DD') + '-' + periode + '.log')
            .replace(config_1.URL_SEPARATOR, config_1.DIRECTORY_SEPARATOR)
            .replace('?', '@');
        // console.log('tracefile: ', tracefile);
        if (this.key === '') {
            this.key = this.generatePhrase('writeLog');
        }
        // Get time of request
        // const time = this.getDateTime('HH:MM:SS');
        // Get IP address
        const remote_addr = globals_1.default.apiRequest.remote_addr;
        // Get requested script
        const request_uri = globals_1.default.apiRequest.protocol + '://' + globals_1.default.apiRequest.host + globals_1.default.apiRequest.originalUrl;
        // Format the date and time
        const date = this.getDateTime('YYYY-MM-DD HH:MM:SS');
        // Data input
        this.data = '';
        this.objectToString(globals_1.default.apiRequest, 1);
        const input_data = this.data;
        // Data output
        this.data = '';
        this.objectToString(globals_1.default.apiResponse, 1);
        const output_data = this.data;
        // Append to the log file
        try {
            const new_data = this.key +
                ', ' +
                ++this.count +
                ', ' +
                date +
                ', ' +
                remote_addr +
                ', ' +
                request_uri +
                ', ' +
                comment +
                '\n' +
                'input data:\n' +
                input_data +
                '\n' +
                'output data:\n' +
                output_data +
                '\n\n' +
                '#####################################################################:\n\n\n';
            let old_data = '';
            try {
                old_data = fs_1.default.readFileSync(tracefile); //read existing contents into data
                // console.log('data: ', 'new_data');
            }
            catch (error) {
                if (error.code === 'ENOENT') {
                    console.log('File traceLog not found!');
                }
                else {
                    console.log('Unable to write to!', error);
                    return { estado: false, msg: 'Unable to write to ' + tracefile + '! -> ' + error };
                }
            }
            const fd = fs_1.default.openSync(tracefile, 'w+');
            const buffer = Buffer.from(new_data);
            fs_1.default.writeSync(fd, buffer, 0, buffer.length, 0); //write new data
            fs_1.default.writeSync(fd, old_data, 0, old_data.length, buffer.length); //append old data
            // or fs.appendFile(fd, data);
            fs_1.default.close(fd);
            // console.log('Saved!');
            return { estado: true };
            // const fd = fs.openSync(tracefile, 'a+');
            // fs.appendFile(fd, new_data, (err) => {
            //     if (err) {
            //     }
            // });
        }
        catch (error) {
            return { estado: false, msg: 'Unable to write to ' + tracefile + '! -> ' + error };
        }
    }
    static objectToString(message, deep = 0) {
        // console.log('0 - ', message);
        if (message === null) {
            // console.log('  -------- ', message);
            this.data += '  '.repeat(2 * deep) + ' --- null -----\n';
        }
        else if (Array.isArray(message)) {
            // console.log('2 - ', message);
            for (let msg of message) {
                // console.log('3 - ', msg);
                if (typeof msg === 'string' || typeof msg === 'number') {
                    // console.log('4 - ', msg);
                    this.data += '  '.repeat(2 * deep) + msg + '\n';
                }
                else if (Array.isArray(msg)) {
                    // console.log('5 - ', msg);
                    this.data += '  '.repeat(2 * deep) + 'Array =>  ' + '\n';
                    this.objectToString(msg, deep + 1);
                }
                else if (typeof msg === 'object') {
                    // console.log('6 - ', msg);
                    this.data += '  '.repeat(2 * deep) + 'Object =>  ' + '\n';
                    this.objectToString(msg, deep + 1);
                }
                else {
                    this.data += '  '.repeat(2 * deep) + ' --- ' + typeof msg + ' -----\n';
                }
            }
        }
        else if (message === undefined) {
            // console.log('1 - ', message);
            this.data += '  '.repeat(2 * deep) + ' --- undefined -----\n';
        }
        else if (typeof message === 'string' || typeof message === 'number') {
            // console.log('1 - ', message);
            this.data += '  '.repeat(2 * deep) + message + '\n';
        }
        else if (typeof message === 'object') {
            // console.log('7 - ', message);
            Object.keys(message).map((key) => {
                if (message[key] === undefined) {
                    // console.log('9 - ', message[key]);
                    this.data += '  '.repeat(2 * deep) + key + ' =>  --- undefined ---\n';
                }
                else if (message[key] === null) {
                    // console.log('9 - ', message[key]);
                    this.data += '  '.repeat(2 * deep) + key + ' =>  --- null ---\n';
                }
                else if (typeof message[key] === 'string' || typeof message[key] === 'number') {
                    // console.log('9 - ', message[key]);
                    this.data += '  '.repeat(2 * deep) + key + ' =>  ' + message[key] + '\n';
                }
                else if (Array.isArray(message[key])) {
                    // console.log('10 - ', message[key]);
                    this.data += '  '.repeat(2 * deep) + key + ' =>  ' + '\n';
                    this.objectToString(message[key], deep + 1);
                }
                else if (typeof message[key] === 'object') {
                    // console.log('11 - ', message[key]);
                    this.data += '  '.repeat(2 * deep) + key + ' =>  ' + '\n';
                    this.objectToString(message[key], deep + 1);
                }
                else {
                    this.data += '  '.repeat(2 * deep) + ' --- ' + typeof message[key] + ' -----\n';
                }
            });
        }
        else {
            this.data += '  '.repeat(2 * deep) + ' --- ¿¿¿??? -----\n';
        }
    }
    static base64url(source) {
        let encodedSource = CryptoJS.enc.Base64.stringify(source);
        encodedSource = encodedSource.replace(/=+$/, '');
        encodedSource = encodedSource.replace(/\+/g, '-');
        encodedSource = encodedSource.replace(/\//g, '_');
        return encodedSource;
    }
    static encodeToken(payload) {
        const header = {
            alg: 'HS256',
            typ: 'JWT',
        };
        const stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
        const encodedHeader = this.base64url(stringifiedHeader);
        const stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(payload));
        const encodedData = this.base64url(stringifiedData);
        const token = encodedHeader + '.' + encodedData;
        return token;
    }
    static signToken(payload, key) {
        const secret = key;
        let token = this.encodeToken(payload);
        let signature = CryptoJS.HmacSHA256(token, secret);
        signature = this.base64url(signature);
        const signedToken = token + '.' + signature;
        return signedToken;
    }
}
exports.default = Helper;
_a = Helper;
Helper.debug = false;
Helper._count = 0;
Helper._key = '';
Helper._timeFile = '';
Helper._lastSegment = '';
Helper._initTime = 0;
Helper._partialTime = 0;
Helper._checkTime = 0;
Helper.data = '';
Helper.getDateTime = (format = '') => {
    let dateTime = '';
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    let date_ob = new Date();
    // date_ob.setTime(date_ob.getTime() - new Date().getTimezoneOffset() * 60 * 1000);
    // current date
    // adjust 0 before single digit date
    let day = ('0' + date_ob.getDate()).slice(-2);
    // current month
    let month = ('0' + date_ob.getMonth() + 2).slice(-2);
    let month_name = months[parseInt(month) - 1];
    // console.log('month: ', month);
    // current year
    let year = date_ob.getFullYear();
    // current hours
    let hours = ('0' + date_ob.getHours()).slice(-2);
    // current minutes
    let minutes = ('0' + date_ob.getMinutes()).slice(-2);
    // current seconds
    let seconds = ('0' + date_ob.getSeconds()).slice(-2);
    // current milliseconds
    let milliseconds = ('0' + date_ob.getMilliseconds()).slice(-3);
    switch (format) {
        case 'YYYY-MM-DD':
            // prints date in YYYY-MM-DD format
            dateTime = year + '-' + month + '-' + day;
            break;
        case 'YYYY-MM-DD HH:MM:SS':
            // prints date & time in YYYY-MM-DD HH:MM:SS format
            dateTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
            break;
        case 'YYYY-MM-DD HH:MM:SS.MMM':
            // prints date & time in YYYY-MM-DD HH:MM:SS.MMM format
            dateTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds + '.' + milliseconds;
            break;
        case 'YYYY-MM-DD HH·MM·SS,MMM':
            // prints date & time in YYYY-MM-DD HH:MM:SS.MMM format
            dateTime = year + '-' + month + '-' + day + ' ' + hours + '·' + minutes + '·' + seconds + ',' + milliseconds;
            break;
        case 'HH:MM':
            // prints time in HH:MM format
            dateTime = hours + ':' + minutes;
            break;
        case 'HH:MM:SS':
            // prints time in HH:MM format
            dateTime = hours + ':' + minutes + ':' + seconds;
            break;
        default:
            dateTime =
                parseInt(day).toString() +
                    ' de ' +
                    month_name +
                    ' de ' +
                    year +
                    ' a las ' +
                    parseInt(hours).toString() +
                    ' horas, ' +
                    parseInt(minutes).toString() +
                    ' minutos y ' +
                    parseInt(seconds).toString() +
                    ' segundos';
            break;
    }
    return dateTime;
};
Helper.generatePhrase = (whatFor = '', length = 30, keyspace = '') => {
    if (keyspace === '') {
        keyspace = config_1.KEYPHRASE;
    }
    let str = '';
    const min = 0;
    const max = keyspace.length - 1;
    if (max < 1) {
        globals_1.default.updateResponse(400, 'keyspace must be at least two characters long', 'Error get new password', Helper.basename(`${__filename}`), whatFor + ': generatePassword');
        return str;
    }
    for (let i = 0; i < length; ++i) {
        str += keyspace[Math.floor(Math.random() * (max - min) + min)];
    }
    console.log('Componente Auth: ' + whatFor + ': generatePassword: password_user ─> ', str);
    console.log('Componente ' + whatFor + ': generatePassword: time ─> ', Helper.calcLapse());
    return str;
};
Helper.calcLapse = () => {
    _a._checkTime = new Date().getTime();
    let elapsedTotal = _a._checkTime - _a._initTime;
    let elapsed = _a._checkTime - _a._partialTime;
    _a._partialTime = _a._checkTime;
    return `Partial elapsed: ${elapsed / 1000}s, Total lapse: ${elapsedTotal / 1000}s`;
};
