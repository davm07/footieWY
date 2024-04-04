import { loadHeaderFooter } from './utils.mjs';
import LeagueDetails from './LeagueDetails.mjs';

loadHeaderFooter();
const parentElement = document.querySelector('#leaguesContent');
const leagueDetails = new LeagueDetails(parentElement);
leagueDetails.initLeagues();
