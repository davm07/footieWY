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

function sortGames(selectElement) {}

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
