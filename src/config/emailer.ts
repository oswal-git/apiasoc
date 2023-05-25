import nodemailer from 'nodemailer';
import { google } from 'googleapis';

import accountTransport from './account_transport.json';

const OAuth2 = google.auth.OAuth2;

const OAuth2Client = new OAuth2(accountTransport.auth.clientId, accountTransport.auth.clientSecret, accountTransport.auth.redirectUri);

OAuth2Client.setCredentials({
    refresh_token: accountTransport.auth.refreshToken,
    // tls: {
    //     rejectUnauthorized: false,
    // },
});

export const sendMail = async (subject: string, from: string, to: any, message: string): Promise<any> => {
    const accessToken = OAuth2Client.getAccessToken((err, token) => {
        if (err) {
            return console.log('Componente emailer: sendMail: getAccessToken: err ─> ', err);
        }
        accountTransport.auth.accessToken = token || '';
        // console.log('Componente emailer: sendMail: getAccessToken: accountTransport.auth.accessToken ─> ', accountTransport.auth.accessToken);
        return token;
    });

    const transport = nodemailer.createTransport({
        // host: 'smtp.gmail.com',
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: accountTransport.auth.user,
            clientId: accountTransport.auth.clientId,
            clientSecret: accountTransport.auth.clientSecret,
            refreshToken: accountTransport.auth.refreshToken,
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
            } else {
                // console.log('Componente emailter: Promise: sendMail result ─> ', res);
                resolve({ status: 'success', msg: res });
            }
        });
    });
};
