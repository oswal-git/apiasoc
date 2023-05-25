import { NextFunction, Request, Response } from 'express';
import Asoc from '../models/asoc';
import Auth from '../models/auth';
import User from '../models/user';
import Globals from '../utils/globals';
import Helper from '../utils/helper';
import path from 'path';
import fs from 'fs-extra';
import { PREFIX_LOGO } from '../config/config';

const _name = 'asoc.controler';

export const listAll = async (req: Request, res: Response, _next: any) => {
    let response: any = null;
    console.log('Componente ' + _name + ': :  ─> ');
    console.log('Componente ' + _name + ': listAll: time ─> ', Helper.calcLapse());

    try {
        const auth = new Auth();
        if (req.body.tokenValidate !== 'lack') {
            auth.id_user = req.body.user;
            response = await auth.getDataUserById();
            if (response.message !== 'success') {
                Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'listAll');
                return res.status(Globals.getStatus()).json(Globals.httpResponse());
            } else if (response.num_records !== 1) {
                Globals.updateResponse(400, 'Non unique record', 'User/password not match', Helper.basename(`${__filename}`), 'listAll');
                return res.status(Globals.getStatus()).json(Globals.httpResponse());
            } else if (auth.token_user !== req.body.token) {
                Globals.updateResponse(400, 'Token not match', 'Token not match', Helper.basename(`${__filename}`), 'listAll');
                return res.status(Globals.getStatus()).json(Globals.httpResponse());
            }
        }

        let id_asociation_user = 0;
        if (req.body.id_asociation_user) {
            id_asociation_user = parseInt(req.body.id_asociation_user);
        } else {
            id_asociation_user = auth.id_asociation_user;
        }

        const asoc = new Asoc();
        if (auth.profile_user === 'superadmin') {
            response = await asoc.getAllAsociations();
            console.log('listAll');
            if (response.message === 'success') {
                return res.status(Globals.getStatus()).json(Globals.httpResponse());
            } else {
                Globals.updateResponse(response.status, response.error, response.error, Helper.basename(`${__filename}`), 'listAll');
                return res.status(Globals.getStatus()).json(Globals.httpResponse());
                // return res.status(response.status).json({ message: response.error });
            }
        } else if (auth.profile_user === 'admin' && auth.id_asociation_user === id_asociation_user) {
            asoc.id_asociation = auth.id_asociation_user;
            response = await asoc.getAsociationById();
            console.log('listAll by asociation');
            if (response.message === 'success') {
                return res.status(Globals.getStatus()).json(Globals.httpResponse());
            } else {
                Globals.updateResponse(response.status, response.error, response.error, Helper.basename(`${__filename}`), 'listAll');
                return res.status(Globals.getStatus()).json(Globals.httpResponse());
                // return res.status(response.status).json({ message: response.error });
            }
        } else {
            response = await asoc.getListAsociations();
            console.log('listAll asociations');
            console.log('Componente asoc.controller: listAll: time ─> ', Helper.calcLapse());
            if (response.message === 'success') {
                return res.status(Globals.getStatus()).json(Globals.httpResponse());
            } else {
                Globals.updateResponse(response.status, response.error, response.error, Helper.basename(`${__filename}`), 'listAll');
                return res.status(Globals.getStatus()).json(Globals.httpResponse());
                // return res.status(response.status).json({ message: response.error });
            }
        }
    } catch (error: any) {
        console.log('Componente asoc.controller: listAll: error ─> ', error);
        Globals.updateResponse(500, error, 'Something goes wrong: ', Helper.basename(`${__filename}`), 'listAll');
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    }
};

