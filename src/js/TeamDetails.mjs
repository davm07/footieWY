import { addMyFavorite, checkExistingItem } from './utils.mjs';

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
  return todayGames;
}

function renderTeamTitle(object, htmlElement) {
  let childs = `<div class="title-container">
                  <h2>${object.team.name}</h2>
                  <img src="https://test-api-sports-davm.b-cdn.net/football/teams/${object.team.id}.png" alt="${object.team.name}" loading="lazy" onerror="this.src='/images/onerror.png';">
                  </div>
                <div class="title-container league">
                  <a href="/leagues/league-detail.html?leagueId=${object.league.id}&season=${object.league.season}" title="Show ${object.league.name} page">
                  <p>${object.league.name} &#8599</p>
                  </a>
                </div>`;
  htmlElement.insertAdjacentHTML('afterbegin', childs);
}

function teamStatisticsTemplate(object, teamPosition, htmlElement) {
  let html = `<div class="statistic-container">
                <p class="statistic">Position</p>
                <p>${teamPosition}</p>
              </div>
              <div class="statistic-container">
                <p class="statistic">Played</p>
                <p>${object.fixtures.played.total}</p>
              </div>
              <div class="statistic-container">
                <p class="statistic">Won</p>
                <p>${object.fixtures.wins.total}</p>
              </div>
              <div class="statistic-container">
                <p class="statistic">Drawn</p>
                <p>${object.fixtures.draws.total}</p>
              </div>
              <div class="statistic-container">
                <p class="statistic">Lost</p>
                <p>${object.fixtures.loses.total}</p>
              </div>
              <div class="statistic-container">
                <p class="statistic" title="Goals For">GF</p>
                <p>${object.goals.for.total.total}</p>
              </div>
              <div class="statistic-container">
                <p class="statistic" title="Goals Against">GA</p>
                <p>${object.goals.against.total.total}</p>
              </div>
              <div class="statistic-container">
                <p class="statistic" title="Goal Difference">GD</p>
                <p>${Number(object.goals.for.total.total) - Number(object.goals.against.total.total)}</p>
              </div>
              <div class="statistic-container">
                <p class="statistic">Points</p>
                <p>${Number(object.fixtures.wins.total) * 3 + Number(object.fixtures.draws.total) * 1 + Number(object.fixtures.loses.total) * 0}</p>
              </div>`;

  htmlElement.insertAdjacentHTML('afterbegin', html);
}

function filterByPosition(element, list) {
  let value = element.value;
  let myNewList = list;
  switch (value) {
    case 'Goalkeeper':
      myNewList = list.filter((player) => player.position === 'Goalkeeper');
      break;
    case 'Defender':
      myNewList = list.filter((player) => player.position === 'Defender');
      break;
    case 'Midfielder':
      myNewList = list.filter((player) => player.position === 'Midfielder');
      break;
    case 'Attacker':
      myNewList = list.filter((player) => player.position === 'Attacker');
      break;
    default:
      myNewList = list;
      break;
  }
  return myNewList;
}

function teamDataObject(teamData, position, season) {
  const teamId = teamData.team.id;
  const teamName = teamData.team.name;
  const teamLogo = `https://test-api-sports-davm.b-cdn.net/football/teams/${teamId}.png`;
  const teamLeagueId = teamData.league.id;
  const teamLeagueName = teamData.league.name;
  const teamLeagueLogo = `https://test-api-sports-davm.b-cdn.net/football/leagues/${teamLeagueId}.png`;
  const teamPosition = Number(position);
  const teamSeason = Number(season);
  const teamLeaguePage = `/leagues/league-detail.html?leagueId=${teamLeagueId}&season=${teamSeason}`;
  const teamPage = `/team/index.html?leagueId=${teamLeagueId}&season=${teamSeason}&teamId=${teamId}&position=${teamPosition}`;

  const myObject = {
    category: 'team',
    id: teamId,
    name: teamName,
    logo: teamLogo,
    league_id: teamLeagueId,
    league_name: teamLeagueName,
    league_logo: teamLeagueLogo,
    team_position: teamPosition,
    team_season: teamSeason,
    team_url: teamPage,
    league_url: teamLeaguePage,
  };

  return myObject;
}

