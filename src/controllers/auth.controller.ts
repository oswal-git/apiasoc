import Auth from '../models/auth';
import { Request, Response } from 'express';
import Asoc from '../models/asoc';
import Globals from '../utils/globals';
import Helper from '../utils/helper';
import User from '../models/user';
import { sendMail } from '../config/emailer';

// display list of customer

export const login = async (req: Request, res: Response, _next: any) => {
    const auth = new Auth();
    let response: any = null;

    auth.email_user = req.body.email_user;
    response = await auth.getUserByEmail();
    if (response.message !== 'success') {
        Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'login');
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    } else if (response.num_records !== 1) {
        Globals.updateResponse(400, 'Non unique record', 'User/password not match', Helper.basename(`${__filename}`), 'login');
        // console.log('Componente auth.controller: login: Globals.httpResponse()  ─> ', Globals.httpResponse());
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    }

    const isCorrect = await auth.validatePassword(req.body.password_user, auth.password_user);
    if (!isCorrect) {
        Globals.updateResponse(400, 'Missmatch password', 'User/password not match', Helper.basename(`${__filename}`), 'login');
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    }

    // auth.token_exp_user = (hours * 60 + minuts) * 60 + seconds; // (hours * 60 + minuts) * 60 + seconds =  6 hours
    auth.token_user = await auth.createTokenJwt();

    console.log('token_user:     ------------->     ', auth.token_user);
    console.log('token_exp_user: -------------> +now', auth.token_exp_user);

    response = await auth.updateToken();
    if (response.message !== 'success') {
        Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'login');
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    }

    // console.log('Componente auth.controller: login: updateToken  ─> ', response);

    let dataUser = {};
    response = await auth.getDataUserById();
    if (response.message !== 'success') {
        Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'login');
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    } else if (response.num_records !== 1) {
        Globals.updateResponse(400, 'Non unique record', 'User/password not match', Helper.basename(`${__filename}`), 'login');
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    }
    dataUser = response.records[0];

    let dataAsoc = {};

    // console.log('Componente auth.controller: login: auth.id_user  ─> ', auth.id_user);
    // console.log('Componente auth.controller: login: auth.id_asociation_user  ─> ', auth.id_asociation_user);
    // console.log('Componente auth.controller: login: auth.profile_user  ─> ', auth.profile_user);
    if (auth.id_asociation_user > 0) {
        const asoc = new Asoc();
        asoc.id_asociation = auth.id_asociation_user;

        response = await asoc.getAsociationById();
        if (response.message !== 'success') {
            Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'login');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }
        dataAsoc = response.records[0];
    } else if (auth.profile_user !== 'superadmin') {
        Globals.updateResponse(
            400,
            'Missing asociation',
            'Missing asociation. Please, contact with the association manager.',
            Helper.basename(`${__filename}`),
            'login'
        );
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    }

    const result = { data_user: dataUser, data_asoc: dataAsoc };
    Globals.updateResponse(200, '', 'ok', Helper.basename(`${__filename}`), 'login', result);

    return res.status(Globals.getStatus()).json(Globals.httpResponse());
};

