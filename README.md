# Offside

Offside presents NHL player cards built with [Evolving Hockey's](https://evolving-hockey.com/) Goals Above Replacement (GAR) Model. With data since the 2007-08 season, the player cards can be adjusted to any season from 07-08 to present.

![Sample Card](./frontend/public/card.png)

Built with the MERN stack: MongoDB, Express, React, and Node.

## The Data

The values displayed are percentile rankings of the player's stats.

- **OVR**: Total GAR
- **OFF**: Total Offensive GAR (EVO + PP)
- **DEF**: Total Defensive GAR (EVD + PK)
- **EVO**: Even Strength Offensive GAR
- **EVD**: Even Strength Defensive GAR
- **PP**: Powerplay Offensive GAR
- **PK**: Shorthanded Defensive GAR
- **PEN**: Penalties Taken/Drawn GAR
- **SHT**: Shooting Talent Relative to Average
- **G/60**: Goals per 60 minutes of ice time
- **A1/60**: Primary Assists per 60 minutes of ice time
- **QOC**: Quality of Competition
- **QOT**: Quality of Teammates