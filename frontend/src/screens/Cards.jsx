import React, { useEffect, useRef, useState } from "react";
import "../css/Cards.css";
import logo from "../images/logo.png";
import scale from "../images/scale.svg";
import { callAPI } from "../utils/Api";

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
  const inputRef = useRef(null);
  const yearRef = useRef(null);
  const [currentYear, setCurrentYear] = useState(
    props.data.startingPlayer.seasonRanks.at(-1).year
  );
  const [selected, setSelected] = useState(props.data.startingPlayer);
  const [focus, setFocus] = useState(false);
  const [searchOptions, setSearchOptions] = useState([selected]);
  const [currentSeason, setCurrentSeason] = useState(
    props.data.startingPlayer.seasonRanks.at(-1)
  );
  const handleYearChange = (event) => {
    setCurrentYear(event.target.value);
    setCurrentSeason(
      selected.seasonRanks.find((szn) => szn.year === event.target.value)
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
  const handleSelect = async (index) => {
    let player = {};
    await callAPI(`/player/ranks/${searchOptions[index].id}`).then((res) => {
      player = res;
    });
    if (player.seasonRanks.find((season) => season.year === currentYear)) {
      setSelected(player);
      setCurrentSeason(
        player.seasonRanks.find((season) => season.year === currentYear)
      );
    } else {
      setSelected(player);
      setCurrentSeason(player.seasonRanks.at(-1));
      setCurrentYear(player.seasonRanks.at(-1).year);
      yearRef.current.value = player.seasonRanks.at(-1).year;
    }
    setSearchOptions([{ id: player.id, name: player.name }]);
    inputRef.current.value = player.name;
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
    let szn = selected.seasonRanks.find(
      (season) => season.year === props.data.years[idx - yr]
    );
    if (!szn) return "";
    return (yr === 2 ? "45," : "195,") + (248 - szn[stat] * 2.4);
  };
  const getYear = (yr) => {
    let idx = props.data.years.findIndex((year) => year === currentYear);
    if (idx < yr) return "";
    return props.data.years[idx - yr];
  };
  return (
    <div ref={ref} className="webpage">
      <div className="top-bar">
        <a className="logo" href="/">
          <img className="img" alt="Logo" src={logo} />
        </a>
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
              {selected.seasonRanks
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
                backgroundImage: `url(https://assets.nhle.com/mugs/nhl/20${currentYear.substring(0, 2)}20${currentYear.substring(3)}/${currentSeason.team}/${selected.id}.png)`,
                backgroundSize: "100px 100px",
              }}
            />
            <div className="div-2">
              <div className="info-2">
                <div className="div-wrapper">
                  <div className="text-wrapper-3">{selected.name}</div>
                </div>
                <div className="text-wrapper-4">TEAM: {currentSeason.team}</div>
              </div>
              <div className="ovr">
                <div
                  className="ovr-2"
                  style={{
                    backgroundColor: `rgb(${calcRed(
                      currentSeason.tot_gar
                    )}, ${calcGreen(currentSeason.tot_gar)}, ${calcBlue(
                      currentSeason.tot_gar
                    )})`,
                  }}
                />
                <div className="text-wrapper-5">{currentSeason.tot_gar}</div>
              </div>
            </div>
          </div>
          <div className="div-2">
            <div className="text-wrapper-6">
              POS: {positions[selected.position]}
            </div>
            <div className="text-wrapper-7">AGE: {currentSeason.age} YRS</div>
            <div className="text-wrapper-7">
              DRAFT: {selected.draft_round === -1 ? "N/A" : selected.draft_year}
            </div>
            <div className="text-wrapper-7">GP: {currentSeason.gp}</div>
            <div className="text-wrapper-8">OVR</div>
          </div>
          <div className="data">
            <div className="data-2">
              <div className="group">
                <div
                  className="rectangle"
                  style={{
                    backgroundColor: `rgb(${calcRed(
                      currentSeason.xevd_gar
                    )}, ${calcGreen(currentSeason.xevd_gar)}, ${calcBlue(
                      currentSeason.xevd_gar
                    )})`,
                  }}
                >
                  {currentSeason.xevd_gar}
                </div>
                <div
                  className="rectangle-2"
                  id="shoot"
                  style={{
                    backgroundColor: `rgb(${calcRed(
                      currentSeason.shoot
                    )}, ${calcGreen(currentSeason.shoot)}, ${calcBlue(
                      currentSeason.shoot
                    )})`,
                  }}
                >
                  {currentSeason.shoot}
                </div>
                <div
                  className="rectangle-3"
                  id="xevo_gar"
                  style={{
                    backgroundColor: `rgb(${calcRed(
                      currentSeason.xevo_gar
                    )}, ${calcGreen(currentSeason.xevo_gar)}, ${calcBlue(
                      currentSeason.xevo_gar
                    )})`,
                  }}
                >
                  {currentSeason.xevo_gar}
                </div>
                <div
                  className="rectangle-4"
                  id="xtot_gar"
                  style={{
                    backgroundColor: `rgb(${calcRed(
                      currentSeason.xtot_gar
                    )}, ${calcGreen(currentSeason.xtot_gar)}, ${calcBlue(
                      currentSeason.xtot_gar
                    )})`,
                  }}
                >
                  {currentSeason.xtot_gar}
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
                    backgroundColor: `rgb(${calcRed(
                      currentSeason.goals
                    )}, ${calcGreen(currentSeason.goals)}, ${calcBlue(
                      currentSeason.goals
                    )})`,
                  }}
                >
                  {currentSeason.goals}
                </div>
                <div
                  className="rectangle-2"
                  id="primary_assists"
                  style={{
                    backgroundColor: `rgb(${calcRed(
                      currentSeason.primary_assists
                    )}, ${calcGreen(currentSeason.primary_assists)}, ${calcBlue(
                      currentSeason.primary_assists
                    )})`,
                  }}
                >
                  {currentSeason.primary_assists}
                </div>
                <div
                  className="rectangle-3"
                  id="xshd_gar"
                  style={{
                    backgroundColor: `rgb(${calcRed(
                      currentSeason.xshd_gar
                    )}, ${calcGreen(currentSeason.xshd_gar)}, ${calcBlue(
                      currentSeason.xshd_gar
                    )})`,
                  }}
                >
                  {currentSeason.xshd_gar === -1
                    ? "--"
                    : currentSeason.xshd_gar}
                </div>
                <div
                  className="rectangle-4"
                  id="xppo_gar"
                  style={{
                    backgroundColor: `rgb(${calcRed(
                      currentSeason.xppo_gar
                    )}, ${calcGreen(currentSeason.xppo_gar)}, ${calcBlue(
                      currentSeason.xppo_gar
                    )})`,
                  }}
                >
                  {currentSeason.xppo_gar === -1
                    ? "--"
                    : currentSeason.xppo_gar}
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
                    backgroundColor: `rgb(${calcRed(
                      currentSeason.qoc
                    )}, ${calcGreen(currentSeason.qoc)}, ${calcBlue(
                      currentSeason.qoc
                    )})`,
                  }}
                >
                  {currentSeason.qoc}
                </div>
                <div
                  className="rectangle-2"
                  id="qot"
                  style={{
                    backgroundColor: `rgb(${calcRed(
                      currentSeason.qot
                    )}, ${calcGreen(currentSeason.qot)}, ${calcBlue(
                      currentSeason.qot
                    )})`,
                  }}
                >
                  {currentSeason.qot}
                </div>
                <div
                  className="rectangle-3"
                  id="toi_all"
                  style={{
                    backgroundColor: `rgb(${calcRed(
                      currentSeason.toi_all
                    )}, ${calcGreen(currentSeason.toi_all)}, ${calcBlue(
                      currentSeason.toi_all
                    )})`,
                  }}
                >
                  {currentSeason.toi_all}
                </div>
                <div
                  className="rectangle-4"
                  id="pen_gar"
                  style={{
                    backgroundColor: `rgb(${calcRed(
                      currentSeason.pen_gar
                    )}, ${calcGreen(currentSeason.pen_gar)}, ${calcBlue(
                      currentSeason.pen_gar
                    )})`,
                  }}
                >
                  {currentSeason.pen_gar}
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
                          248 - currentSeason.shoot * 2.4
                        } 345, ${248 - currentSeason.shoot * 2.4}`}
                      ></polyline>
                      <polyline
                        style={{ stroke: "#E73F76" }}
                        points={`${prev("xdef_gar", 2)} ${prev(
                          "xdef_gar",
                          1
                        )} 345, ${248 - currentSeason.xdef_gar * 2.4}  345, ${
                          248 - currentSeason.xdef_gar * 2.4
                        }`}
                      ></polyline>
                      <polyline
                        style={{ stroke: "#4FB5FF" }}
                        points={`${prev("xoff_gar", 2)} ${prev(
                          "xoff_gar",
                          1
                        )} 345, ${248 - currentSeason.xoff_gar * 2.4} 345, ${
                          248 - currentSeason.xoff_gar * 2.4
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
