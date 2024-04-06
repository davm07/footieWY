import MatchDetails from './MatchDetails.mjs';
import TeamDetails from './TeamDetails.mjs';
import { loadHeaderFooter, getParams } from './utils.mjs';

loadHeaderFooter();
const leagueId = getParams('leagueId');
const season = getParams('season');
const teamId = getParams('teamId');
const parentTeamElement = document.querySelector('#team-details');
const gamesTeamElement = document.querySelector('#team-gamesCont');
const gameDetails = new MatchDetails(gamesTeamElement);
const teamDetails = new TeamDetails(
  parentTeamElement,
  gameDetails,
  leagueId,
  season,
  teamId,
);
// teamDetails.getTeamSquad(teamId);
// teamDetails.getTeamStatistics(leagueId, season, teamId);
teamDetails.renderTeamGames();
