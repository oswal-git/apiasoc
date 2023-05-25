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
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const googleapis_1 = require("googleapis");
const account_transport_json_1 = __importDefault(require("./account_transport.json"));
const OAuth2 = googleapis_1.google.auth.OAuth2;
const OAuth2Client = new OAuth2(account_transport_json_1.default.auth.clientId, account_transport_json_1.default.auth.clientSecret, account_transport_json_1.default.auth.redirectUri);
OAuth2Client.setCredentials({
    refresh_token: account_transport_json_1.default.auth.refreshToken,
    // tls: {
    //     rejectUnauthorized: false,
    // },
});
const sendMail = (subject, from, to, message) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = OAuth2Client.getAccessToken((err, token) => {
        if (err) {
            return console.log('Componente emailer: sendMail: getAccessToken: err ─> ', err);
        }
        account_transport_json_1.default.auth.accessToken = token || '';
        // console.log('Componente emailer: sendMail: getAccessToken: accountTransport.auth.accessToken ─> ', accountTransport.auth.accessToken);
        return token;
    });
    const transport = nodemailer_1.default.createTransport({
        // host: 'smtp.gmail.com',
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: account_transport_json_1.default.auth.user,
            clientId: account_transport_json_1.default.auth.clientId,
            clientSecret: account_transport_json_1.default.auth.clientSecret,
            refreshToken: account_transport_json_1.default.auth.refreshToken,
            // accessToken: accessToken,
        },
    });
    const mail_options = {
        from: from,
        to: to,
        subject: subject,
        html: message,
    };
    // console.log('Componente emailter: sendMail mail_options ─> ', mail_options);
    return new Promise((resolve) => {
        // console.log('Componente emailter: Promise: sendMail ─> ');
        transport.sendMail(mail_options, (err, res) => {
            if (err) {
                // console.log('Componente emailter: Promise: sendMail err ─> ', err);
                resolve({ status: 'error', msg: err });
            }
            else {
                // console.log('Componente emailter: Promise: sendMail result ─> ', res);
                resolve({ status: 'success', msg: res });
            }
        });
    });
});
exports.sendMail = sendMail;
