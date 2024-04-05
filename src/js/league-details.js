import LeagueDetails from './LeagueDetails.mjs';
import { loadHeaderFooter, getParams } from './utils.mjs';

loadHeaderFooter();
const leagueId = getParams('leagueId');
const seasonYear = getParams('season');
const parentElement = document.querySelector('.league-info');
const leagueInfo = new LeagueDetails(parentElement);
leagueInfo.initLeagueInfo(leagueId, seasonYear);