export const create = async (req: Request, res: Response, _next: any) => {
    let response: any = null;
    try {
        const auth = new Auth();
        auth.id_user = req.body.user;

        response = await auth.getDataUserById();
        if (response.message !== 'success') {
            Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'create');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        } else if (response.num_records !== 1) {
            Globals.updateResponse(400, 'Non unique record', 'User/password not match', Helper.basename(`${__filename}`), 'create');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        } else if (auth.token_user !== req.body.token) {
            Globals.updateResponse(400, 'Token not match', 'Token not match', Helper.basename(`${__filename}`), 'create');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }

        if (auth.profile_user === 'superadmin') {
            // power
        } else {
            Globals.updateResponse(
                400,
                'User not authorized to create Asociation',
                'User not authorized to create Asociation.',
                Helper.basename(`${__filename}`),
                'create'
            );
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }

        const asoc = new Asoc();
        asoc.email_asociation = req.body.email_asociation;
        const checkUser: boolean = await asoc.findAsociationByEmail();
        if (checkUser) {
            Globals.updateResponse(
                400,
                'There is already an asociation with this email',
                'There is already an asociation with this email.',
                Helper.basename(`${__filename}`),
                'create'
            );
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }

        asoc.long_name_asociation = req.body.long_name_asociation;
        asoc.short_name_asociation = req.body.short_name_asociation;
        asoc.email_asociation = req.body.email_asociation;
        asoc.name_contact_asociation = req.body.name_contact_asociation;
        asoc.phone_asociation = req.body.phone_asociation;

        response = await asoc.createAsociation();
        // console.log('Componente ' + _name + ': create: response  ─> ', response);
        if (response.message !== 'success') {
            Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'create');
            // console.log('Componente ' + _name + ': create: Globals.httpResponse()  ─> ', Globals.httpResponse());
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
            // return res.status(response.status).json({ message: response.error });
        }

        asoc.id_asociation = response.records.id;

        response = await asoc.getAsociationById();
        if (response.message !== 'success') {
            Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'create');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }

        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    } catch (error: any) {
        console.log('Componente asoc.controller: create: error ─> ', error);
        Globals.updateResponse(500, error, 'Something goes wrong: ', Helper.basename(`${__filename}`), 'create');
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    }
};

export const update = async (req: Request, res: Response, _next: any) => {
    let response: any = null;
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

        const asoc = new Asoc();
        asoc.id_asociation = req.body.id_asociation;
        if (auth.profile_user === 'superadmin') {
            // power
        } else if (auth.profile_user === 'admin' && auth.id_asociation_user === asoc.id_asociation) {
            // less power by can
        } else {
            Globals.updateResponse(
                400,
                'User not authorized to update Asociation',
                'User not authorized to update Asociation.',
                Helper.basename(`${__filename}`),
                'update'
            );
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }

        response = await asoc.getAsociationById();
        if (response.message !== 'success') {
            Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'update');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        } else if (response.num_records !== 1) {
            Globals.updateResponse(400, 'Non unique record', 'User/password not match', Helper.basename(`${__filename}`), 'update');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        } else if (asoc.date_updated_asociation !== req.body.date_updated_asociation) {
            Globals.updateResponse(
                400,
                'Record modified by another user',
                'Record modified by another user. Refresh it, please. Logout and login again.',
                Helper.basename(`${__filename}`),
                'update'
            );
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }

        asoc.id_asociation = req.body.id_asociation;
        asoc.long_name_asociation = req.body.long_name_asociation;
        asoc.short_name_asociation = req.body.short_name_asociation;
        asoc.email_asociation = req.body.email_asociation;
        asoc.name_contact_asociation = req.body.name_contact_asociation;
        asoc.phone_asociation = req.body.phone_asociation;
        asoc.date_updated_asociation = req.body.date_updated_asociation;

        response = await asoc.updateAsociation();
        if (response.message !== 'success') {
            Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'update');
            // console.log('Componente ' + _name + ': update: Globals.httpResponse()  ─> ', Globals.httpResponse());
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
            // return res.status(response.status).json({ message: response.error });
        } else if (response.num_records !== 1) {
            Globals.updateResponse(400, 'Non unique record', 'Asociation not match', Helper.basename(`${__filename}`), 'update');
            // console.log('Componente ' + _name + ': update: Globals.httpResponse()  ─> ', Globals.httpResponse());
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
            // return res.status(response.status).json({ message: response.error });
        }

        response = await asoc.getAsociationById();
        if (response.message !== 'success') {
            Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'update');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        } else if (response.num_records !== 1) {
            Globals.updateResponse(400, 'Non unique record', 'User/password not match', Helper.basename(`${__filename}`), 'update');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }

        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    } catch (error: any) {
        console.log('Componente asoc.controller: update: error ─> ', error);
        Globals.updateResponse(500, error, 'Something goes wrong: ', Helper.basename(`${__filename}`), 'update');
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    }
};