export const userLogin = async (req: Request, res: Response, _next: any) => {
    const auth = new Auth();
    let response: any = null;

    auth.user_name_user = req.body.user_name_user;
    auth.id_asociation_user = req.body.id_asociation_user;
    console.log('req.body.user_name_user:     ------------->     ', req.body.user_name_user);
    console.log('req.body.id_asociation_user:     ------------->     ', req.body.id_asociation_user);
    response = await auth.getUserByNameAndAsociation();
    if (response.message !== 'success') {
        Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'userLogin');
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    } else if (response.num_records !== 1) {
        Globals.updateResponse(400, 'Non unique record', 'User/password not match', Helper.basename(`${__filename}`), 'userLogin');
        // console.log('Componente auth.controller: userLogin: Globals.httpResponse()  ─> ', Globals.httpResponse());
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    }

    const isCorrect = await auth.validatePassword(req.body.password_user, auth.password_user);
    if (!isCorrect) {
        Globals.updateResponse(400, 'Missmatch password', 'User/password not match', Helper.basename(`${__filename}`), 'userLogin');
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    }

    // auth.token_exp_user = (hours * 60 + minuts) * 60 + seconds; // (hours * 60 + minuts) * 60 + seconds =  6 hours
    auth.token_user = await auth.createTokenJwt();

    console.log('token_user:     ------------->     ', auth.token_user);
    console.log('token_exp_user: -------------> +now', auth.token_exp_user);

    response = await auth.updateToken();
    if (response.message !== 'success') {
        Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'userLogin');
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    }

    console.log('Componente auth.controller: userLogin: updateToken  ─> ', response);

    let dataUser = {};
    response = await auth.getDataUserById();
    if (response.message !== 'success') {
        Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'userLogin');
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    } else if (response.num_records !== 1) {
        Globals.updateResponse(400, 'Non unique record', 'User/password not match', Helper.basename(`${__filename}`), 'userLogin');
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    }
    dataUser = response.records[0];

    let dataAsoc = {};

    // console.log('Componente auth.controller: userLogin: auth.id_user  ─> ', auth.id_user);
    // console.log('Componente auth.controller: userLogin: auth.id_asociation_user  ─> ', auth.id_asociation_user);
    // console.log('Componente auth.controller: userLogin: auth.profile_user  ─> ', auth.profile_user);
    if (auth.id_asociation_user > 0) {
        const asoc = new Asoc();
        asoc.id_asociation = auth.id_asociation_user;

        response = await asoc.getAsociationById();
        if (response.message !== 'success') {
            Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'userLogin');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }
        dataAsoc = response.records[0];
    } else if (auth.profile_user !== 'superadmin') {
        Globals.updateResponse(
            400,
            'Missing asociation',
            'Missing asociation. Please, contact with the association manager.',
            Helper.basename(`${__filename}`),
            'userLogin'
        );
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    }

    const result = { data_user: dataUser, data_asoc: dataAsoc };
    Globals.updateResponse(200, '', 'ok', Helper.basename(`${__filename}`), 'userLogin', result);

    return res.status(Globals.getStatus()).json(Globals.httpResponse());
};

export const logout = async (req: Request, res: Response, _next: any) => {
    const _name = 'auth.controler';
    let response: any = null;
    console.log('Componente ' + _name + ': logout: req.body.user ─> ', req.body.user);
    if (req.body.tokenValidate !== 'valid') {
        Globals.updateResponse(400, req.body.tokenValidateMsg, 'Token not was able', Helper.basename(`${__filename}`), 'logout');
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    }

    try {
        const auth = new Auth();
        auth.id_user = req.body.user;

        response = await auth.getDataUserById();
        if (response.message !== 'success') {
            Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'logout');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        } else if (response.num_records !== 1) {
            Globals.updateResponse(400, 'Non unique record', 'User/password not match', Helper.basename(`${__filename}`), 'logout');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        } else if (auth.token_user !== req.body.token) {
            Globals.updateResponse(400, 'Token not match', 'Token not match', Helper.basename(`${__filename}`), 'logout');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        } else if (auth.id_user !== req.body.user) {
            Globals.updateResponse(
                400,
                'User not authorized to modify this logout',
                'User not authorized to modify this logout.',
                Helper.basename(`${__filename}`),
                'logout'
            );
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }

        auth.id_user = req.body.user;
        auth.token_exp_user = 0;
        auth.token_user = '';

        console.log('logout --->');
        response = await auth.updateToken();
        if (response.message !== 'success') {
            Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'logout');
            // console.log('Componente ' + _name + ': logout: Globals.httpResponse()  ─> ', Globals.httpResponse());
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
            // return res.status(response.status).json({ message: response.error });
        } else if (response.num_records !== 1) {
            Globals.updateResponse(400, 'Non unique record', 'User not match', Helper.basename(`${__filename}`), 'logout');
            // console.log('Componente ' + _name + ': logout: Globals.httpResponse()  ─> ', Globals.httpResponse());
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
            // return res.status(response.status).json({ message: response.error });
        }

        Globals.updateResponse(200, '', 'success', Helper.basename(`${__filename}`), 'logout');

        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    } catch (error: any) {
        // console.log('Componente ' + _name + ': logout: catch error  ─> ', error);
        Globals.updateResponse(500, error, 'Something goes wrong: ', Helper.basename(`${__filename}`), 'logout');
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
        // return res.status(500).json({ message: 'Something goes wrong: ' + error });
    }
};

