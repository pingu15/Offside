import React, { useEffect, useRef, useState } from "react";
import "../css/Cards.css";
import logo from "../images/logo.png";
import scale from "../images/scale.svg";

const positions = {
  C: "CENTER",
  L: "LEFT WING",
  R: "RIGHT WING",
  D: "DEFENSE",
  G: "GOALIE",
};

export default function Cards(props) {
  const ref = useRef(null);
  useEffect(() => {
    resize();
    function resize() {
      ref.current.style.transform = `scale(${window.innerWidth / 1920})`;
    }
    window.addEventListener("resize", resize);
  });
  const calcRank = (stat, name, szn, pos) => {
    return (
      100 -
      Math.round(
        (props.data.players
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
          props.data.players.filter(
            (a) =>
              a.seasonRates.find((season) => season.year === szn) &&
              a.position === pos
          ).length) *
          100
      )
    );
  };
  const calcReqRank = (stat, name, szn, pos, reqStat, req) => {
    return (
      100 -
      Math.round(
        (props.data.players
          .filter(
            (a) =>
              a.seasonRates.find((season) => season.year === szn) &&
              a.position === pos &&
              a.seasonRates.find((season) => season.year === szn)[reqStat] >=
                req
          )
          .sort(
            (a, b) =>
              b.seasonRates.find((season) => season.year === szn)[stat] -
              a.seasonRates.find((season) => season.year === szn)[stat]
          )
          .findIndex((player) => player.name === name) /
          props.data.players.filter(
            (a) =>
              a.seasonRates.find((season) => season.year === szn) &&
              a.position === pos &&
              a.seasonRates.find((season) => season.year === szn)[reqStat] >=
                req
          ).length) *
          100
      )
    );
  };
  const calcRanks = (szn, playerName, pos) => {
    var season = {
      year: szn.year,
      team: szn.team,
      age: szn.age,
      gp: szn.gp,
      toi_all: calcRank("toi_all", playerName, szn.year, pos),
      evo_gar: calcRank("evo_gar", playerName, szn.year, pos),
      xevo_gar: calcRank("xevo_gar", playerName, szn.year, pos),
      evd_gar: calcRank("evd_gar", playerName, szn.year, pos),
      xevd_gar: calcRank("xevd_gar", playerName, szn.year, pos),
      ppo_gar:
        szn.toi_pp >= 30
          ? calcReqRank("ppo_gar", playerName, szn.year, pos, "toi_pp", 30)
          : -1,
      xppo_gar:
        szn.toi_pp >= 30
          ? calcReqRank("xppo_gar", playerName, szn.year, pos, "toi_pp", 30)
          : -1,
      shd_gar:
        szn.toi_sh >= 30
          ? calcReqRank("shd_gar", playerName, szn.year, pos, "toi_sh", 30)
          : -1,
      xshd_gar:
        szn.toi_sh >= 30
          ? calcReqRank("xshd_gar", playerName, szn.year, pos, "toi_sh", 30)
          : -1,
      off_gar: calcRank("off_gar", playerName, szn.year, pos),
      xoff_gar: calcRank("xoff_gar", playerName, szn.year, pos),
      def_gar: calcRank("def_gar", playerName, szn.year, pos),
      xdef_gar: calcRank("xdef_gar", playerName, szn.year, pos),
      pen_gar: calcRank("pen_gar", playerName, szn.year, pos),
      tot_gar: calcRank("tot_gar", playerName, szn.year, pos),
      xtot_gar: calcRank("xtot_gar", playerName, szn.year, pos),
      goals: calcRank("goals", playerName, szn.year, pos),
      primary_assists: calcRank("primary_assists", playerName, szn.year, pos),
      qoc: calcRank("qoc", playerName, szn.year, pos),
      qot: calcRank("qot", playerName, szn.year, pos),
      shoot: calcRank("shoot", playerName, szn.year, pos),
    };
    return season;
  };
  const inputRef = useRef(null);
  const yearRef = useRef(null);
  const [currentYear, setCurrentYear] = useState(props.data.years.at(-1));
  const [selected, setSelected] = useState(
    props.data.players.find((player) => player.name === "Sidney Crosby")
  );
  const [selectedSeason, setSelectedSeason] = useState(
    selected.seasonRates.find((season) => season.year === currentYear)
  );
  const [focus, setFocus] = useState(false);
  const [searchOptions, setSearchOptions] = useState([selected]);
  const [ranks, setRanks] = useState(
    calcRanks(selectedSeason, selected.name, selected.position)
  );
  const handleYearChange = (event) => {
    setCurrentYear(event.target.value);
    setSelectedSeason(
      selected.seasonRates.find((season) => season.year === event.target.value)
    );
    setRanks(
      calcRanks(
        selected.seasonRates.find(
          (season) => season.year === event.target.value
        ),
        selected.name,
        selected.position
      )
    );
  };
  const handleNameChange = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchOptions(
      props.data.players.filter((player) =>
        player.name.toLowerCase().includes(value)
      )
    );
  };
  const handleSelect = (index) => {
    if (
      searchOptions[index].seasonRates.find(
        (season) => season.year === currentYear
      )
    ) {
      setSelected(searchOptions[index]);
      setSelectedSeason(
        searchOptions[index].seasonRates.find(
          (season) => season.year === currentYear
        )
      );
      setRanks(
        calcRanks(
          searchOptions[index].seasonRates.find(
            (season) => season.year === currentYear
          ),
          searchOptions[index].name,
          searchOptions[index].position
        )
      );
    } else {
      setSelected(searchOptions[index]);
      setSelectedSeason(searchOptions[index].seasonRates.at(-1));
      setCurrentYear(searchOptions[index].seasonRates.at(-1).year);
      setRanks(
        calcRanks(
          searchOptions[index].seasonRates.at(-1),
          searchOptions[index].name,
          searchOptions[index].position
        )
      );
      yearRef.current.value = searchOptions[index].seasonRates.at(-1).year;
    }
    inputRef.current.value = searchOptions[index].name;
    inputRef.current.blur();
  };
  const calcRed = (val) => {
    return val === -1 ? 200 : val < 50 ? 255 : 255 - (val - 50) * 5.1;
  };
  const calcBlue = (val) => {
    return val === -1 ? 200 : val > 50 ? 255 : val * 5.1;
  };
  const calcGreen = (val) => {
    return val === -1 ? 200 : val > 50 ? 255 - (val - 50) * 2.5 : val * 5.1;
  };
  const prev = (stat, yr) => {
    let idx = props.data.years.findIndex((year) => year === currentYear);
    if (idx < yr) return "";
    let szn = props.data.players
      .find((player) => player.name === selected.name)
      .seasonRates.find((season) => season.year === props.data.years[idx - yr]);
    if (!szn) return "";
    console.log("year: " + szn.year);
    return (
      (yr === 2 ? "45," : "195,") +
      (248 - calcRank(stat, selected.name, szn.year, selected.position) * 2.4)
    );
  };
  const getYear = (yr) => {
    let idx = props.data.years.findIndex((year) => year === currentYear);
    if (idx < yr) return "";
    return props.data.years[idx - yr];
  };
  return (
    <div ref={ref} className="webpage">
      <div className="top-bar">
        <div className="logo">
          <img className="img" alt="Logo" src={logo} />
        </div>
        <div className="nav-bar">
          <div className="menu">
            <a href="cards" className="div">
              CARDS
            </a>
            <a href="glossary" className="div">
              GLOSSARY
            </a>
            <a href="about" className="div">
              ABOUT
            </a>
          </div>
        </div>
      </div>
      <div className="content">
        <div className="bg">
          <div className="bg-2" />
        </div>
        <div className="title">
          <h1 className="h-1">OFFSIDE</h1>
          <div className="text-wrapper-2">NHL PLAYER CARDS</div>
          <div className="divider">
            <div className="divider-2" />
          </div>
        </div>
        <div className="input">
          <div className="fields">
            <label className="playerLabel">PLAYER NAME</label>
            <input
              title="Player Name"
              type="text"
              className="PlayerName"
              defaultValue={selected.name}
              onChange={handleNameChange}
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
              ref={inputRef}
              placeholder="Enter Player Name"
            />
            {focus && (
              <div className="searchOptions">
                {searchOptions.map((option, index) => {
                  return (
                    <div
                      key={index}
                      className="option"
                      onMouseDown={() => handleSelect(index)}
                    >
                      {option.name}
                    </div>
                  );
                })}
              </div>
            )}
            <label className="playerLabel">YEAR</label>
            <select
              title="Year"
              className="YearSelect"
              onChange={handleYearChange}
              value={currentYear}
              ref={yearRef}
            >
              {selected.seasons
                .map((szn) => szn.year)
                .map((year) => {
                  return (
                    <option key={year} value={year} className="yearOption">
                      {year}
                    </option>
                  );
                })}
            </select>
          </div>
        </div>
        <div className="card">
          <div className="info">
            <div
              className="pic"
              style={{
                backgroundImage: `url(https://cms.nhl.bamgrid.com/images/headshots/current/168x168/${selected.id}.jpg)`,
                backgroundSize: "100px 100px",
              }}
            />
            <div className="div-2">
              <div className="info-2">
                <div className="div-wrapper">
                  <div className="text-wrapper-3">{selected.name}</div>
                </div>
                <div className="text-wrapper-4">
                  TEAM: {selectedSeason.team}
                </div>
              </div>
              <div className="ovr">
                <div
                  className="ovr-2"
                  style={{
                    backgroundColor: `rgb(${calcRed(
                      ranks.tot_gar
                    )}, ${calcGreen(ranks.tot_gar)}, ${calcBlue(
                      ranks.tot_gar
                    )})`,
                  }}
                />
                <div className="text-wrapper-5">{ranks.tot_gar}</div>
              </div>
            </div>
          </div>
          <div className="div-2">
            <div className="text-wrapper-6">
              POS: {positions[selected.position]}
            </div>
            <div className="text-wrapper-7">AGE: {selectedSeason.age} YRS</div>
            <div className="text-wrapper-7">
              DRAFT: {selected.draft_round === -1 ? "N/A" : selected.draft_year}
            </div>
            <div className="text-wrapper-7">GP: {selectedSeason.gp}</div>
            <div className="text-wrapper-8">OVR</div>
          </div>
          <div className="data">
            <div className="data-2">
              <div className="group">
                <div
                  className="rectangle"
                  style={{
                    backgroundColor: `rgb(${calcRed(
                      ranks.xevd_gar
                    )}, ${calcGreen(ranks.xevd_gar)}, ${calcBlue(
                      ranks.xevd_gar
                    )})`,
                  }}
                >
                  {ranks.xevd_gar}
                </div>
                <div
                  className="rectangle-2"
                  id="shoot"
                  style={{
                    backgroundColor: `rgb(${calcRed(ranks.shoot)}, ${calcGreen(
                      ranks.shoot
                    )}, ${calcBlue(ranks.shoot)})`,
                  }}
                >
                  {ranks.shoot}
                </div>
                <div
                  className="rectangle-3"
                  id="xevo_gar"
                  style={{
                    backgroundColor: `rgb(${calcRed(
                      ranks.xevo_gar
                    )}, ${calcGreen(ranks.xevo_gar)}, ${calcBlue(
                      ranks.xevo_gar
                    )})`,
                  }}
                >
                  {ranks.xevo_gar}
                </div>
                <div
                  className="rectangle-4"
                  id="xtot_gar"
                  style={{
                    backgroundColor: `rgb(${calcRed(
                      ranks.xtot_gar
                    )}, ${calcGreen(ranks.xtot_gar)}, ${calcBlue(
                      ranks.xtot_gar
                    )})`,
                  }}
                >
                  {ranks.xtot_gar}
                </div>
              </div>
              <div className="label-wrapper">
                <div className="label">
                  <div className="text-wrapper-9">EXP</div>
                  <div className="text-wrapper-9">EVO</div>
                  <div className="text-wrapper-10">EVD</div>
                  <div className="text-wrapper-10">SHT</div>
                </div>
              </div>
              <div className="group-2">
                <div
                  className="rectangle"
                  id="goals"
                  style={{
                    backgroundColor: `rgb(${calcRed(ranks.goals)}, ${calcGreen(
                      ranks.goals
                    )}, ${calcBlue(ranks.goals)})`,
                  }}
                >
                  {ranks.goals}
                </div>
                <div
                  className="rectangle-2"
                  id="primary_assists"
                  style={{
                    backgroundColor: `rgb(${calcRed(
                      ranks.primary_assists
                    )}, ${calcGreen(ranks.primary_assists)}, ${calcBlue(
                      ranks.primary_assists
                    )})`,
                  }}
                >
                  {ranks.primary_assists}
                </div>
                <div
                  className="rectangle-3"
                  id="xshd_gar"
                  style={{
                    backgroundColor: `rgb(${calcRed(
                      ranks.xshd_gar
                    )}, ${calcGreen(ranks.xshd_gar)}, ${calcBlue(
                      ranks.xshd_gar
                    )})`,
                  }}
                >
                  {ranks.xshd_gar === -1 ? "--" : ranks.xshd_gar}
                </div>
                <div
                  className="rectangle-4"
                  id="xppo_gar"
                  style={{
                    backgroundColor: `rgb(${calcRed(
                      ranks.xppo_gar
                    )}, ${calcGreen(ranks.xppo_gar)}, ${calcBlue(
                      ranks.xppo_gar
                    )})`,
                  }}
                >
                  {ranks.xppo_gar === -1 ? "--" : ranks.xppo_gar}
                </div>
              </div>
              <div className="group-3">
                <div className="label">
                  <div className="text-wrapper-12">PP</div>
                  <div className="text-wrapper-12">PK</div>
                  <div className="text-wrapper-11">G/60</div>
                  <div className="text-wrapper-11">A1/60</div>
                </div>
              </div>
              <div className="group-4">
                <div
                  className="rectangle"
                  id="qoc"
                  style={{
                    backgroundColor: `rgb(${calcRed(ranks.qoc)}, ${calcGreen(
                      ranks.qoc
                    )}, ${calcBlue(ranks.qoc)})`,
                  }}
                >
                  {ranks.qoc}
                </div>
                <div
                  className="rectangle-2"
                  id="qot"
                  style={{
                    backgroundColor: `rgb(${calcRed(ranks.qot)}, ${calcGreen(
                      ranks.qot
                    )}, ${calcBlue(ranks.qot)})`,
                  }}
                >
                  {ranks.qot}
                </div>
                <div
                  className="rectangle-3"
                  id="toi_all"
                  style={{
                    backgroundColor: `rgb(${calcRed(
                      ranks.toi_all
                    )}, ${calcGreen(ranks.toi_all)}, ${calcBlue(
                      ranks.toi_all
                    )})`,
                  }}
                >
                  {ranks.toi_all}
                </div>
                <div
                  className="rectangle-4"
                  id="pen_gar"
                  style={{
                    backgroundColor: `rgb(${calcRed(
                      ranks.pen_gar
                    )}, ${calcGreen(ranks.pen_gar)}, ${calcBlue(
                      ranks.pen_gar
                    )})`,
                  }}
                >
                  {ranks.pen_gar}
                </div>
              </div>
              <div className="group-5">
                <div className="label">
                  <div className="text-wrapper-12">PEN</div>
                  <div className="text-wrapper-12">TOI</div>
                  <div className="text-wrapper-11">QOC</div>
                  <div className="text-wrapper-11">QOT</div>
                </div>
              </div>
            </div>
            <div className="graph">
              <div className="graph-2">
                <div className="graph-3">
                  <div className="overlap-group">
                    <div className="scale">
                      <div className="numbers">
                        <div className="text-wrapper-13">100</div>
                        <div className="text-wrapper-14">80</div>
                        <div className="text-wrapper-14">60</div>
                        <div className="text-wrapper-14">40</div>
                        <div className="text-wrapper-14">20</div>
                        <div className="text-wrapper-14">0</div>
                      </div>
                      <img className="scale-2" alt="Scale" src={scale} />
                    </div>
                    <svg>
                      <polyline
                        style={{ stroke: "#00BC29" }}
                        points={`${prev("shoot", 2)} ${prev("shoot", 1)} 345, ${
                          248 - ranks.shoot * 2.4
                        } 345, ${248 - ranks.shoot * 2.4}`}
                      ></polyline>
                      <polyline
                        style={{ stroke: "#E73F76" }}
                        points={`${prev("xdef_gar", 2)} ${prev(
                          "xdef_gar",
                          1
                        )} 345, ${248 - ranks.xdef_gar * 2.4}  345, ${
                          248 - ranks.xdef_gar * 2.4
                        }`}
                      ></polyline>
                      <polyline
                        style={{ stroke: "#4FB5FF" }}
                        points={`${prev("xoff_gar", 2)} ${prev(
                          "xoff_gar",
                          1
                        )} 345, ${248 - ranks.xoff_gar * 2.4} 345, ${
                          248 - ranks.xoff_gar * 2.4
                        }`}
                      ></polyline>
                    </svg>
                  </div>
                  <div className="years">
                    <div className="text-wrapper-15">{getYear(2)}</div>
                    <div className="text-wrapper-16">{getYear(1)}</div>
                    <div className="text-wrapper-17">{currentYear}</div>
                  </div>
                </div>
                <div className="legend">
                  <div className="div-3">
                    <div className="dot" />
                    <div className="text-wrapper-18">OFF</div>
                  </div>
                  <div className="div-3">
                    <div className="dot-2" />
                    <div className="text-wrapper-18">DEF</div>
                  </div>
                  <div className="div-3">
                    <div className="dot-3" />
                    <div className="text-wrapper-18">SHT</div>
                  </div>
                </div>
              </div>
              <div className="p">
                Values expressed as a percentile relative to position. Data from
                Evolving Hockey.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
