import fs from 'fs';
import csv from 'csv-parser';
import mongoose from 'mongoose';
import { player as PlayerModel, goalie as GoalieModel } from './models.js';
import debug from 'debug';

const dbLogger = debug('app:database');

const STD_SKATER = './data/STD_SKATER.csv';
const STD_GOALIE = './data/STD_GOALIE.csv';
const GAR = './data/GAR.csv';
const GOALIE = './data/GOALIE.csv';
const QOC = './data/QOC.csv';
const QOT = './data/QOT.csv';
const SHOOT = './data/SHOOT.csv';
const xGAR = './data/xGAR.csv';

var skaterSeasons = [];
var goalieSeasons = [];
var gar = [];
var goalie = [];
var qoc = [];
var qot = [];
var shoot = [];
var xgar = [];

export const Player = mongoose.model('Players', new mongoose.Schema(PlayerModel));
export const Goalie = mongoose.model('Goalies', new mongoose.Schema(GoalieModel));

export async function cacheData() {
    dbLogger('Caching data...');
    var players = [];
    var goalies = [];
    await csvToObj(STD_SKATER).then((data) => skaterSeasons = data);
    await csvToObj(STD_GOALIE).then((data) => goalieSeasons = data);
    await csvToObj(GAR).then((data) => gar = data);
    await csvToObj(GOALIE).then((data) => goalie = data);
    await csvToObj(QOC).then((data) => qoc = data);
    await csvToObj(QOT).then((data) => qot = data);
    await csvToObj(SHOOT).then((data) => shoot = data);
    await csvToObj(xGAR).then((data) => xgar = data);
    skaterSeasons.forEach(season => {
        Object.assign(season, findSeason(gar, season));
        Object.assign(season, findSeason(xgar, season));
    });
    goalieSeasons.forEach(season => {
        Object.assign(season, findSeason(goalie, season));
    });
    skaterSeasons.forEach(season => {
        var player = players.find(player => player.id == season['API ID']);
        if (player && player.seasons.find(s => s.year === season['Season'])) {
           for(let i = 0; i < player.seasons.length; i++) {
               if(player.seasons[i].year === season['Season']) {
                   player.seasons[i] = mergeSktSzn(player.seasons[i], season);
               }
           }
        } else if (player) {
            player.seasons.push(parseSktSzn(season));
        } else {
            player = {
                name: season['Player'],
                id: parseInt(season['API ID']),
                seasons: [parseSktSzn(season)],
                position: season['Position'],
                shoots: season['Shoots'],
                birthday: season['Birthday'],
                draft_year: isNaN(season['Draft Yr']) ? -1 : parseInt(season['Draft Yr']),
                draft_round: isNaN(season['Draft Rd']) ? -1 : parseInt(season['Draft Rd']),
                draft_overall: isNaN(season['Draft Ov']) ? -1 : parseInt(season['Draft Ov']),
            };
            players.push(player);
        }
    });
    goalieSeasons.forEach(season => {
        var goalie = goalies.find(goalie => goalie.id == season['API ID']);
        if (goalie) {
            goalie.seasons.push(parseGoalSzn(season));
        } else {
            goalie = {
                name: season['Player'],
                id: parseInt(season['API ID']),
                seasons: [parseGoalSzn(season)],
                position: season['Position'],
                shoots: season['Catches'],
                birthday: season['Birthday'],
                draft_year: isNaN(season['Draft Yr']) ? -1 : parseInt(season['Draft Yr']),
                draft_round: isNaN(season['Draft Rd']) ? -1 : parseInt(season['Draft Rd']),
                draft_overall: isNaN(season['Draft Ov']) ? -1 : parseInt(season['Draft Ov']),
            }
            goalies.push(goalie);
        }
    });
    players.forEach(p => {
        const newPlayer = new Player(p);
        newPlayer.save();
    });
    goalies.forEach(g => {
        const newGoalie = new Goalie(g);
        newGoalie.save();
    });
    dbLogger('Data cached.');
}

async function csvToObj(file) {
    return new Promise((resolve) => {
        var lines = [];
        const end = (error) => {
            if (error) {
                console.error(error);
                resolve([]);
            } else {
                resolve(lines);
            }
        }
        fs.createReadStream(file).pipe(csv()).on('data', (data) => lines.push(data)).on('end', end);
    });
}

function findSeason(obj, season) {
    return obj.find(szn => szn['API ID'] === season['API ID'] &&  szn['Season'] === season['Season'] && szn['Team'] === season['Team']);
}

function findTotSeason(obj, season) {
    return obj.find(szn => szn['API ID'] === season['API ID'] &&  szn['Season'] === season['Season']);
}

