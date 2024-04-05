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

let state = {
  querySet: [],
  page: 1,
  rows: 8,
  pageLimit: 7,
};

function leagueCardTemplate(element) {
  return `<div class="league-container" data-id="${element.league.id}">

              <img src="https://test-api-sports-davm.b-cdn.net/football/leagues/${element.league.id}.png" alt="${element.league.name} - ${element.country.name}" loading="lazy">

            <h3 class="leagueTitle">${element.league.name} <span class="leagueCountry">${element.country.name}</span></h3>
          </div>`;
}

function leagueTableElements(element) {
  return `<tr>
            <td data-cell="Country" class="fade-transition">${element.country.name}</td>
            <td data-cell="Name" class="fade-transition">
            <div class="containerName"><img src="https://test-api-sports-davm.b-cdn.net/football/leagues/${element.league.id}.png" alt="${element.league.name} - ${element.country.name}" loading="lazy" class="tableImg"><span>${element.league.name}</span></div></td>
            <td data-cell="Season" class="fade-transition">${element.seasons.at(-1).year}</td>
            <td data-cell="Season start" class="fade-transition">${element.seasons.at(-1).start}</td>
            <td data-cell="Season end" class="fade-transition">${element.seasons.at(-1).end}</td>
            <td data-cell="Details" class="fade-transition"><a href="league-detail.html?leagueId=${element.league.id}&season=${element.seasons.at(-1).year}" class="league-link">Show ${element.league.name} details &#8599</a></td>
          </tr>`;
}

function pagination(querySet, currentPage, rowsNumber) {
  let trimStart = (currentPage - 1) * rowsNumber;
  let trimEnd = trimStart + rowsNumber;

  let trimmedData = querySet.slice(trimStart, trimEnd);

  let myPages = Math.ceil(querySet.length / rowsNumber);

  return {
    querySet: trimmedData,
    pages: myPages,
  };
}

function paginationButtons(currentPages) {
  let pageWrapper = document.querySelector('#paginationBtn');
  pageWrapper.innerHTML = '';

  let maxBtnLeft = state.page - Math.floor(state.pageLimit / 2);
  let maxBtnRight = state.page + Math.floor(state.pageLimit / 2);

  if (maxBtnLeft < 1) {
    maxBtnLeft = 1;
    maxBtnRight = state.pageLimit;
  }

  if (maxBtnRight > currentPages) {
    maxBtnLeft = currentPages - (state.pageLimit - 1);

    if (maxBtnLeft < 1) {
      maxBtnLeft = 1;
    }

    maxBtnRight = currentPages;
  }

  for (let page = maxBtnLeft; page <= maxBtnRight; page++) {
    pageWrapper.innerHTML += `<button value=${page} class="pageBtn">${page}</button>`;
  }

  if (state.page != 1) {
    pageWrapper.innerHTML =
      `<button value=${1} class="pageBtn">&#171; First</button>` +
      pageWrapper.innerHTML;
  }

  if (state.page != currentPages) {
    pageWrapper.innerHTML += `<button value=${currentPages} class="pageBtn">Last &#187;</button>`;
  }
}

function searchLeagues(value, leaguesList) {
  let filteredLeagues = [];

  for (let i = 0; i < leaguesList.length; i++) {
    let myValue = value.toLowerCase();
    let leagueName = leaguesList[i].league.name.toLowerCase();

    if (leagueName.includes(myValue)) {
      filteredLeagues.push(leaguesList[i]);
    }
  }

  return filteredLeagues;
}

function leagueTitle(list, parentElement) {
  const leagueTitleH2 = `<h2><div class="imgLeagueInfo"><img src="https://test-api-sports-davm.b-cdn.net/football/leagues/${list[0].league.id}.png" alt="${list[0].league.name} - ${list[0].league.country}" loading="lazy"></div>${list[0].league.name} - ${list[0].league.country}</h2>`;
  parentElement.insertAdjacentHTML('afterbegin', leagueTitleH2);
}

function leagueInfoTable(element) {
  const standings = element.league.standings[0];
  let html = '';
  standings.forEach((club) => {
    html += `<tr data-id="${club.team.id}">
            <td data-cell="Position" class="fade-transition">${club.rank}</td>
            <td data-cell="Club" class="fade-transition"><div class="containerName"><img src="https://test-api-sports-davm.b-cdn.net/football/teams/${club.team.id}.png" alt="${club.team.name}" loading="lazy" class="tableImg"><span>${club.team.name}</span></div><a href="/team/index.html?leagueId=${element.league.id}&season=${element.league.season}&teamId=${club.team.id}">Show Club Page &#8599</a></td>
            <td data-cell="Played" class="fade-transition">${club.all.played}</td>
            <td data-cell="Won" class="fade-transition">${club.all.win}</td>
            <td data-cell="Drawn" class="fade-transition">${club.all.draw}</td>
            <td data-cell="Lost" class="fade-transition">${club.all.lose}</td>
            <td data-cell="Goals For" class="fade-transition">${club.all.goals.for}</td>
            <td data-cell="Goals Against" class="fade-transition">${club.all.goals.against}</td>
            <td data-cell="Goal Difference" class="fade-transition">${club.goalsDiff}</td>
            <td data-cell="Points" class="fade-transition">${club.points}</td>
            </tr>`;
  });

  return html;
}

