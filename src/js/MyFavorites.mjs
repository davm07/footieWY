import {
  getLocalStorage,
  renderListWithTemplate,
  deleteFromLocalStorage,
} from './utils.mjs';

function teamCardFavorite(object) {
  return `<div class="card-favorite">
            <div class="info-wraper">
              <div class="team-wraper">
                <a href=${object.team_url} class="link-favorite">
                  <h3>${object.name} &#8599</h3>
                </a>
                <img src=${object.logo} alt=${object.name} loading="lazy" class="favorite-imgB">
              </div>
              <div class="team-wraper">
                <a href=${object.league_url} class="link-favorite">
                  <p>${object.league_name} &#8599</p>
                </a>
                <img src=${object.league_logo} alt=${object.league_name} loading="lazy" class="favorite-imgS">
              </div>
            </div>
            <div class="remove-wraper">
              <button class="remove-btn team" data-id=${object.id}>&#9866;</button>
              <span>Remove</span>
            </div>
          </div>`;
}

function playerCardFavorite(object) {
  return `<div class="card-favorite">
            <div class="info-wraper">
              <div class="player-wraper">
                <a href=${object.player_url} class="link-favorite">
                  <h3>${object.name} &#8599</h3>
                </a>
                <img src=${object.player_photo} alt=${object.name} loading="lazy" class="favorite-imgB">
              </div>
              <div class="player-wraper team-league">
                <div class="inside-wraper">
                  <a href=${object.team_url} class="link-favorite">
                    <p>${object.team_name} &#8599</p>
                  </a>
                  <img src=${object.team_logo} alt=${object.team_name} loading="lazy" class="favorite-imgS">
                </div>
                <div class="inside-wraper">
                  <a href=${object.league_url} class="link-favorite">
                    <p>${object.league_name} &#8599</p>
                  </a>
                  <img src=${object.league_logo} alt=${object.league_name} loading="lazy" class="favorite-imgS">
                </div>
              </div>
            </div>
            <div class="remove-wraper">
              <button class="remove-btn player" data-id=${object.id}>&#9866;</button>
              <span>Remove</span>
            </div>
          </div>`;
}

function findItem(list, dataId) {
  const newItem = list.find((item) => item.id == dataId);
  return newItem;
}

function removeItem(htmlElement, key, data) {
  htmlElement.addEventListener('click', () => {
    const dataId = htmlElement.getAttribute('data-id');
    const newItem = findItem(data, dataId);
    deleteFromLocalStorage(key, newItem);
    window.location.reload();
  });
}

export default class MyFavorites {
  constructor(teamsElement, playersElement) {
    this.teamsElement = teamsElement;
    this.playersElement = playersElement;
  }

  initMyFavorites() {
    const teams = getLocalStorage('teams');
    const players = getLocalStorage('players');

    if (teams && teams.length > 0) {
      this.renderTeamsDataFavorites(teams);
      const teamBtns = document.querySelectorAll('.remove-btn.team');
      teamBtns.forEach((button) => removeItem(button, 'teams', teams));
    } else {
      this.teamsElement.innerHTML = `<h4>You haven't add any team to your favorite list</h4>`;
    }

    if (players && players.length > 0) {
      this.renderPlayersDataFavorites(players);
      const playerBtns = document.querySelectorAll('.remove-btn.player');
      playerBtns.forEach((button) => removeItem(button, 'players', players));
    } else {
      this.playersElement.innerHTML = `<h4>You haven't add any player to your favorite list</h4>`;
    }
  }

  renderTeamsDataFavorites(list) {
    renderListWithTemplate(teamCardFavorite, this.teamsElement, list);
  }

  renderPlayersDataFavorites(list) {
    renderListWithTemplate(playerCardFavorite, this.playersElement, list);
  }
}
