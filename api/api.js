import express from 'express';
import mongoose from 'mongoose';
import debug from 'debug';
import { Player, Goalie } from './data.js';
import { to60 } from './utils/Converter.js';
import { calcRanks } from './utils/Calculator.js';

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
    const players = (await Player.find()).map(p => { return {id: p.id, name: p.name} });
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(players));
});

apiRouter.get('/player/ranks/:id', async (req, res) => {
    const players = await Player.find();
    players.forEach(p => {
        p.seasonRates = [];
        p.seasons.forEach(s => {
            p.seasonRates.push(to60(s));
        });
    });
    const player = (await Player.find({'id': req.params.id}))[0];
    if(!player) return res.status(404).send('Player not found.');
    let result = {
        id: player.id,
        name: player.name,
        position: player.position,
        draft_year: player.draft_year,
        draft_round: player.draft_round,
        draft_overall: player.draft_overall,
        shoots: player.shoots,
        birthday: player.birthday,
        seasonRanks: []
    };
    player.seasons.forEach(s => {
        result.seasonRanks.push(calcRanks(players, to60(s), player.name, player.position));
    });
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(result));
});

apiRouter.get('/goalies', async (req, res) =>{
    const goalies = (await Goalie.find()).map(p => { return {id: p.id, name: p.name} });
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(goalies));
});

apiRouter.get('/years', async (req, res) =>{
    const years = await Player.distinct('seasons.year');
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(years));
});

export default apiRouter;