export const register = async (req: Request, res: Response, _next: any) => {
    const _name = 'auth.controler';
    let response: any = null;
    console.log('Componente ' + _name + ': register:  ─> ');
    try {
        const asoc = new Asoc();
        const auth = new Auth();
        auth.email_user = req.body.email_user;
        auth.id_asociation_user = req.body.id_asociation_user;

        const user = new User();
        user.id_asociation_user = req.body.id_asociation_user;
        const name_asociation_user = req.body.name_asociation_user;
        user.user_name_user = req.body.user_name_user;
        user.email_user = req.body.email_user;
        user.password_user = req.body.password_user;
        user.profile_user = req.body.profile_user;
        user.status_user = req.body.status_user;
        user.name_user = req.body.name_user;
        user.last_name_user = req.body.last_name_user;
        user.phone_user = req.body.phone_user;

        const checkUser: boolean = await user.findUserByEmail();
        if (checkUser) {
            Globals.updateResponse(
                400,
                'There is already a user with this email',
                'There is already a user with this email.',
                Helper.basename(`${__filename}`),
                'register'
            );
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }

        if (auth.id_asociation_user > 0) {
            asoc.id_asociation = auth.id_asociation_user;

            response = await asoc.getAsociationById();
            if (response.message !== 'success') {
                Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'profile');
                return res.status(Globals.getStatus()).json(Globals.httpResponse());
            } else if (response.num_records === 0) {
                Globals.updateResponse(
                    400,
                    'The asociation selected not exist',
                    'The asociation selected not exist.',
                    Helper.basename(`${__filename}`),
                    'profile'
                );
                return res.status(Globals.getStatus()).json(Globals.httpResponse());
            } else if (response.num_records > 1) {
                Globals.updateResponse(
                    400,
                    'Duplicate asociation selected',
                    'Duplicate asociation selected.',
                    Helper.basename(`${__filename}`),
                    'profile'
                );
                return res.status(Globals.getStatus()).json(Globals.httpResponse());
            }
        } else if (name_asociation_user !== '') {
            asoc.email_asociation = user.email_user;
            asoc.long_name_asociation = name_asociation_user;
            asoc.name_contact_asociation = user.name_user + ' ' + user.last_name_user;
            asoc.phone_asociation = user.phone_user;
            response = await asoc.createAsociation();
            // console.log('Componente ' + _name + ': create: response  ─> ', response);
            if (response.message !== 'success') {
                Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'profile');
                // console.log('Componente ' + _name + ': create: Globals.httpResponse()  ─> ', Globals.httpResponse());
                return res.status(Globals.getStatus()).json(Globals.httpResponse());
                // return res.status(response.status).json({ message: response.error });
            }

            user.id_asociation_user = response.records.id;
            user.profile_user = 'admin';
            asoc.id_asociation = response.records.id;
        } else {
            Globals.updateResponse(
                400,
                'There is not asociation selected',
                'There is not asociation selected.',
                Helper.basename(`${__filename}`),
                'profile'
            );
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }

        // console.log('register --->');
        response = await user.createProfile();
        // console.log('Componente ' + _name + ': register: response  ─> ', response);

        if (response.message === 'success') {
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        } else {
            Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'register');
            // console.log('Componente ' + _name + ': register: Globals.httpResponse()  ─> ', Globals.httpResponse());
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
            // return res.status(response.status).json({ message: response.error });
        }
    } catch (error: any) {
        // console.log('Componente ' + _name + ': register: catch error  ─> ', error);
        Globals.updateResponse(500, error, 'Something goes wrong: ', Helper.basename(`${__filename}`), 'register');
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
        // return res.status(500).json({ message: 'Something goes wrong: ' + error });
    }
};

