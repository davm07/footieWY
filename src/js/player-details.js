import PlayerDetails from './PlayerDetails.mjs';
import { getParams, loadHeaderFooter } from './utils.mjs';

loadHeaderFooter();
const playerId = getParams('playerId');
const leagueId = getParams('leagueId');
const seasonYear = getParams('season');
const teamPosition = getParams('teamPosition');

const parentElement = document.querySelector('#player-container');
const playerDetails = new PlayerDetails(
  parentElement,
  playerId,
  leagueId,
  seasonYear,
  teamPosition,
);
playerDetails.initPlayerDetails();
