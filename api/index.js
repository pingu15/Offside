import express from 'express';
import { cacheData } from './data.js';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import debug from 'debug';
import apiRouter from './api.js';
import { connectDatabase } from './api.js';
import cors from 'cors';

const app = express();

dotenv.config();

const startLogger = debug('app:startup');
startLogger(`NODE_ENV: ${process.env['NODE_ENV']}`);

if(process.env['NODE_ENV'] === 'development') {
    app.use(morgan('tiny'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());
app.use(cors());
app.use('/api', apiRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    startLogger(`Listening on port ${port}...`);
});

connectDatabase().then(() => {
    if(process.env['CACHE_DATA'] === 'true') {
        cacheData();
    }
});