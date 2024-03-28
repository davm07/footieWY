import { loadHeaderFooter } from './utils.mjs';
import MatchDetails from './MatchDetails.mjs';
import ExternalServices from './ExternalServices.mjs';

loadHeaderFooter();

const externalServices = new ExternalServices();
// externalServices.getFixtures();
const parentElement = document.querySelector('#matches-container');
const matchDetails = new MatchDetails(externalServices, parentElement);
matchDetails.init();
