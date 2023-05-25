import express from 'express';
import cors from 'cors';
import { router } from './routes/index.routes';
import bodyParser from 'body-parser';
import { PORT } from './config/config';
import logger from 'morgan';
import path from 'path';

const port = PORT;
// import cookieParser from 'cookie-parser';

const app = express();

// setting up the enviroment
app.set('port', port);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(express.json());
// app.use(cookieParser());

// middlewares
app.use(logger('dev'));

// public folders
app.use('/uploads', express.static(path.resolve('uploads')));
app.use('/assets', express.static(path.resolve('assets')));

// routes
app.use(router);

// console.log('date 👉️', Helper.getDateTime('YYYY-MM-DD HH:MM:SS.MMM'));

export default app;