export const registreGeneric = async (req: Request, res: Response, _next: any) => {
    const _name = 'auth.controler';
    let response: any = null;
    console.log('Componente ' + _name + ': register:  ─> ');
    try {
        const asoc = new Asoc();
        const auth = new Auth();
        auth.user_name_user = req.body.user_name_user;
        auth.id_asociation_user = req.body.id_asociation_user;

        const user = new User();
        user.id_asociation_user = req.body.id_asociation_user;
        const name_asociation_user = req.body.name_asociation_user;
        user.user_name_user = req.body.user_name_user;
        user.email_user = '';
        user.password_user = req.body.password_user;
        user.profile_user = 'asociado';
        user.status_user = 'activo';
        user.name_user = '';
        user.last_name_user = '';
        user.phone_user = '';

        const checkUser: boolean = await user.findUserByNameAndAsociation();
        if (checkUser) {
            Globals.updateResponse(
                400,
                'There is already a user with this name',
                'There is already a user with this name.',
                Helper.basename(`${__filename}`),
                'registreGeneric'
            );
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }

        if (auth.id_asociation_user > 0) {
            asoc.id_asociation = auth.id_asociation_user;

            response = await asoc.getAsociationById();
            if (response.message !== 'success') {
                Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'profile');
                return res.status(Globals.getStatus()).json(Globals.httpResponse());
            } else if (response.num_records === 0) {
                Globals.updateResponse(
                    400,
                    'The asociation selected not exist',
                    'The asociation selected not exist.',
                    Helper.basename(`${__filename}`),
                    'profile'
                );
                return res.status(Globals.getStatus()).json(Globals.httpResponse());
            } else if (response.num_records > 1) {
                Globals.updateResponse(
                    400,
                    'Duplicate asociation selected',
                    'Duplicate asociation selected.',
                    Helper.basename(`${__filename}`),
                    'profile'
                );
                return res.status(Globals.getStatus()).json(Globals.httpResponse());
            }
        } else if (name_asociation_user !== '') {
            asoc.email_asociation = user.email_user;
            asoc.long_name_asociation = name_asociation_user;
            asoc.name_contact_asociation = user.name_user + ' ' + user.last_name_user;
            asoc.phone_asociation = user.phone_user;
            response = await asoc.createAsociation();
            // console.log('Componente ' + _name + ': create: response  ─> ', response);
            if (response.message !== 'success') {
                Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'profile');
                // console.log('Componente ' + _name + ': create: Globals.httpResponse()  ─> ', Globals.httpResponse());
                return res.status(Globals.getStatus()).json(Globals.httpResponse());
                // return res.status(response.status).json({ message: response.error });
            }

            user.id_asociation_user = response.records.id;
            user.profile_user = 'admin';
            asoc.id_asociation = response.records.id;
        } else {
            Globals.updateResponse(
                400,
                'There is not asociation selected',
                'There is not asociation selected.',
                Helper.basename(`${__filename}`),
                'profile'
            );
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }

        // console.log('register --->');
        response = await user.createGenericProfile();
        // console.log('Componente ' + _name + ': register: response  ─> ', response);

        if (response.message === 'success') {
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        } else {
            Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'register');
            // console.log('Componente ' + _name + ': register: Globals.httpResponse()  ─> ', Globals.httpResponse());
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
            // return res.status(response.status).json({ message: response.error });
        }
    } catch (error: any) {
        // console.log('Componente ' + _name + ': register: catch error  ─> ', error);
        Globals.updateResponse(500, error, 'Something goes wrong: ', Helper.basename(`${__filename}`), 'register');
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
        // return res.status(500).json({ message: 'Something goes wrong: ' + error });
    }
};