function parseSktSzn(szn) {
    var season = {
        year: szn['Season'],
        team: szn['Team'],
        age: parseInt(szn['Age']),
        gp: parseInt(szn['GP']),
        toi_all: parseFloat(szn['TOI']),
        toi_ev: parseFloat(szn['TOI_EV']),
        toi_pp: parseFloat(szn['TOI_PP']), 
        toi_sh: parseFloat(szn['TOI_SH']),
        evo_gar: parseFloat(szn['EVO_GAR']),
        xevo_gar: parseFloat(szn['xEVO_GAR']),
        evd_gar: parseFloat(szn['EVD_GAR']),
        xevd_gar: parseFloat(szn['xEVD_GAR']),
        ppo_gar: parseFloat(szn['PPO_GAR']),
        xppo_gar: parseFloat(szn['xPPO_GAR']),
        shd_gar: parseFloat(szn['SHD_GAR']),
        xshd_gar: parseFloat(szn['xSHD_GAR']),
        off_gar: parseFloat(szn['Off_GAR']),
        xoff_gar: parseFloat(szn['xOff_GAR']),
        def_gar: parseFloat(szn['Def_GAR']),
        xdef_gar: parseFloat(szn['xDef_GAR']),
        pen_gar: parseFloat(szn['Pens_GAR']),
        tot_gar: parseFloat(szn['GAR']),
        xtot_gar: parseFloat(szn['xGAR']),
        qoc: parseFloat(findSeason(qoc, szn)['TOI%']),
        qot: parseFloat(findSeason(qot, szn)['TOI%']),
        shoot: parseFloat(findTotSeason(shoot, szn)['All_Sh%']),
        goals: parseInt(szn['G']),
        primary_assists: parseInt(szn['A1']),
        secondary_assists: parseInt(szn['A2']),
        points: parseInt(szn['Points']),
        fow: parseInt(szn['FOW']),
        fol: parseInt(szn['FOL']),
    }
    return season;
}

function parseGoalSzn(szn) {
    var season = {
        year: szn['Season'],
        team: szn['Team'],
        age: parseInt(szn['Age']),
        gp: parseInt(szn['GP']),
        toi_all: parseFloat(szn['TOI']),
        tot_gar: parseFloat(szn['GAR']),
        sv_pct: parseFloat(szn['Sv%']),
        gsax: parseFloat(szn['GSAx']),
    }
    return season;
}

function mergeSktSzn(oldSzn, newSzn) {
    var season = {
        year: oldSzn.year,
        team: oldSzn.team + '/' + newSzn['Team'],
        age: oldSzn.age,
        gp: oldSzn.gp + parseInt(newSzn['GP']),
        toi_all: rnd2(oldSzn.toi_all + parseFloat(newSzn['TOI'])),
        toi_ev: rnd(oldSzn.toi_ev + parseFloat(newSzn['TOI_EV'])),
        toi_pp: rnd(oldSzn.toi_pp + parseFloat(newSzn['TOI_PP'])), 
        toi_sh: rnd(oldSzn.toi_sh + parseFloat(newSzn['TOI_SH'])),
        evo_gar: rnd(oldSzn.evo_gar + parseFloat(newSzn['EVO_GAR'])),
        xevo_gar: rnd(oldSzn.xevo_gar + parseFloat(newSzn['xEVO_GAR'])),
        evd_gar: rnd(oldSzn.evd_gar + parseFloat(newSzn['EVD_GAR'])),
        xevd_gar: rnd(oldSzn.xevd_gar + parseFloat(newSzn['xEVD_GAR'])),
        ppo_gar: rnd(oldSzn.ppo_gar + parseFloat(newSzn['PPO_GAR'])),
        xppo_gar: rnd(oldSzn.xppo_gar + parseFloat(newSzn['xPPO_GAR'])),
        shd_gar: rnd(oldSzn.shd_gar + parseFloat(newSzn['SHD_GAR'])),
        xshd_gar: rnd(oldSzn.xshd_gar + parseFloat(newSzn['xSHD_GAR'])),
        off_gar: rnd(oldSzn.off_gar + parseFloat(newSzn['Off_GAR'])),
        xoff_gar: rnd(oldSzn.xoff_gar + parseFloat(newSzn['xOff_GAR'])),
        def_gar: rnd(oldSzn.def_gar + parseFloat(newSzn['Def_GAR'])),
        xdef_gar: rnd(oldSzn.xdef_gar + parseFloat(newSzn['xDef_GAR'])),
        pen_gar: rnd(oldSzn.pen_gar + parseFloat(newSzn['Pens_GAR'])),
        tot_gar: rnd(oldSzn.tot_gar + parseFloat(newSzn['GAR'])),
        xtot_gar: rnd(oldSzn.xtot_gar + parseFloat(newSzn['xGAR'])),
        qoc: rnd2((oldSzn.qoc*oldSzn.toi_ev + parseFloat(findSeason(qoc, newSzn)['TOI%'])*parseFloat(newSzn['TOI_EV']))/(oldSzn.toi_ev + parseFloat(newSzn['TOI_EV']))),
        qot: rnd2((oldSzn.qot*oldSzn.toi_ev + parseFloat(findSeason(qot, newSzn)['TOI%'])*parseFloat(newSzn['TOI_EV']))/(oldSzn.toi_ev + parseFloat(newSzn['TOI_EV']))),
        shoot: oldSzn.shoot,
        goals: oldSzn.goals + parseInt(newSzn['G']),
        primary_assists: oldSzn.primary_assists + parseInt(newSzn['A1']),
        secondary_assists: oldSzn.secondary_assists + parseInt(newSzn['A2']),
        points: oldSzn.points + parseInt(newSzn['Points']),
        fow: oldSzn.fow + parseInt(newSzn['FOW']),
        fol: oldSzn.fol + parseInt(newSzn['FOL']),
    }
    return season;
}

function rnd(val) {
    return Math.round(val*10)/10;
}

function rnd2(val) {
    return Math.round(val*100)/100;
}