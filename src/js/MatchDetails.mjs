import { renderListWithTemplate } from './utils.mjs';

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

function matchCardTemplate(element) {
  return `<div class="match-container" data-id="${element.fixture.id}">
            <div class="leagueInfo">
              <h3 data-id="${element.league.id}">${element.league.name}</h3>
              <p>${element.league.country}</p>
            </div>
            <div class="matchInfo">
              <div class="teamHome" data-id="${element.teams.home.id}">
                <div class="teamLogo">
                  <img src="https://test-api-sports-davm.b-cdn.net/football/teams/${element.teams.home.id}.png" alt="${element.teams.home.name}" loading="lazy">
                </div>
                <h4 class="teamTitle">${element.teams.home.name}</h4>
                <p>${element.goals.home}</p>
              </div>
              <div class="match-status">
                <p>VS</p>
                <p>${element.fixture.status.elapsed}'</p>
              </div>
              <div class="teamAway" data-id="${element.teams.away.id}">
                <div class="teamLogo">
                  <img src="https://test-api-sports-davm.b-cdn.net/football/teams/${element.teams.away.id}.png" alt="${element.teams.away.name}">
                </div>
                <h4 class="teamTitle">${element.teams.away.name}</h4>
                <p>${element.goals.away}</p>
              </div>
            </div>
          </div>`;
}

export default class MatchDetails {
  constructor(parentElement) {
    this.parentElement = parentElement;
  }

  async renderCurrentGames() {
    const matchData = await this.getFixtures();
    if (matchData != null && matchData.length > 0) {
      this.renderData(matchData);
    } else {
      this.parentElement.innerHTML = `<h3>There are currently no matches available. Please check back later.</h3>`;
    }
  }

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

  renderData(list) {
    renderListWithTemplate(matchCardTemplate, this.parentElement, list);
  }
}
