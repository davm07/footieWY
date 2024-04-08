import MyFavorites from './MyFavorites.mjs';
import { loadHeaderFooter } from './utils.mjs';

loadHeaderFooter();

const teamsElement = document.querySelector('#my-teams');
const playersElement = document.querySelector('#my-players');
const myFavorites = new MyFavorites(teamsElement, playersElement);

myFavorites.initMyFavorites();
