import { Request, Response } from 'express';
import Asoc from '../models/asoc';
import Auth from '../models/auth';
import fs from 'fs-extra';
import Globals from '../utils/globals';
import Helper from '../utils/helper';
import path from 'path';
import User from '../models/user';
import Userapp from '../models/userapp';
import { compare } from 'bcryptjs';

// const _name = 'userapp.controller.ts';

export const listQuestions = async (req: Request, res: Response, _next: any) => {
    let response: any = null;
    const data = req.params;

    try {
        const userapp = new Userapp();
        userapp.user_name_userapp = data.user_name;
        userapp.asociation_id_userapp = parseInt(data.asociation_id);
        const response: any = await userapp.getAllQuestionByUsernameAndAsociationId();
        console.log('listQuestions');
        if (response.message === 'success') {
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        } else {
            Globals.updateResponse(response.status, response.error, response.error, Helper.basename(`${__filename}`), 'listQuestions');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
            // return res.status(response.status).json({ message: response.error });
        }
    } catch (error: any) {
        console.log('Componente userapp.controller: listQuestions: error ─> ', error);
        Globals.updateResponse(500, error, 'Something goes wrong: ', Helper.basename(`${__filename}`), 'listQuestions');
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
        // return res.status(500).json({ message: 'Something goes wrong: ' + error });
    }
};

export const validateAnswer = async (req: Request, res: Response, _next: any) => {
    let response: any = null;

    try {
        const userapp = new Userapp();
        userapp.user_name_userapp = req.body.username;
        userapp.asociation_id_userapp = parseInt(req.body.asociationId);
        userapp.question_userapp = req.body.question;
        userapp.answer_userapp = req.body.key;
        // console.log('Componente userapp.controller: validateAnswer: Globals.httpResponse()  ─> ', Globals.httpResponse());

        response = await userapp.getByUsernameAndAsociationIdAndQuestion();
        if (response.message !== 'success') {
            Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'validateAnswer');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        } else if (response.num_records !== 1) {
            Globals.updateResponse(400, 'Non unique record', 'Username/question not match', Helper.basename(`${__filename}`), 'validateAnswer');
            // console.log('Componente userapp.controller: validateAnswer: Globals.httpResponse()  ─> ', Globals.httpResponse());
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }

        console.log('Componente userapp.controller: validateAnswer: req.body.key  ─> ', req.body.key);
        console.log('Componente userapp.controller: validateAnswer: userapp.answer_userapp  ─> ', userapp.answer_userapp);
        const isCorrect = await compare(req.body.key, userapp.answer_userapp);
        if (!isCorrect) {
            console.log('Componente userapp.controller: validateAnswer: isCorrect  ─> ', isCorrect);
            Globals.updateResponse(400, 'Missmatch password', 'User/key not match', Helper.basename(`${__filename}`), 'validateAnswer');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }

        let dataUser = {};
        response = await userapp.getDataUserappById();
        if (response.message !== 'success') {
            Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'validateAnswer');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        } else if (response.num_records !== 1) {
            Globals.updateResponse(400, 'Non unique record', 'Non unique record', Helper.basename(`${__filename}`), 'validateAnswer');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }
        dataUser = response.records[0];
        Globals.updateResponse(200, '', 'ok', Helper.basename(`${__filename}`), 'validateAnswer', dataUser);

        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    } catch (error: any) {
        console.log('Componente userapp.controller: validateAnswer: error ─> ', error);
        Globals.updateResponse(500, error, 'Something goes wrong: ', Helper.basename(`${__filename}`), 'validateAnswer');
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    }
};

