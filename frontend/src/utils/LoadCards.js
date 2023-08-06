import { callAPI } from "./Api";
import { useState } from "react";
import Cards from "../screens/Cards";
import { STARTING_PLAYER } from "../utils/Constants";

let data = {};

export default function LoadCards() {
  const loadData = async () => {
    await callAPI("/years").then((res) => {
      data.years = res;
    });
    await callAPI("/players").then((res) => {
      data.players = res;
    });
    await callAPI(`/player/ranks/${STARTING_PLAYER.id}`).then((res) => {
      data.startingPlayer = res;
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
