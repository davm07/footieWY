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
