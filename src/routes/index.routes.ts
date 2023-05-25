import { Router, Request, Response, NextFunction } from 'express';
import { readdirSync } from 'fs';
import { genLogMiddleware } from '../middleware/genLog';

const router = Router();
const name = 'index.routes';

const PATH_ROUTER = `${__dirname}`;
// console.log('PATH_ROUTER: ', PATH_ROUTER);

const clearFilenames = (fileName: string) => {
    // const file = fileName.substring(0, fileName.length - 3);
    const file = fileName.split('.');
    // const ext = file.pop();
    // console.log('ext: ', ext);
    // return file.join('.');
    return { fileRoute: file.join('.'), route: file[0] };
};

readdirSync(PATH_ROUTER)
    .map((fileName: string) => clearFilenames(fileName))
    .filter((fileName: any) => fileName.fileRoute !== 'index.routes.ts')
    .map((fileName: any) => {
        // console.log('Componente ' + name + ': readdirSync: fileName.fileRoute ─> ', `./${fileName.fileRoute}`);
        import(`./${fileName.fileRoute}`).then((routerModule: any) => {
            // console.log('Componente ' + name + ': readdirSync: fileName.route ─> ', `/${fileName.route}`);
            // console.log('Componente ' + name + ': readdirSync: routerModule.router ─> ', routerModule.router);
            router.use(`/${fileName.route}`, genLogMiddleware, routerModule.router);
        });
    });

export { router };
