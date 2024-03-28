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
}
