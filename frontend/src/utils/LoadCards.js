import { to60 } from "./Converter";
import { callAPI } from "./Api";
import { useState } from "react";
import Cards from "../screens/Cards";

let data = {};

export default function LoadCards() {
  const loadData = async () => {
    await callAPI("/years").then((res) => {
      data.years = res;
    });
    await callAPI("/players").then((res) => {
      data.players = res;
      data.players.forEach((player) => {
        player.seasonRates = [];
        player.seasons.forEach((season) => {
          player.seasonRates.push(to60(season));
        });
      });
    });
    await callAPI("/goalies").then((res) => {
      data.goalies = res;
    });
  };

  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    loadData().then(() => {
      setIsLoading(false);
    });
  }

  return isLoading ? (
    <></>
  ) : (
    <>
      <Cards data={data} />
    </>
  );
}
