import { renderListWithTemplate } from './utils.mjs';

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
  constructor(dataSource, parentElement) {
    this.dataSource = dataSource;
    this.parentElement = parentElement;
  }

  async initMatch() {
    const matchData = await this.dataSource.getFixtures();
    console.log(matchData);
    if (matchData != null && matchData.length > 0) {
      this.renderData(matchData);
    } else {
      this.parentElement.innerHTML = `<h3>There are currently no matches available. Please check back later.</h3>`;
    }
  }

  renderData(list) {
    renderListWithTemplate(matchCardTemplate, this.parentElement, list);
  }
}
