import { renderListWithTemplate } from './utils.mjs';

function leagueCardTemplate(element) {
  return `<div class="league-container" data-id="${element.league.id}">

              <img src="https://test-api-sports-davm.b-cdn.net/football/leagues/${element.league.id}.png" alt="${element.league.name} - ${element.country.name}" loading="lazy">

            <h3 class="leagueTitle">${element.league.name} <span class="leagueCountry">${element.country.name}</span></h3>
          </div>`;
}

export default class LeagueDetails {
  constructor(dataSource, parentElement) {
    this.dataSource = dataSource;
    this.parentElement = parentElement;
  }

  async initLeagues() {
    const leaguesData = await this.dataSource.getTopLeagues();
    console.log(leaguesData);
    if (leaguesData != null && leaguesData.length > 0) {
      this.renderData(leaguesData);
    } else {
      this.parentElement.innerHTML = `<h3>Sorry :( we couldn't find any league. Come back later!</h3>`;
    }
  }

  renderData(list) {
    renderListWithTemplate(leagueCardTemplate, this.parentElement, list);
  }
}