export const deleteAsociation = async (req: Request, res: Response, _next: any) => {
    let response: any = null;
    const data = req.params;
    //{ id_asociation, date_updated_asociation }
    const id_auth = req.body.user;

    try {
        const auth = new Auth();
        auth.id_user = id_auth;

        response = await auth.getDataUserById();
        if (response.message !== 'success') {
            Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'deleteAsociation');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        } else if (response.num_records !== 1) {
            Globals.updateResponse(400, 'Non unique record', 'User/password not match', Helper.basename(`${__filename}`), 'deleteAsociation');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        } else if (auth.token_user !== req.body.token) {
            Globals.updateResponse(400, 'Token not match', 'Token not match', Helper.basename(`${__filename}`), 'deleteAsociation');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }

        if (auth.profile_user === 'superadmin') {
            // power
        } else {
            Globals.updateResponse(
                400,
                'User not authorized to delete asociation',
                'User not authorized to delete asociation.',
                Helper.basename(`${__filename}`),
                'deleteAsociation'
            );
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }

        const user = new User();
        user.id_asociation_user = parseInt(data.id_asociation);
        response = await user.getAllByIdAsociations();
        console.log('getAllByIdAsociations');
        if (response.message !== 'success') {
            Globals.updateResponse(response.status, response.error, response.error, Helper.basename(`${__filename}`), 'deleteAsociation');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        } else if (response.num_records !== 0) {
            Globals.updateResponse(
                400,
                'There are users of this asociation',
                'There are users of this asociation',
                Helper.basename(`${__filename}`),
                'deleteAsociation'
            );
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }

        const asoc = new Asoc();
        asoc.id_asociation = parseInt(data.id_asociation);
        response = await asoc.getAsociationById();
        if (response.message !== 'success') {
            Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'deleteAsociation');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        } else if (response.num_records !== 1) {
            Globals.updateResponse(400, 'Non unique record', 'User/password not match', Helper.basename(`${__filename}`), 'deleteAsociation');
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        } else if (asoc.date_updated_asociation !== data.date_updated_asociation) {
            Globals.updateResponse(
                400,
                'Record modified by another user',
                'Record modified by another user. Refresh it, please. Logout and login again.',
                Helper.basename(`${__filename}`),
                'deleteAsociation'
            );
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
        }

        const dir = path.join(path.resolve('uploads'), PREFIX_LOGO + data.id_asociation);
        console.log('Componente ' + _name + ': deleteAsociation: dir ─> ', dir);

        if (fs.existsSync(dir)) {
            // fs.emptyDirSync(dir);
            fs.rmSync(dir, { recursive: true, force: true });
        }

        response = await asoc.deleteAsociation();
        if (response.message !== 'success') {
            Globals.updateResponse(response.status, response.message, response.message, Helper.basename(`${__filename}`), 'deleteAsociation');
            // console.log('Componente ' + _name + ': deleteAsociation: Globals.httpResponse()  ─> ', Globals.httpResponse());
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
            // return res.status(response.status).json({ message: response.error });
        } else if (response.num_records !== 1) {
            Globals.updateResponse(400, 'Non unique record', 'Asociation not match', Helper.basename(`${__filename}`), 'deleteAsociation');
            // console.log('Componente ' + _name + ': deleteAsociation: Globals.httpResponse()  ─> ', Globals.httpResponse());
            return res.status(Globals.getStatus()).json(Globals.httpResponse());
            // return res.status(response.status).json({ message: response.error });
        }

        return res.status(200).json(Globals.httpResponse());
    } catch (error: any) {
        console.log('Componente ' + _name + ': deleteAsociation: error ─> ', error);
        Globals.updateResponse(500, error, 'Something goes wrong: ', Helper.basename(`${__filename}`), 'deleteAsociation');
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    }
};
