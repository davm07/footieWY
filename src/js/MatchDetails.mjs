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
                  <img src="https://media.api-sports.io/football/teams/${element.teams.home.id}.png" alt="${element.teams.home.name}" loading="lazy" onerror="this.src='/images/onerror.png';">
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
                  <img src="https://media.api-sports.io/football/teams/${element.teams.away.id}.png" alt="${element.teams.away.name}" loading="lazy" onerror="this.src='/images/onerror.png';">
                </div>
                <h4 class="teamTitle">${element.teams.away.name}</h4>
                <p>${element.goals.away}</p>
              </div>
            </div>
          </div>`;
}

function matchCardLeagueTemplate(element) {
  return `<div class="match-container" data-id="${element.fixture.id}">
            <div class="leagueInfo">
              <h3 data-id="time" class="gameDate">${new Date(element.fixture.date).toDateString()}</h3>
              <p class="gameStadium"><b>Stadium:</b> ${element.fixture.venue.name}</p>
            </div>
            <div class="matchInfo">
              <div class="teamHome" data-id="${element.teams.home.id}">
                <div class="teamLogo">
                  <img src="https://media.api-sports.io/football/teams/${element.teams.home.id}.png" alt="${element.teams.home.name}" loading="lazy" onerror="this.src='/images/onerror.png';">
                </div>
                <h4 class="teamTitle">${element.teams.home.name}</h4>
                <p>${element.goals.home !== null ? element.goals.home : 0}</p>
              </div>
              <div class="match-status">
                <p>VS</p>
                <p>${element.fixture.status.elapsed !== null ? element.fixture.status.elapsed + '&#39;' : element.fixture.status.long}</p>
              </div>
              <div class="teamAway" data-id="${element.teams.away.id}">
                <div class="teamLogo">
                  <img src="https://media.api-sports.io/football/teams/${element.teams.away.id}.png" alt="${element.teams.away.name}" loading="lazy" onerror="this.src='/images/onerror.png';">
                </div>
                <h4 class="teamTitle">${element.teams.away.name}</h4>
                <p>${element.goals.away !== null ? element.goals.away : 0}</p>
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

  async renderLeagueCurrentFixtures(leagueId, seasonYear, sectionElement) {
    try {
      const responseGames = await fetch(
        `${BASE_URL}fixtures?league=${leagueId}&season=${seasonYear}&live=all`,
        requestOptions,
      );
      const dataLeagueGames = await responseGames.json();
      if (dataLeagueGames.response.length > 0) {
        renderListWithTemplate(
          matchCardTemplate,
          sectionElement,
          dataLeagueGames.response,
        );
      } else {
        sectionElement.innerHTML = `<p>There are no matches available</p>`;
      }
    } catch (err) {
      console.log(err);
    }
  }

  async renderLeagueFixtures(leagueId, seasonYear) {
    try {
      const responseGames = await fetch(
        `${BASE_URL}fixtures?league=${leagueId}&season=${seasonYear}&next=10`,
        requestOptions,
      );
      const dataLeagueGames = await responseGames.json();
      if (dataLeagueGames.response.length > 0) {
        this.renderLeagueGamesData(dataLeagueGames.response);
      } else {
        this.parentElement.innerHTML = `<p>There are no matches available</p>`;
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getTeamFixtures(leagueId, season, teamId) {
    try {
      const responseGames = await fetch(
        `${BASE_URL}fixtures?league=${leagueId}&season=${season}&team=${teamId}`,
        requestOptions,
      );
      const dataTeamGames = await responseGames.json();
      return dataTeamGames.response;
    } catch (err) {
      console.log(err);
    }
  }

  renderData(list) {
    renderListWithTemplate(matchCardTemplate, this.parentElement, list);
  }

  renderLeagueGamesData(list) {
    renderListWithTemplate(matchCardLeagueTemplate, this.parentElement, list);
  }

  renderDataCurrentMatch(list, sectionElement) {
    renderListWithTemplate(matchCardLeagueTemplate, sectionElement, list);
  }
}