export const profile = async (req: Request, res: Response, _next: any) => {
    const _name = 'auth.controler';
    let response: any = null;
    console.log('Componente ' + _name + ': profile:  ─> ');
    if (req.body.tokenValidate !== 'valid') {
        Globals.updateResponse(400, req.body.tokenValidateMsg, 'Token not was able', Helper.basename(`${__filename}`), 'profile');
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    }

    try {
        const auth = new Auth();
        auth.id_user = req.body.user;

        response = await auth.getDataUserById();
        if (response.message !== 'success') {
            Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'profile');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        } else if (response.num_records !== 1) {
            Globals.updateResponse(400, 'Non unique record', 'User/password not match', Helper.basename(`${__filename}`), 'profile');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        } else if (auth.date_updated_user !== req.body.date_updated_user) {
            Globals.updateResponse(
                400,
                'Record modified by another user',
                'Record modified by another user. Refresh it, please. Logout and login again.',
                Helper.basename(`${__filename}`),
                'profile'
            );
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        } else if (auth.token_user !== req.body.token) {
            Globals.updateResponse(400, 'Token not match', 'Token not match', Helper.basename(`${__filename}`), 'profile');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        } else if (auth.id_user !== req.body.user) {
            Globals.updateResponse(
                400,
                'User not authorized to modify this profile',
                'User not authorized to modify this profile.',
                Helper.basename(`${__filename}`),
                'profile'
            );
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }

        auth.id_user = req.body.id_user;
        auth.id_asociation_user = req.body.id_asociation_user;
        auth.user_name_user = req.body.user_name_user;
        auth.name_user = req.body.name_user;
        auth.last_name_user = req.body.last_name_user;
        auth.phone_user = req.body.phone_user;
        auth.date_updated_user = req.body.date_updated_user;

        // console.log('profile --->');
        response = await auth.updateProfile();
        console.log('Componente ' + _name + ': profile: response  ─> ', response);
        if (response.message !== 'success') {
            Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'profile');
            // console.log('Componente ' + _name + ': profile: Globals.httpResponse()  ─> ', Globals.httpResponse());
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
            // return res.status(response.status).json({ message: response.error });
        } else if (response.num_records !== 1) {
            Globals.updateResponse(400, 'Non unique record', 'User not match', Helper.basename(`${__filename}`), 'profile');
            // console.log('Componente ' + _name + ': profile: Globals.httpResponse()  ─> ', Globals.httpResponse());
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
            // return res.status(response.status).json({ message: response.error });
        }

        let dataUser = {};
        response = await auth.getDataUserById();
        if (response.message === 'success') {
            dataUser = response.records[0];
        } else {
            Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'profile');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }

        let dataAsoc = {};

        if (auth.id_asociation_user > 0) {
            const asoc = new Asoc();
            asoc.id_asociation = auth.id_asociation_user;

            response = await asoc.getAsociationById();
            if (response.message !== 'success') {
                Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'profile');
                return res.status(Globals.getStatus()).json(Globals.httpResponse());
            }
            dataAsoc = response.records[0];
        } else if (auth.profile_user !== 'superadmin') {
            Globals.updateResponse(
                400,
                'Missing asociation',
                'Missing asociation. Please, contact with the association manager.',
                Helper.basename(`${__filename}`),
                'profile'
            );
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }

        const result = { data_user: dataUser, data_asoc: dataAsoc };
        Globals.updateResponse(200, '', 'ok', Helper.basename(`${__filename}`), 'profile', result);

        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    } catch (error: any) {
        // console.log('Componente ' + _name + ': profile: catch error  ─> ', error);
        Globals.updateResponse(500, error, 'Something goes wrong: ', Helper.basename(`${__filename}`), 'profile');
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
        // return res.status(500).json({ message: 'Something goes wrong: ' + error });
    }
};

