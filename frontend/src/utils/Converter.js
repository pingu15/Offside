export function to60(szn) {
  var season = {
    year: szn.year,
    team: szn.team,
    age: szn.age,
    gp: szn.gp,
    toi_all: szn.toi_all,
    toi_ev: szn.toi_ev,
    toi_pp: szn.toi_pp,
    toi_sh: szn.toi_sh,
    evo_gar: rnd((szn.evo_gar * 60) / szn.toi_ev),
    xevo_gar: rnd((szn.xevo_gar * 60) / szn.toi_ev),
    evd_gar: rnd((szn.evd_gar * 60) / szn.toi_ev),
    xevd_gar: rnd((szn.xevd_gar * 60) / szn.toi_ev),
    ppo_gar: rnd((szn.ppo_gar * 60) / szn.toi_pp),
    xppo_gar: rnd((szn.xppo_gar * 60) / szn.toi_pp),
    shd_gar: rnd((szn.shd_gar * 60) / szn.toi_sh),
    xshd_gar: rnd((szn.xshd_gar * 60) / szn.toi_sh),
    off_gar: rnd((szn.off_gar * 60) / (szn.toi_ev + szn.toi_pp)),
    xoff_gar: rnd((szn.xoff_gar * 60) / (szn.toi_ev + szn.toi_pp)),
    def_gar: rnd((szn.def_gar * 60) / (szn.toi_ev + szn.toi_sh)),
    xdef_gar: rnd((szn.xdef_gar * 60) / (szn.toi_ev + szn.toi_sh)),
    pen_gar: rnd((szn.pen_gar * 60) / szn.toi_all),
    tot_gar: rnd((szn.tot_gar * 60) / szn.toi_all),
    xtot_gar: rnd((szn.xtot_gar * 60) / szn.toi_all),
    goals: rnd((szn.goals * 60) / szn.toi_all),
    primary_assists: rnd((szn.primary_assists * 60) / szn.toi_all),
    qoc: szn.qoc,
    qot: szn.qot,
    shoot: szn.shoot,
  };
  return season;
}

function rnd(val) {
  return Math.round(val * 100) / 100;
}
