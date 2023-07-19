import { API_URL } from "./Routes";

export const callAPI = async (url) => {
  return await fetch(API_URL + url)
    .then((response) => response.json())
    .catch((error) => console.error(error.message));
};
