import {
  renderListWithTemplate,
  checkExistingItem,
  addMyFavorite,
} from './utils.mjs';

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

function playerCardTemplate(player, season, leagueId, teamPosition) {
  return `<div class="player-card" data-id="${player.id}">
              <div class="player-img">
                <img src="https://test-api-sports-davm.b-cdn.net/football/players/${player.id}.png" alt="${player.name}" loading="lazy" width="150" height="150" onerror="this.src='/images/onerror.png';">
                <div class="player-info">
                  <a href="/player/index.html?playerId=${player.id}&leagueId=${leagueId}&season=${season}&teamPosition=${teamPosition}" class="player-link">
                    <p class="playerNameNum">${player.name} - #${player.number}</p>
                    <p class="player-position">${player.position} &#8599</p>
                  </a>
                </div>
              </div>
            </div>`;
}

function playerProfile(player, teamPositon) {
  return `<img src="https://test-api-sports-davm.b-cdn.net/football/players/${player.player.id}.png" alt="${player.player.name}" loading="lazy" width="150" height="150" onerror="this.src='/images/onerror.png';">
          <div class="profile-container">
            <div class="detail-container">
              <p>Birth Date</p>
              <p class="detail-info">${player.player.birth.date}</p>
            </div>
            <div class="detail-container">
              <p>Country</p>
              <p class="detail-info">${player.player.birth.country}</p>
            </div>
            <div class="detail-container">
              <p>Age</p>
              <p class="detail-info">${player.player.age}</p>
            </div>
            <div class="detail-container">
              <p>Height</p>
              <p class="detail-info">${player.player.height}</p>
            </div>
            <div class="detail-container">
              <p>Weight</p>
              <p class="detail-info">${player.player.weight}</p>
            </div>
            <div class="detail-container">
              <p>Team</p>
              <div class="detail-team">
                <img src="https://test-api-sports-davm.b-cdn.net/football/teams/${player.statistics[0].team.id}.png" alt="${player.statistics[0].team.name}" class="detail-img" loading="lazy" onerror="this.src='/images/onerror.png';">
                <a href="/team/index.html?leagueId=${player.statistics[0].league.id}&season=${player.statistics[0].league.season}&teamId=${player.statistics[0].team.id}&position=${teamPositon}" title="Show ${player.statistics[0].team.name} page"><p class="detail-info">${player.statistics[0].team.name}</p></a>
              </div>
            </div>
            <div class="detail-container">
              <p>Position</p>
              <p class="detail-info">${player.statistics[0].games.position}</p>
            </div>
            <div class="detail-container">
              <p>League</p>
              <div class="detail-league">
                <img src="https://test-api-sports-davm.b-cdn.net/football/leagues/${player.statistics[0].league.id}.png" alt="${player.statistics[0].league.name}" class="detail-img" loading="lazy" onerror="this.src='/images/onerror.png';">
                <a href="/leagues/league-detail.html?leagueId=${player.statistics[0].league.id}&season=${player.statistics[0].league.season}" title="Show ${player.statistics[0].league.name} page"><p class="detail-info">${player.statistics[0].league.name}</p></a>
              </div>
            </div>
            <div class="detail-container">
              <p>Season</p>
              <p class="detail-info">${player.statistics[0].league.season}</p>
            </div>
            <div class="detail-container">
              <p>League Appearences</p>
              <p class="detail-info">${player.statistics[0].games.appearences}</p>
            </div>
            <div class="detail-container">
              <p>League Goals</p>
              <p class="detail-info">${player.statistics[0].goals.total}</p>
            </div>
            <div class="detail-container">
              <p>League Assists</p>
              <p class="detail-info">${player.statistics[0].goals.assists !== null ? player.statistics[0].goals.assists : 0}</p>
            </div>
          </div>`;
}

function renderPlayerTitle(list, htmlElement) {
  let html = `<h2>${list[0].player.firstname} ${list[0].player.lastname}</h2>`;
  htmlElement.insertAdjacentHTML('afterbegin', html);
}

function playerDataObject(playerData) {
  const playerId = playerData[0].player.id;
  const playerName = playerData[0].player.name;
  const playerPhoto = `https://test-api-sports-davm.b-cdn.net/football/players/${playerId}.png`;
  const playerAge = playerData[0].player.age;
  const teamId = playerData[0].statistics[0].team.id;
  const teamName = playerData[0].statistics[0].team.name;
  const teamLogo = `https://test-api-sports-davm.b-cdn.net/football/teams/${teamId}.png`;
  const leagueId = playerData[0].statistics[0].league.id;
  const leagueName = playerData[0].statistics[0].league.name;
  const leagueLogo = `https://test-api-sports-davm.b-cdn.net/football/leagues/${leagueId}.png`;
  const playerSeason = playerData[0].statistics[0].league.season;

  const myObject = {
    category: 'player',
    id: playerId,
    name: playerName,
    player_photo: playerPhoto,
    age: playerAge,
    team_id: teamId,
    team_name: teamName,
    team_logo: teamLogo,
    league_id: leagueId,
    league_name: leagueName,
    league_logo: leagueLogo,
    player_season: playerSeason,
  };

  return myObject;
}

export default class PlayerDetails {
  constructor(
    playerContainerElement,
    playerId,
    leagueId,
    seasonYear,
    teamPosition,
  ) {
    this.playerContainer = playerContainerElement;
    this.playerId = playerId;
    this.leagueId = leagueId;
    this.seasonYear = seasonYear;
    this.teamPosition = teamPosition;
    this.playerData = null;
  }

  async initPlayerDetails() {
    this.playerData = await this.getPlayerData();

    const titleElement = document.querySelector('#player-title');
    const heart = document.querySelector('#heartFavorite');
    const message = document.querySelector('#myFavMsg');

    checkExistingItem(
      'players',
      playerDataObject(this.playerData),
      heart,
      message,
    );
    addMyFavorite('players', playerDataObject(this.playerData), heart, message);
    renderPlayerTitle(this.playerData, titleElement);
    this.renderPlayerProfileData(this.playerData, this.teamPosition);
  }

  async getPlayerData() {
    try {
      const response = await fetch(
        `${BASE_URL}players?id=${this.playerId}&league=${this.leagueId}&season=${this.seasonYear}`,
        requestOptions,
      );
      const data = await response.json();
      console.log(data.response);
      return data.response;
    } catch (err) {
      console.log(err);
    }
  }

  renderPlayerCardData(list, season, leagueId, teamPosition) {
    const htmlStrings = list.map((element) =>
      playerCardTemplate(element, season, leagueId, teamPosition),
    );
    this.playerContainer.insertAdjacentHTML('afterbegin', htmlStrings.join(''));
  }

  renderPlayerProfileData(list, teamPosition) {
    const htmlStrings = list.map((element) =>
      playerProfile(element, teamPosition),
    );
    this.playerContainer.insertAdjacentHTML('afterbegin', htmlStrings.join(''));
  }
}
