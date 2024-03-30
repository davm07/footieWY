const BASE_URL = import.meta.env.VITE_SERVER_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
const API_HOST = import.meta.env.VITE_API_HOST;

let myHeaders = new Headers();
myHeaders.append('x-rapidapi-key', API_KEY);
myHeaders.append('x-rapidapi-host', API_HOST);

const requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow',
};

export default class ExternalServices {
  constructor(params) {}

  async getFixtures() {
    try {
      const response = await fetch(
        `${BASE_URL}fixtures?live=all`,
        requestOptions,
      );
      const data = await response.json();
      return data.response;
    } catch (err) {
      console.log(err);
    }
  }

  async getTopLeagues() {
    let leagues_ids = [39, 140, 78, 61, 135];
    try {
      const response = await fetch(`${BASE_URL}leagues`, requestOptions);
      const data = await response.json();
      const elements = data.response;
      const topLeagues = elements.filter((item) =>
        leagues_ids.includes(item.league.id),
      );
      return topLeagues;
    } catch (err) {
      console.log(err);
    }
  }
}
