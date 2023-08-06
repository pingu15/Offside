const calcRank = (players, stat, name, szn, pos) => {
  return (
    100 -
    Math.round(
      (players
        .filter(
          (a) =>
            a.seasonRates.find((season) => season.year === szn) &&
            a.position === pos
        )
        .sort(
          (a, b) =>
            b.seasonRates.find((season) => season.year === szn)[stat] -
            a.seasonRates.find((season) => season.year === szn)[stat]
        )
        .findIndex((player) => player.name === name) /
        players.filter(
          (a) =>
            a.seasonRates.find((season) => season.year === szn) &&
            a.position === pos
        ).length) *
        100
    )
  );
};
const calcReqRank = (players, stat, name, szn, pos, reqStat, req) => {
  return (
    100 -
    Math.round(
      (players
        .filter(
          (a) =>
            a.seasonRates.find((season) => season.year === szn) &&
            a.position === pos &&
            a.seasonRates.find((season) => season.year === szn)[reqStat] >= req
        )
        .sort(
          (a, b) =>
            b.seasonRates.find((season) => season.year === szn)[stat] -
            a.seasonRates.find((season) => season.year === szn)[stat]
        )
        .findIndex((player) => player.name === name) /
        players.filter(
          (a) =>
            a.seasonRates.find((season) => season.year === szn) &&
            a.position === pos &&
            a.seasonRates.find((season) => season.year === szn)[reqStat] >= req
        ).length) *
        100
    )
  );
};
export const calcRanks = (players, szn, playerName, pos) => {
  var season = {
    year: szn.year,
    team: szn.team,
    age: szn.age,
    gp: szn.gp,
    toi_all: calcRank(players, "toi_all", playerName, szn.year, pos),
    evo_gar: calcRank(players, "evo_gar", playerName, szn.year, pos),
    xevo_gar: calcRank(players, "xevo_gar", playerName, szn.year, pos),
    evd_gar: calcRank(players, "evd_gar", playerName, szn.year, pos),
    xevd_gar: calcRank(players, "xevd_gar", playerName, szn.year, pos),
    ppo_gar:
      szn.toi_pp >= 30
        ? calcReqRank(
            players,
            "ppo_gar",
            playerName,
            szn.year,
            pos,
            "toi_pp",
            30
          )
        : -1,
    xppo_gar:
      szn.toi_pp >= 30
        ? calcReqRank(
            players,
            "xppo_gar",
            playerName,
            szn.year,
            pos,
            "toi_pp",
            30
          )
        : -1,
    shd_gar:
      szn.toi_sh >= 30
        ? calcReqRank(
            players,
            "shd_gar",
            playerName,
            szn.year,
            pos,
            "toi_sh",
            30
          )
        : -1,
    xshd_gar:
      szn.toi_sh >= 30
        ? calcReqRank(
            players,
            "xshd_gar",
            playerName,
            szn.year,
            pos,
            "toi_sh",
            30
          )
        : -1,
    off_gar: calcRank(players, "off_gar", playerName, szn.year, pos),
    xoff_gar: calcRank(players, "xoff_gar", playerName, szn.year, pos),
    def_gar: calcRank(players, "def_gar", playerName, szn.year, pos),
    xdef_gar: calcRank(players, "xdef_gar", playerName, szn.year, pos),
    pen_gar: calcRank(players, "pen_gar", playerName, szn.year, pos),
    tot_gar: calcRank(players, "tot_gar", playerName, szn.year, pos),
    xtot_gar: calcRank(players, "xtot_gar", playerName, szn.year, pos),
    goals: calcRank(players, "goals", playerName, szn.year, pos),
    primary_assists: calcRank(
      players,
      "primary_assists",
      playerName,
      szn.year,
      pos
    ),
    qoc: calcRank(players, "qoc", playerName, szn.year, pos),
    qot: calcRank(players, "qot", playerName, szn.year, pos),
    shoot: calcRank(players, "shoot", playerName, szn.year, pos),
  };
  return season;
};
