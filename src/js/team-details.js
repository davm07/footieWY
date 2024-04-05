import { loadHeaderFooter, getParams } from './utils.mjs';

loadHeaderFooter();
const leagueId = getParams('leagueId');
const season = getParams('season');
const teamId = getParams('teamId');
