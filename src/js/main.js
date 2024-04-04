import { loadHeaderFooter } from './utils.mjs';
import MatchDetails from './MatchDetails.mjs';
import LeagueDetails from './LeagueDetails.mjs';

loadHeaderFooter();

const parentElementMatch = document.querySelector('#matches-container');
const matchDetails = new MatchDetails(parentElementMatch);
matchDetails.renderCurrentGames();

const parentElementLeague = document.querySelector('#leagues-container');
const leagueDetails = new LeagueDetails(parentElementLeague);
leagueDetails.renderTopLeagues();