export const create = async (req: Request, res: Response, _next: any) => {
    const _name = 'userapp.controler';
    let response: any = null;
    console.log('Componente ' + _name + ': create:  ─> ');

    try {
        const userapp = new Userapp();
        userapp.user_name_userapp = req.body.username;
        userapp.asociation_id_userapp = parseInt(req.body.asociationId);
        userapp.question_userapp = req.body.question;
        // console.log('Componente userapp.controller: create: Globals.httpResponse()  ─> ', Globals.httpResponse());

        response = await userapp.getByUsernameAndAsociationIdAndQuestion();
        if (response.message !== 'success') {
            Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'create');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        } else if (response.num_records !== 0) {
            Globals.updateResponse(400, 'User can exist', 'User can exist. Retrieve user, please', Helper.basename(`${__filename}`), 'create');
            // console.log('Componente userapp.controller: create: Globals.httpResponse()  ─> ', Globals.httpResponse());
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }

        userapp.answer_userapp = req.body.key;

        if (parseInt(req.body.asociationId) > 0) {
            const asoc = new Asoc();
            asoc.id_asociation = parseInt(req.body.asociationId);

            response = await asoc.getAsociationById();
            if (response.message !== 'success') {
                Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'create');
                return res.status(Globals.getStatus()).json(Globals.httpResponse());
            } else if (response.num_records === 0) {
                Globals.updateResponse(
                    400,
                    'The asociation selected not exist',
                    'The asociation selected not exist.',
                    Helper.basename(`${__filename}`),
                    'create'
                );
                return res.status(Globals.getStatus()).json(Globals.httpResponse());
            } else if (response.num_records > 1) {
                Globals.updateResponse(
                    400,
                    'Duplicate asociation selected',
                    'Duplicate asociation selected.',
                    Helper.basename(`${__filename}`),
                    'create'
                );
                return res.status(Globals.getStatus()).json(Globals.httpResponse());
            }
        } else {
            Globals.updateResponse(
                400,
                'There is not asociation selected',
                'There is not asociation selected.',
                Helper.basename(`${__filename}`),
                'create'
            );
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }

        userapp.asociation_id_userapp = parseInt(req.body.asociationId);
        userapp.user_name_userapp = req.body.username;
        userapp.question_userapp = req.body.question;
        userapp.answer_userapp = req.body.key;
        userapp.avatar_userapp = '';
        userapp.phone_userapp = '';

        console.log('create --->');
        response = await userapp.createUserapp();
        // console.log('Componente ' + _name + ': create: response  ─> ', response);
        if (response.message !== 'success') {
            Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'create');
            // console.log('Componente ' + _name + ': create: Globals.httpResponse()  ─> ', Globals.httpResponse());
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
            // return res.status(response.status).json({ message: response.error });
        }

        userapp.id_userapp = response.records.id;
        response = await userapp.getDataUserappById();
        if (response.message === 'success') {
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        } else {
            Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'create');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }
    } catch (error: any) {
        console.log('Componente user.controller: create: error ─> ', error);
        Globals.updateResponse(500, error, 'Something goes wrong: ', Helper.basename(`${__filename}`), 'create');
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    }
};

export const update = async (req: Request, res: Response, _next: any) => {
    const _name = 'user.controler';
    let response: any = null;
    console.log('Componente ' + _name + ': update:  ─> ');
    try {
        const auth = new Auth();
        auth.id_user = req.body.user;

        response = await auth.getDataUserById();
        if (response.message !== 'success') {
            Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'update');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        } else if (response.num_records !== 1) {
            Globals.updateResponse(400, 'Non unique record', 'User/password not match', Helper.basename(`${__filename}`), 'update');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        } else if (auth.token_user !== req.body.token) {
            Globals.updateResponse(400, 'Token not match', 'Token not match', Helper.basename(`${__filename}`), 'update');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }

        const user = new User();
        user.id_user = req.body.id_user;

        response = await user.getDataUserById();
        if (response.message !== 'success') {
            Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'update');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        } else if (response.num_records !== 1) {
            Globals.updateResponse(400, 'Non unique record', 'User/password not match', Helper.basename(`${__filename}`), 'update');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        } else if (user.date_updated_user !== req.body.date_updated_user) {
            Globals.updateResponse(
                400,
                'Record modified by another user',
                'Record modified by another user. Refresh it, please. Logout and login again.',
                Helper.basename(`${__filename}`),
                'update'
            );
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }

        user.id_user = req.body.id_user;
        user.id_asociation_user = req.body.id_asociation_user;
        user.user_name_user = req.body.user_name_user;
        user.name_user = req.body.name_user;
        user.last_name_user = req.body.last_name_user;
        user.profile_user = req.body.profile_user;
        user.status_user = req.body.status_user;
        user.phone_user = req.body.phone_user;
        user.date_updated_user = req.body.date_updated_user;

        if (auth.profile_user === 'superadmin') {
            // power
        } else if (auth.profile_user === 'admin' && auth.id_asociation_user === req.body.id_asociation_user) {
            if (user.profile_user === 'superadmin') {
                user.profile_user = 'asociado';
            }
        } else {
            Globals.updateResponse(
                400,
                'User not authorized to create user',
                'User not authorized to create user.',
                Helper.basename(`${__filename}`),
                'update'
            );
            return true;
        }

        response = await user.updateUser();
        if (response.message !== 'success') {
            Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'update');
            // console.log('Componente ' + _name + ': update: Globals.httpResponse()  ─> ', Globals.httpResponse());
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
            // return res.status(response.status).json({ message: response.error });
        } else if (response.num_records !== 1) {
            Globals.updateResponse(400, 'Non unique record', 'User not match', Helper.basename(`${__filename}`), 'update');
            // console.log('Componente ' + _name + ': update: Globals.httpResponse()  ─> ', Globals.httpResponse());
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
            // return res.status(response.status).json({ message: response.error });
        }

        let dataUser = {};
        response = await user.getDataUserById();
        if (response.message === 'success') {
            dataUser = response.records[0];
        } else {
            Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'update');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }

        let dataAsoc = {};

        if (user.id_asociation_user > 0) {
            const asoc = new Asoc();
            asoc.id_asociation = user.id_asociation_user;

            response = await asoc.getAsociationById();
            if (response.message !== 'success') {
                Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'update');
                return res.status(Globals.getStatus()).json(Globals.httpResponse());
            }
            dataAsoc = response.records[0];
        } else if (user.profile_user !== 'superadmin') {
            Globals.updateResponse(
                400,
                'Missing asociation',
                'Missing asociation. Please, contact with the association manager.',
                Helper.basename(`${__filename}`),
                'update'
            );
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }

        const result = { data_user: dataUser, data_asoc: dataAsoc };
        Globals.updateResponse(200, '', 'ok', Helper.basename(`${__filename}`), 'update', result);

        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    } catch (error: any) {
        console.log('Componente user.controller: update: error ─> ', error);
        Globals.updateResponse(500, error, 'Something goes wrong: ', Helper.basename(`${__filename}`), 'update');
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    }
};

