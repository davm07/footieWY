import LeagueDetails from './LeagueDetails.mjs';
import MatchDetails from './MatchDetails.mjs';
import { loadHeaderFooter, getParams } from './utils.mjs';

loadHeaderFooter();
const leagueId = getParams('leagueId');
const seasonYear = getParams('season');
const parentElement = document.querySelector('#teamsPosition');
const gamesElement = document.querySelector('#leagueGames');
const leagueInfo = new LeagueDetails(parentElement);
const leagueGames = new MatchDetails(gamesElement);
leagueInfo.initLeagueInfo(leagueId, seasonYear, leagueGames);
document.querySelector('#return-league').addEventListener('click', () => {
  const protocol = window.location.protocol;
  const domain = window.location.hostname;
  const port = window.location.port;
  const path = window.location.pathname.split('/')[1];
  let targetURL = '';
  if (port) {
    targetURL =
      protocol + '//' + domain + ':' + port + '/' + path + '/' + 'index.html';
  } else {
    targetURL = protocol + '//' + domain + '/' + path + '/' + 'index.html';
  }
  window.location.href = targetURL;
});
