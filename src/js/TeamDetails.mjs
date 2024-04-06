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

function filterCurrentGame(list) {
  const todayDate = new Date();
  const todayGames = list.filter(
    (element) =>
      new Date(element.fixture.date).toDateString() ===
        todayDate.toDateString() && element.fixture.status.short !== 'FT',
  );
  console.log(todayGames);
  return todayGames;
}

export default class TeamDetails {
  constructor(parentElement, matchDataSource, leagueId, season, teamId) {
    this.parentElement = parentElement;
    this.matchDataSource = matchDataSource;
    this.teamGames = null;
    this.leagueId = leagueId;
    this.season = season;
    this.teamId = teamId;
  }

  async getTeamStatistics() {
    try {
      const response = await fetch(
        `${BASE_URL}teams/statistics?league=${this.leagueId}&season=${this.season}&team=${this.teamId}`,
        requestOptions,
      );
      const data = await response.json();
      console.log(data.response);
      return data.response;
    } catch (err) {
      console.log(err);
    }
  }

  async getTeamSquad() {
    try {
      const response = await fetch(
        `${BASE_URL}players/squads?team=${this.teamId}`,
        requestOptions,
      );
      const data = await response.json();
      console.log(data.response);
      return data.response;
    } catch (err) {
      console.log(err);
    }
  }

  async getTeamGames() {
    try {
      const teamGames = await this.matchDataSource.getTeamFixtures(
        this.leagueId,
        this.season,
        this.teamId,
      );
      return teamGames;
    } catch (err) {
      console.log(err);
    }
  }

  async renderTeamGames() {
    this.teamGames = await this.getTeamGames();
    this.teamGames = this.teamGames.sort(
      (a, b) => new Date(b.fixture.date) - new Date(a.fixture.date),
    );
    this.matchDataSource.renderLeagueGamesData(this.teamGames);
    const todayGameElement = document.querySelector('#today-gamesCont');
    const todayGame = filterCurrentGame(this.teamGames);
    if (todayGame.length > 0) {
      this.matchDataSource.renderDataCurrentMatch(todayGame, todayGameElement);
    } else {
      const message = document.createElement('p');
      message.setAttribute('class', 'message-game');
      message.innerText = 'Sorry, there is no live game';
      todayGameElement.replaceWith(message);
    }

    const selectElement = document.querySelector('#sortSelect');
    selectElement.addEventListener('change', () => {
      let value = selectElement.value;
      if (value === 'newest') {
        this.teamGames = this.teamGames.sort(
          (a, b) => new Date(b.fixture.date) - new Date(a.fixture.date),
        );
      } else {
        this.teamGames = this.teamGames.sort(
          (a, b) => new Date(a.fixture.date) - new Date(b.fixture.date),
        );
      }
      const containerGames = document.querySelector('#team-gamesCont');
      containerGames.innerHTML = '';
      this.matchDataSource.renderLeagueGamesData(this.teamGames);
      const firsElement = containerGames.firstElementChild;
      if (firsElement) {
        firsElement.scrollIntoView();
      }
    });
  }
}