export default class LeagueDetails {
  constructor(parentElement) {
    this.parentElement = parentElement;
    this.leaguesList = null;
  }

  async initLeagues() {
    this.leaguesList = await this.getCurrentLeagues();
    this.renderCurrentLeagues(this.leaguesList);

    // let parentTable = document.querySelector('#leaguesContent');
    const searchInput = document.querySelector('#searchLeague');
    searchInput.addEventListener('keyup', () => {
      const searchTerm = searchInput.value;
      const filteredLeagues = searchLeagues(searchTerm, this.leaguesList);
      if (filteredLeagues.length > 0) {
        this.parentElement.innerHTML = '';
        this.renderCurrentLeagues(filteredLeagues);
      } else {
        this.parentElement.innerHTML = `<p>Sorry we don't have a league/competition with that name</p>`;
        document.querySelector('#paginationBtn').innerHTML = '';
      }
    });
  }

  async renderTopLeagues() {
    const leaguesData = await this.getTopCompetitions();
    if (leaguesData != null && leaguesData.length > 0) {
      this.renderDataTopLeagues(leaguesData);
    } else {
      this.parentElement.innerHTML = `<h3>Sorry :( we couldn't find any league. Come back later!</h3>`;
    }
  }

  async getTopCompetitions() {
    let leagues_ids = [2, 3, 39, 140, 78, 61, 135];
    try {
      const response = await fetch(`${BASE_URL}leagues`, requestOptions);
      const data = await response.json();
      const elements = data.response;
      const topLeagues = elements.filter((item) =>
        leagues_ids.includes(item.league.id),
      );
      return topLeagues;
    } catch (err) {
      console.log(err);
    }
  }

  async getCurrentLeagues() {
    try {
      const response = await fetch(`${BASE_URL}leagues`, requestOptions);
      const data = await response.json();
      const elements = data.response;
      const todayDate = new Date();
      const currentLeagues = elements.filter(
        (league) =>
          league.league.type == 'League' &&
          league.seasons.some(
            (season) =>
              new Date(season.end).getTime() >= todayDate.getTime() &&
              new Date(season.start) <= todayDate.getTime(),
          ),
      );
      return currentLeagues;
    } catch (err) {
      console.log(err);
    }
  }

  async initLeagueInfo(leagueId, seasonYear, gamesLeague) {
    const leagueDetails = await this.getLeagueInfo(leagueId, seasonYear);
    const parentElement = document.querySelector('.league-info');
    if (leagueDetails.length > 0) {
      leagueTitle(leagueDetails, parentElement);
      this.renderLeagueInfo(leagueDetails);
      const leagueGames = await gamesLeague.renderLeagueFixtures(
        leagueId,
        seasonYear,
      );
      const currentGames = document.querySelector('#leagueGamesLive');
      const leagueCurrentGames = await gamesLeague.renderLeagueCurrentFixtures(
        leagueId,
        seasonYear,
        currentGames,
      );
    } else {
      parentElement.innerHTML = `<h2>Sorry we don't have any information about this league</h2>`;
      parentElement.nextElementSibling.remove();
    }
  }

  async getLeagueInfo(leagueId, seasonYear) {
    try {
      const responseLeague = await fetch(
        `${BASE_URL}standings?league=${leagueId}&season=${seasonYear}`,
        requestOptions,
      );
      const dataLeague = await responseLeague.json();
      return dataLeague.response;
    } catch (err) {
      console.log(err);
    }
  }

  renderCurrentLeagues(listElements) {
    const leaguesList = listElements;
    state.querySet = leaguesList;

    let dataLeagues = pagination(state.querySet, state.page, state.rows);
    if (leaguesList != null && leaguesList.length > 0) {
      this.renderDataCurrentLeagues(dataLeagues.querySet);
    }

    paginationButtons(dataLeagues.pages);

    let pagesBtns = document.querySelectorAll('.pageBtn');

    pagesBtns.forEach((pageBtn) => {
      pageBtn.addEventListener('click', () => {
        this.parentElement.innerHTML = '';
        state.page = Number(pageBtn.value);
        this.renderCurrentLeagues(state.querySet);
      });
    });
  }

  renderLeagueInfo(list) {
    renderListWithTemplate(leagueInfoTable, this.parentElement, list);
  }

  renderDataTopLeagues(list) {
    renderListWithTemplate(leagueCardTemplate, this.parentElement, list);
  }

  renderDataCurrentLeagues(list) {
    renderListWithTemplate(leagueTableElements, this.parentElement, list);
  }
}