function hoverEffect() {
  const elementos = document.querySelectorAll('.player-card');

  elementos.forEach((elemento) => {
    elemento.addEventListener('mouseenter', () => {
      elementos.forEach((otroElemento) => {
        if (otroElemento !== elemento) {
          otroElemento.classList.add('blurEffect');
        }
      });
    });

    elemento.addEventListener('mouseleave', () => {
      elementos.forEach((otroElemento) => {
        otroElemento.classList.remove('blurEffect');
      });
    });
  });
}

export default class TeamDetails {
  constructor(
    parentElement,
    matchDataSource,
    leagueId,
    season,
    teamId,
    position,
    playerDataSource,
  ) {
    this.parentElement = parentElement;
    this.matchDataSource = matchDataSource;
    this.leagueId = leagueId;
    this.season = season;
    this.teamId = teamId;
    this.position = position;
    this.playerDataSource = playerDataSource;
    this.teamGames = null;
    this.teamSquad = null;
    this.teamStatistics = null;
  }

  async initTeamInfo() {
    const heart = document.querySelector('#heartFavorite');
    const message = document.querySelector('#myFavMsg');
    await this.renderTeamStatistics();
    checkExistingItem(
      'teams',
      teamDataObject(this.teamStatistics, this.position, this.season),
      heart,
      message,
    );
    addMyFavorite(
      'teams',
      teamDataObject(this.teamStatistics, this.position, this.season),
      heart,
      message,
    );
    await this.renderTeamSquad();
    await this.renderTeamGames();
    hoverEffect();
  }

  async getTeamStatistics() {
    try {
      const response = await fetch(
        `${BASE_URL}teams/statistics?league=${this.leagueId}&season=${this.season}&team=${this.teamId}`,
        requestOptions,
      );
      const data = await response.json();
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
      const teamSquad = data.response[0].players;
      return teamSquad;
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

  async renderTeamStatistics() {
    this.teamStatistics = await this.getTeamStatistics();
    if (this.teamStatistics) {
      const titleElement = document.querySelector('#team-title');
      renderTeamTitle(this.teamStatistics, titleElement);
      teamStatisticsTemplate(
        this.teamStatistics,
        this.position,
        this.parentElement,
      );
    } else {
      const mainElement = document.querySelector('#team-main');
      mainElement.innerHTML = `<h2 class="sorry-msg">Sorry, we don't have information for this team</h2>`;
    }
  }

  async renderTeamSquad() {
    this.teamSquad = await this.getTeamSquad();
    if (this.teamSquad && this.teamSquad.length > 0) {
      this.playerDataSource.renderPlayerCardData(
        this.teamSquad,
        this.season,
        this.leagueId,
        this.position,
      );

      const selectElement = document.querySelector('#sortSelectPos');
      selectElement.addEventListener('change', () => {
        const squadElement = document.querySelector('#teamSquad');
        let filteredSquad = filterByPosition(selectElement, this.teamSquad);
        squadElement.innerHTML = '';
        this.playerDataSource.renderPlayerCardData(
          filteredSquad,
          this.season,
          this.leagueId,
          this.position,
        );
      });
    } else {
      const sectionElement = document.querySelector('#squad-section');
      sectionElement.innerHTML = `<h2 class="sorry-msg">Sorry, we don't have this team squad</h2>`;
    }
  }

  async renderTeamGames() {
    this.teamGames = await this.getTeamGames();
    if (this.teamGames && this.teamGames.length > 0) {
      this.teamGames = this.teamGames.sort(
        (a, b) => new Date(b.fixture.date) - new Date(a.fixture.date),
      );
      this.matchDataSource.renderLeagueGamesData(this.teamGames);
      const todayGameElement = document.querySelector('#today-gamesCont');
      const todayGame = filterCurrentGame(this.teamGames);
      if (todayGame.length > 0) {
        this.matchDataSource.renderDataCurrentMatch(
          todayGame,
          todayGameElement,
        );
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
    } else {
      const sectionElement = document.querySelector('#games-section');
      sectionElement.innerHTML = `<h2 class="sorry-msg">Sorry, there are no fixtures for this team</h2>`;
    }
  }
}