export const deleteUser = async (req: Request, res: Response, _next: any) => {
    let response: any = null;
    const data = req.params;
    //{ id_user, date_updated_user }
    const id_auth = req.body.user;

    try {
        const auth = new Auth();
        auth.id_user = id_auth;

        response = await auth.getDataUserById();
        if (response.message !== 'success') {
            Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'remove');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        } else if (response.num_records !== 1) {
            Globals.updateResponse(400, 'Non unique record', 'User/password not match', Helper.basename(`${__filename}`), 'remove');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        } else if (auth.token_user !== req.body.token) {
            Globals.updateResponse(400, 'Token not match', 'Token not match', Helper.basename(`${__filename}`), 'remove');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }

        const user = new User();
        user.id_user = parseInt(data.id_user);

        response = await user.getDataUserById();
        if (response.message !== 'success') {
            Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'remove');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        } else if (response.num_records !== 1) {
            Globals.updateResponse(400, 'Non unique record', 'User/password not match', Helper.basename(`${__filename}`), 'remove');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        } else if (user.date_updated_user !== data.date_updated_user) {
            Globals.updateResponse(
                400,
                'Record modified by another user',
                'Record modified by another user. Refresh it, please. Logout and login again.',
                Helper.basename(`${__filename}`),
                'remove'
            );
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }

        if (auth.profile_user === 'superadmin') {
            // power
        } else if (auth.profile_user === 'admin' && auth.id_asociation_user === user.id_asociation_user) {
            // partial power
        } else {
            Globals.updateResponse(
                400,
                'User not authorized to delete user',
                'User not authorized to delete user.',
                Helper.basename(`${__filename}`),
                'remove'
            );
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }

        const now = Math.round(new Date().getTime() / 1000);
        if (user.token_user !== '' && user.token_exp_user > now) {
            Globals.updateResponse(
                400,
                'User to delete has an active session',
                'User to delete has an active session',
                Helper.basename(`${__filename}`),
                'remove'
            );
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }

        if (user.avatar_user !== '') {
            const upPos = user.avatar_user.indexOf('avatars');
            console.log(upPos);
            if (upPos > -1) {
                const restUrl = user.avatar_user.substring(upPos);
                const dir = path.join(path.resolve('uploads'), restUrl);
                const absolutePath = path.dirname(dir);
                if (fs.existsSync(absolutePath)) {
                    console.log('delete: ', absolutePath);
                    fs.rmSync(absolutePath, { recursive: true, force: true });
                    // fs.emptyDirSync(absolutePath);
                }
            }
        }

        response = await user.deleteUser();
        if (response.message !== 'success') {
            Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'remove');
            // console.log('Componente ' + _name + ': remove: Globals.httpResponse()  ─> ', Globals.httpResponse());
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
            // return res.status(response.status).json({ message: response.error });
        } else if (response.num_records !== 1) {
            Globals.updateResponse(400, 'Non unique record', 'User not match', Helper.basename(`${__filename}`), 'remove');
            // console.log('Componente ' + _name + ': remove: Globals.httpResponse()  ─> ', Globals.httpResponse());
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
            // return res.status(response.status).json({ message: response.error });
        }

        return res.status(200).json(Globals.httpResponse());
    } catch (error: any) {
        console.log('Componente user.controller: remove: error ─> ', error);
        Globals.updateResponse(500, error, 'Something goes wrong: ', Helper.basename(`${__filename}`), 'remove');
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    }
};
