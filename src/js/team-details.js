import MatchDetails from './MatchDetails.mjs';
import PlayerDetails from './PlayerDetails.mjs';
import TeamDetails from './TeamDetails.mjs';
import { loadHeaderFooter, getParams } from './utils.mjs';

loadHeaderFooter();

const leagueId = getParams('leagueId');
const season = getParams('season');
const teamId = getParams('teamId');
const position = getParams('position');

const statisticsElement = document.querySelector('#teamStatistics');
const gamesTeamElement = document.querySelector('#team-gamesCont');
const playerGridElement = document.querySelector('#teamSquad');

const playerDetails = new PlayerDetails(
  playerGridElement,
  null,
  null,
  null,
  position,
);
const gameDetails = new MatchDetails(gamesTeamElement);

const teamDetails = new TeamDetails(
  statisticsElement,
  gameDetails,
  leagueId,
  season,
  teamId,
  position,
  playerDetails,
);

// teamDetails.getTeamSquad(teamId);
// teamDetails.getTeamStatistics(leagueId, season, teamId);
teamDetails.initTeamInfo();
