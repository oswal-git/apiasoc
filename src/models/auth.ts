import { KEYPHRASE, MAGIC_SEED } from '../config/config';
import { sign, verify, decode } from 'jsonwebtoken';
import { compare, genSaltSync, hashSync } from 'bcryptjs';
import Globals from '../utils/globals';
import Helper from '../utils/helper';
import User from './user';
import Asoc from './asoc';
import Article from './artic';

export default class Auth extends User {
    className = 'Auth';

    public constructor() {
        // Helper::writeLog("Auth", '__construct');
        super();
        // console.log('Componente ' + this.className + ': constructor:  ─> ');
    }

    public async createTokenJwt() {
        const hours = 2;
        const minuts = 0;
        const seconds = 0;
        const expiredTime = (hours * 60 + minuts) * 60 + seconds; // (hours * 60 + minuts) * 60 + seconds =  6 hours
        console.log('Componente Auth: createTokenJwt: expiredTime ─> ', expiredTime);

        const payload = {
            iss: 'localhost',
            aud: 'localhost',
            // exp: this.token_exp_user, // 10'
            data: {
                id_user: this.id_user,
            },
        };

        const now1 = Math.round(new Date().getTime() / 1000);
        console.log('Componente Auth: createTokenJwt: now1 ─> ', now1);
        // const jwt = sign(payload, MAGIC_SEED, {
        let jwt = await sign(payload, MAGIC_SEED, {
            // algorithm: 'RS256',
            expiresIn: expiredTime,
        });

        const validate: any = await this.validateTokenJwt(this.swapTwo(jwt));
        console.log('Componente Auth: createTokenJwt: validate.payload ─> ', validate.payload);
        this.token_exp_user = validate.payload.exp;

        const now = Math.round(new Date().getTime() / 1000);
        // this.token_exp_user += now;

        console.log('Componente Auth: createTokenJwt: this.token_exp_user ─> ', this.token_exp_user);
        console.log('Componente Auth: createTokenJwt: now2 ─> ', now);
        console.log('Componente Auth: createTokenJwt: expiredTime + now ─> ', expiredTime + now);
        jwt = this.swapTwo(jwt);
        // console.log('Componente Auth: createTokenJwt: jwt swap ─> ', jwt);
        return jwt;
    }

    swapTwo = (data: string) => {
        let str = data.split('');
        var temp = str[3];
        str[3] = str[7];
        str[7] = temp;
        return str.join('');
    };

    public async validateTokenJwt(token: string) {
        try {
            token = this.swapTwo(token);
            const res = await verify(token, MAGIC_SEED, (err, decoded) => {
                if (err) {
                    switch (err.name) {
                        case 'TokenExpiredError':
                            // console.log('Componente Auth: validateTokenJwt: verify err ─> ', err.message);

                            const decoded = decode(token, { complete: true });
                            // console.log('Componente Auth: validateTokenJwt: decoded ─> ', decoded);

                            // var decoded = decode(token, { complete: true });
                            // console.log(decoded!.header);
                            // console.log(decoded!.payload);

                            return { verify: 'expired', payload: decoded!.payload };
                            break;

                        case 'JsonWebTokenError':
                            console.log('Componente Auth: validateTokenJwt: verify err JsonWebTokenError ─> ', err.message);

                            break;

                        case 'NotBeforeError':
                            console.log('Componente Auth: validateTokenJwt: verify err ─> NotBeforeError ', err.message);

                            break;

                        default:
                            console.log('Componente Auth: validateTokenJwt: verify err ─> default ', err.message);
                            break;
                    }
                    Globals.updateResponse(401, err.message, err.message, Helper.basename(`${__filename}`), 'validateTokenJwt');
                    return { verify: false, payload: err.message };
                }

                // console.log('Componente Auth: validateTokenJwt: decoded ok ─> ', decoded);
                Helper.writeDebug('validateTokenJwt: data', decoded);
                Globals.updateResponse(200, '', 'Token ok', Helper.basename(`${__filename}`), 'validateTokenJwt', decoded);
                return { verify: true, payload: decoded };
            });
            // console.log('Componente Auth: validateTokenJwt: res2 ─> ', res);
            return res;
        } catch (error: any) {
            console.log('Componente Auth: validateTokenJwt: default error ─> ', error);
            Globals.updateResponse(401, error, error, Helper.basename(`${__filename}`), 'validateTokenJwt');
            return { verify: false, payload: null };
        }
    }

    public async validatePassword(pass: string, passHash: string) {
        const isCorrect = await compare(pass, passHash);
        return isCorrect;
    }

    public async updatePassword() {
        let passwordHash = '';

        try {
            // console.log('Componente ' + this.className + ': updatePassword: salt  ─> ', genSaltSync(50));
            const salt = await genSaltSync(10);
            passwordHash = await hashSync(this.password_user, salt);
            // console.log('Componente ' + this.className + ': updatePassword: passwordHash  ─> ', passwordHash);
        } catch (error) {
            console.log('Componente ' + this.className + ': updatePassword: passwordHash error ─> ', error);
        }

        const sql = `UPDATE users
                        SET password_user = ?
                        , token_user = ?
                        , token_exp_user = ?
                        , recover_password_user = ?
                    WHERE id_user = ?`;

        const arrDatos = [passwordHash, this.token_user, this.token_exp_user, this.recover_password_user, this.id_user];

        const resUpdate = await this.update(sql, arrDatos);
        return resUpdate;
    }

