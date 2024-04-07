import { renderListWithTemplate } from './utils.mjs';

// const BASE_URL = import.meta.env.VITE_SERVER_URL;
// const API_KEY = import.meta.env.VITE_API_KEY;
// const API_HOST = import.meta.env.VITE_API_HOST;

// let myHeaders = new Headers();
// myHeaders.append('x-rapidapi-key', API_KEY);
// myHeaders.append('x-rapidapi-host', API_HOST);

// const requestOptions = {
//   method: 'GET',
//   headers: myHeaders,
//   redirect: 'follow',
// };

function playerCardTemplate(player, season) {
  return `<div class="player-card" data-id="${player.id}">
              <div class="player-img">
                <img src="https://test-api-sports-davm.b-cdn.net/football/players/${player.id}.png" alt="${player.name}" loading="lazy" width="150" height="150" onerror="this.src='/images/onerror.png';">
                <div class="player-info">
                  <a href="/player/index.html?playerId=${player.id}&season=${season}" class="player-link">
                    <p class="playerNameNum">${player.name} - #${player.number}</p>
                    <p class="player-position">${player.position} &#8599</p>
                  </a>
                </div>
              </div>
            </div>`;
}

export default class PlayerDetails {
  constructor(playerContainerElement) {
    this.playerContainer = playerContainerElement;
  }

  renderPlayerCardData(list) {
    renderListWithTemplate(playerCardTemplate, this.playerContainer, list);
  }
}
