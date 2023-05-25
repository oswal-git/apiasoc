import { NextFunction, Request, Response } from 'express';
import Globals from '../utils/globals';
import Helper from '../utils/helper';

const genLogMiddleware = (req: Request, _res: Response, next: NextFunction) => {
    Helper.count = 0;
    Helper.key = '';

    Globals.apiRequest = {
        remote_addr: req.socket.remoteAddress || '',
        protocol: req.protocol,
        originalUrl: req.originalUrl,
        host: req.get('host') || '',
        request_uri: req.protocol + '://' + req.get('host') + req.originalUrl,
        date: Helper.getDateTime('YYYY-MM-DD HH:MM:SS'),
        data: { ...req.body, ...req.params, ...req.query },
    };
    // const header = req.headers;
    // const userAgent = header['user-agent'];
    Helper.writeDebug('genLogMiddleware: Globals.apiRequest -> ', Globals.apiRequest);
    // console.log('genLogMiddleware: Globals.apiRequest -> ', Globals.apiRequest);
    // console.log('genLogMiddleware: Globals.apiRequest -> ', Globals.apiRequest);
    // console.log('genLogMiddleware: header -> ', header);
    // console.log('genLogMiddleware: userAgent -> ', userAgent);
    // console.log('req.headers.authorization: ', req.headers.authorization);
    // console.log('genLogMiddleware: ', req.body);
    next();
};

export { genLogMiddleware };
