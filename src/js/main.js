import { loadHeaderFooter } from './utils.mjs';
import MatchDetails from './MatchDetails.mjs';
import ExternalServices from './ExternalServices.mjs';
import LeagueDetails from './LeagueDetails.mjs';

loadHeaderFooter();

const externalServices = new ExternalServices();
const parentElementMatch = document.querySelector('#matches-container');
const matchDetails = new MatchDetails(externalServices, parentElementMatch);
matchDetails.initMatch();

const parentElementLeague = document.querySelector('#leagues-container');
const leagueDetails = new LeagueDetails(externalServices, parentElementLeague);
leagueDetails.initLeagues();