export const changePassword = async (req: Request, res: Response, _next: any) => {
    const _name = 'auth.controler';
    let response: any = null;

    console.log('Componente ' + _name + ': changePassword: response  ─> ', response);

    const auth = new Auth();

    auth.email_user = req.body.email_user;
    response = await auth.getUserByEmail();
    if (response.message !== 'success') {
        Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'changePassword');
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    } else if (response.num_records !== 1) {
        Globals.updateResponse(400, 'Non unique record', 'User/password not match', Helper.basename(`${__filename}`), 'changePassword');
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    } else if (auth.token_user !== req.body.token) {
        Globals.updateResponse(400, 'Token not match', 'Token not match', Helper.basename(`${__filename}`), 'changePassword');
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    } else if (auth.id_user !== req.body.user) {
        Globals.updateResponse(
            400,
            'User not authorized to modify password',
            'User not authorized to modify password.',
            Helper.basename(`${__filename}`),
            'changePassword'
        );
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    }

    const isCorrect = await auth.validatePassword(req.body.password_user, auth.password_user);
    if (!isCorrect) {
        Globals.updateResponse(400, 'Missmatch password', 'User/password not match', Helper.basename(`${__filename}`), 'login');
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    }

    const now = Math.round(new Date().getTime() / 1000);
    auth.token_exp_user = (2 * 60 + 0) * 60 + 0; // (hours * 60 + minuts) * 60 + seconds =  6 hours
    auth.token_user = await auth.createTokenJwt();
    auth.token_exp_user += now;
    auth.password_user = req.body.new_password_user;
    auth.recover_password_user = 0;

    response = await auth.updatePassword();
    if (response.message !== 'success') {
        Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'login');
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    }

    let dataUser = {};
    let dataAsoc = {};

    response = await auth.getDataUserById();
    if (response.message === 'success' && response.num_records === 1) {
        dataUser = response.records[0];
    } else {
        Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'profile');
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    }

    if (auth.id_asociation_user > 0) {
        const asoc = new Asoc();
        asoc.id_asociation = auth.id_asociation_user;

        response = await asoc.getAsociationById();
        if (response.message !== 'success') {
            Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'profile');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }
        dataAsoc = response.records[0];
    } else if (auth.profile_user !== 'superadmin') {
        Globals.updateResponse(
            400,
            'Missing asociation',
            'Missing asociation. Please, contact with the association manager.',
            Helper.basename(`${__filename}`),
            'profile'
        );
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    }

    const result = { data_user: dataUser, data_asoc: dataAsoc };
    Globals.updateResponse(200, '', 'ok', Helper.basename(`${__filename}`), 'profile', result);

    return res.status(Globals.getStatus()).json(Globals.httpResponse());
};