    public async updateToken() {
        const sql = `UPDATE users
                    SET token_user = ?
                        , token_exp_user = ?
                        , recover_password_user = ?
                    WHERE id_user = ? `;

        const arrDatos = [this.token_user, this.token_exp_user, this.recover_password_user, this.id_user];

        const resUpdate = await this.update(sql, arrDatos);
        // console.log('Componente Auth: updateToken: resUpdate ─> ', resUpdate);
        return resUpdate;
    }

    public checkToken = async (module: string, token: string, id: number, date_updated: string) => {
        const resp = { id: 0, token: token, result: 'invalid', msg: '' };
        let response: any = null;
        Helper.writeDebug('checkToken, module: ', module);
        Helper.writeDebug('checkToken, token: ', token);
        Helper.writeDebug('checkToken, id: ', id);
        Helper.writeDebug('checkToken, date_updated: ', date_updated);

        try {
            console.log('Componente ' + this.className + ': checkToken: token ─> ', token);
            if (token === undefined || token === '') {
                Globals.updateResponse(400, 'Empty token', 'Empty token', Helper.basename(`{__filename}`), 'checkToken');
                console.log('Componente ' + this.className + ': checkToken: token ─> ', token);
                // return res.status(Globals.getStatus()).json(Globals.httpResponse());
            } else {
                const auth = new Auth();
                const validate: any = await auth.validateTokenJwt(token);

                if (validate.verify) {
                    if (validate.verify === 'expired') {
                        console.log('token_exp_user validate expired: -------------> ', validate.payload.data.id_user);
                        resp.id = validate.payload.data.id_user;
                        resp.result = 'expired';
                        resp.msg = 'Expired token';
                        return resp;
                    } else {
                        resp.id = validate.payload.data.id_user;
                        resp.result = 'Invalid';
                        console.log('token_exp_user validate: -------------> ', validate.payload.data.id_user);
                        const auth = new Auth();
                        auth.id_user = validate.payload.data.id_user;

                        response = await auth.getDataUserById();
                        if (response.message !== 'success') {
                            resp.msg = response.message;
                            return resp;
                        } else if (response.num_records !== 1) {
                            resp.msg = 'User/password not match';
                            return resp;
                        } else if (auth.token_user !== token) {
                            resp.msg = 'Token not match';
                            return resp;
                        }

                        Helper.writeDebug('checkToken: module', module);
                        if (module === 'users') {
                            const user = new User();
                            user.id_user = id;

                            response = await user.getDataUserById();
                            if (response.message !== 'success') {
                                resp.msg = response.message;
                                return resp;
                            } else if (response.num_records !== 1) {
                                resp.msg = 'User/password not match';
                                return resp;
                            } else if (user.date_updated_user !== date_updated) {
                                Helper.writeDebug('Record modified by another user', user.date_updated_user);
                                Helper.writeDebug('Record modified by another user', date_updated);
                                resp.msg = 'Record modified by another user. Refresh it, please. Logout and login again.';
                                return resp;
                            }

                            if (user.id_user === auth.id_user) {
                                Helper.writeDebug('user modifies his own avatar', '');
                                // user modifies his own avatar
                            } else if (auth.profile_user === 'superadmin') {
                                // power
                            } else if (auth.profile_user === 'admin' && auth.id_asociation_user === user.id_asociation_user) {
                                // partial power
                            } else {
                                resp.msg = 'User not authorized to modify avatar';
                                return resp;
                            }
                        } else if (module === 'asociations') {
                            const asoc = new Asoc();
                            asoc.id_asociation = id;
                            response = await asoc.getAsociationById();
                            if (response.message !== 'success') {
                                resp.msg = response.message;
                                return resp;
                            } else if (response.num_records !== 1) {
                                resp.msg = 'User/password not match';
                                return resp;
                            } else if (asoc.date_updated_asociation !== date_updated) {
                                Helper.writeDebug('Record modified by another user, asoc.date_updated_asociation: ', asoc.date_updated_asociation);
                                Helper.writeDebug('Record modified by another user, date_updated: ', date_updated);
                                resp.msg = 'Record modified by another user. Refresh it, please. Logout and login again.';
                                return resp;
                            }

                            if (auth.profile_user === 'superadmin') {
                                // power
                            } else if (auth.profile_user === 'admin' && auth.id_asociation_user === asoc.id_asociation) {
                                // partial power
                            } else {
                                resp.msg = 'User not authorized to modify logo';
                                return resp;
                            }
                        } else if (module === 'articles') {
                            const article = new Article();
                            article.id_article = id;
                            response = await article.getArticleById();
                            if (response.message !== 'success') {
                                resp.msg = response.message;
                                return resp;
                            } else if (article.date_updated_article !== date_updated) {
                                Helper.writeDebug('Record modified by another user', article.date_updated_article);
                                Helper.writeDebug('Record modified by another user', date_updated);
                                resp.msg = 'Record modified by another user. Refresh it, please.';
                                return resp;
                            }

                            if (auth.profile_user === 'superadmin' && article.id_asociation_article === parseInt('9'.repeat(9))) {
                                // power
                            } else if (['admin', 'editor'].includes(auth.profile_user) && article.id_asociation_article === auth.id_asociation_user) {
                                // partial power
                            } else {
                                resp.msg = 'User not authorized to modify images';
                                return resp;
                            }
                        } else {
                            resp.msg = 'User not authorized to modify images.';
                            return resp;
                        }

                        resp.result = 'valid';
                    }
                } else {
                    console.log('token_exp_user !validate.verify: -------------> ', validate);
                    resp.msg = 'Token not was able';
                }

                return resp;
            }
        } catch (e: any) {
            console.log({ e });
            resp.result = e.message;
            return resp;
        }
    };
}
