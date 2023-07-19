import express from 'express';
import mongoose from 'mongoose';
import debug from 'debug';
import { Player, Goalie } from './data.js';

const apiRouter = express.Router();

const dbLogger = debug('app:database');

export function connectDatabase() {
    return new Promise((resolve, reject) => {
        const success = () => { 
            dbLogger('Connected to database...');
            resolve();
        };
        const error = (err) => {
            dbLogger(`Error connecting to database: ${err}`);
            reject(err);
        };
        mongoose.connect(process.env['DATABASE_URL'])
            .then(() => success())
            .catch(err => error(err));
    });
}

apiRouter.get('/players', async (req, res) =>{
    const players = await Player.find();
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(players));
});

apiRouter.get('/goalies', async (req, res) =>{
    const goalies = await Goalie.find();
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(goalies));
});

apiRouter.get('/years', async (req, res) =>{
    const years = await Player.distinct('seasons.year');
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(years));
});

export default apiRouter;