export const resetPassword = async (req: Request, res: Response, _next: any) => {
    const auth = new Auth();
    let response: any = null;

    const data = req.body;

    auth.email_user = data.email_user;
    response = await auth.getUserByEmail();
    if (response.message !== 'success') {
        Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'resetPassword');
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    } else if (response.num_records !== 1) {
        Globals.updateResponse(400, 'Non unique record', 'User/password not match', Helper.basename(`${__filename}`), 'resetPassword');
        // console.log('Componente auth.controller: resetPassword: Globals.httpResponse()  ─> ', Globals.httpResponse());
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    }

    auth.password_user = Helper.generatePhrase('resetPassword');

    if (auth.password_user === '') {
        Globals.updateResponse(
            500,
            'Error generating new password',
            'Error generating new password',
            Helper.basename(`${__filename}`),
            'resetPassword'
        );
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    }

    const hours = 0;
    const minuts = 20;
    const seconds = 0;
    auth.token_exp_user = (hours * 60 + minuts) * 60 + seconds; // 20 minutes
    auth.token_user = '';
    auth.recover_password_user = 1;

    response = await auth.updatePassword();
    if (response.message !== 'success') {
        Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'resetPassword');
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    }

    const asoc = new Asoc();
    if (auth.id_asociation_user > 0) {
        asoc.id_asociation = auth.id_asociation_user;

        response = await asoc.getAsociationById();
        if (response.message !== 'success') {
            Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'resetPassword');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        } else if (response.num_records === 0) {
            Globals.updateResponse(
                400,
                'The asociation of user not exist',
                'The asociation of user not exist.',
                Helper.basename(`${__filename}`),
                'resetPassword'
            );
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        } else if (response.num_records > 1) {
            Globals.updateResponse(
                400,
                'Duplicate asociation selected',
                'Duplicate asociation selected.',
                Helper.basename(`${__filename}`),
                'resetPassword'
            );
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }
    }

    const subject = 'Your Recovered Password';

    // echo "Please use this password to login " + $new_password + PHP_EOL;
    // let headers = 'MIME-Version: 1.0' + '\r\n';
    // headers += 'Content-type: text/html; charset=iso-8859-1' + '\r\n';
    // headers += 'From: ' + asoc.name_contact_asociation + ' <' + asoc.email_asociation + '>' + '\r\n' + 'CC: ' + 'oswal@workmail.com' + '\r\n';
    const from = '"' + asoc.name_contact_asociation + '" <' + asoc.email_asociation + '>';
    const to = [`"${auth.name_user}" <oswal@workmail.com>`];

    const message = messageMail(asoc.name_contact_asociation, asoc.email_asociation, auth.name_user, auth.last_name_user, auth.password_user);

    response = await sendMail(subject, from, to, message);
    // await sendMail();
    console.log('Componente auth.controller: resetPassword: sendMail: response  ─> ', response);

    if (response.status === 'success') {
        Globals.updateResponse(200, '', 'ok', Helper.basename(`${__filename}`), 'resetPassword', response.msg);
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    } else {
        Globals.updateResponse(
            400,
            response.msg.response,
            'Failed to Recover your password, try again',
            Helper.basename(`${__filename}`),
            'resetPassword'
        );
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    }
};

export const connectedUser = async (req: Request, res: Response, _next: any) => {
    const _name = 'auth.controler';
    let response: any = null;

    let dataUser = {};
    let dataAsoc = {};

    const auth = new Auth();
    auth.id_user = req.body.user;

    response = await auth.getDataUserById();
    if (response.message === 'success') {
        dataUser = response.records[0];
    } else {
        Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'connectedUser');
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    }

    if (auth.id_asociation_user > 0) {
        const asoc = new Asoc();
        asoc.id_asociation = auth.id_asociation_user;

        response = await asoc.getAsociationById();
        if (response.message !== 'success') {
            Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'connectedUser');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }
        dataAsoc = response.records[0];
    } else if (auth.profile_user !== 'superadmin') {
        Globals.updateResponse(
            400,
            'Missing asociation',
            'Missing asociation. Please, contact with the association manager.',
            Helper.basename(`${__filename}`),
            'connectedUser'
        );
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    }

    const result = { data_user: dataUser, data_asoc: dataAsoc };
    Globals.updateResponse(200, '', 'ok', Helper.basename(`${__filename}`), 'connectedUser', result);

    return res.status(Globals.getStatus()).json(Globals.httpResponse());
};

const messageMail = (name_contact_asociation: string, email_asociation: string, name_user: string, last_name_user: string, new_password: string) => {
    // <html>
    //     <head>
    //         <title>Recuperación de la contraseña</title>
    //     </head>
    //     <body>
    const message = `
                <h1>Recuperación de la contraseña</h1>

                Hola, ${name_user} ${last_name_user}.<br>
                <br>Ha solicitado un nuevo password.
                <br>Utilize este password <br><br>
                <b>${new_password}</b><br>
                <br> para poder ingresar.<br>
                <br>Si no ha sido usted el que has solicitado el nuevo password, póngase en contacto con su administrador, ${name_contact_asociation}.
                <br>
                <hr>
                <br>
                El administrador<br>
                <i>${name_contact_asociation}</i><br>
                <a href="mailto:${email_asociation}">${email_asociation}</a>
                <br>
    `;
    //     </body>
    // </html>

    return message;
};
