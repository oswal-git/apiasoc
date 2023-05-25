import { NextFunction, Response, Request } from 'express';
import { RequestExt } from '../interfaces/req-ext';
import Auth from '../models/auth';
import Globals from '../utils/globals';
import Helper from '../utils/helper';

const name = 'sessions';
const checkJwt = async (req: Request, res: Response, next: NextFunction) => {
    Helper.initTime();
    req.body.user = 0;
    req.body.token = '';
    try {
        const jwtByUser = req.headers.authorization || '';
        const jwt = jwtByUser.split(' ').pop(); // 11111
        console.log('Componente ' + name + ': checkJwt: jwt ─> ', jwt);
        console.log('Componente ' + name + ': checkJwt: time ─> ', Helper.calcLapse());
        if (jwt === undefined || jwt === '') {
            Globals.updateResponse(400, 'Empty token', 'Empty token', Helper.basename(`{__filename}`), 'checkJwt');
            // return res.status(Globals.getStatus()).json(Globals.httpResponse());
            req.body.token = '';
            req.body.tokenValidate = 'lack';
            req.body.tokenValidateMsg = 'Token not found in request';
            req.body.user = 0;
            Globals.dataApiRequest = { ...Globals.dataApiRequest, ...req.body };
            // console.log('checkJwt: Globals.apiRequest -> ', Globals.apiRequest);
            Helper.writeDebug('checkJwt: Globals.apiRequest -> ', Globals.apiRequest);
            next();
        } else {
            const auth = new Auth();
            const validate: any = await auth.validateTokenJwt(jwt);

            if (validate.verify) {
                if (validate.verify === 'expired') {
                    // console.log('token_exp_user validate expired: -------------> ', validate.payload.data.id_user);
                    console.log('token_exp_user validate expired: -------------> ', validate.payload.data.id_user);
                    req.body.token = jwt;
                    req.body.tokenValidate = 'expired';
                    req.body.tokenValidateMsg = 'Expired token';
                    req.body.user = validate.payload.data.id_user;
                    req.body.exp = validate.payload.exp;
                } else {
                    // console.log('token_exp_user validate: -------------> ', validate.payload.data.id_user);
                    req.body.token = jwt;
                    req.body.tokenValidate = 'valid';
                    req.body.tokenValidateMsg = 'Valid token';
                    req.body.user = validate.payload.data.id_user;
                    req.body.exp = validate.payload.exp;
                }
                Globals.dataApiRequest = { ...Globals.dataApiRequest, ...req.body };
                Helper.writeDebug('checkJwt: Globals.apiRequest -> ', Globals.apiRequest);
                // console.log('checkJwt: Globals.apiRequest -> ', Globals.apiRequest);
                next();
            } else {
                // console.log('token_exp_user !validate.verify: -------------> ', validate);
                Globals.updateResponse(400, 'Invalid token', 'Token not was able', Helper.basename(`${__filename}`), 'checkJwt');
                return res.status(Globals.getStatus()).json(Globals.httpResponse());
            }
        }
    } catch (e: any) {
        console.log({ e });
        Globals.updateResponse(400, e.message, 'SESSION_NO_VALID', Helper.basename(`${__filename}`), 'checkJwt');
        return res.status(Globals.getStatus()).json(Globals.httpResponse());
    }
};

export { checkJwt };
