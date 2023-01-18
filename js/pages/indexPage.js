import {UINavbar} from "./components/UINavbar.js";
import {Player} from "../modules/Player.js";
import {UIGame} from "./components/UIGame.js";
import {GameState} from "../modules/state/GameState.js";
import {Planet} from "../modules/Planet.js";

(new UINavbar()).init('nav-wrapper');

const player = new Player('Player');
const enemy = new Player('Enemy');

const state = new GameState();
state.player = player;
state.enemy = enemy;
state.metrics.player.initialStructCount = player.fleet.numberOfStructs() + 1; // + 1 for command struct
state.metrics.enemy.initialStructCount = player.fleet.numberOfStructs() + 1; // + 1 for command struct
state.gameContainerId = 'main-content-wrapper';
state.modalContainerId = 'modalContainer';
state.offcanvasId = 'offcanvasBottom';
state.offcanvasTopId = 'offcanvasTop';
state.turn = state.player;
// state.arePlanetsEnabled = (new URLSearchParams(window.location.search)).get('planets') !== 'false';

if (state.arePlanetsEnabled) {
  state.player.planet = new Planet(state.player.id);
  state.enemy.planet = new Planet(state.enemy.id);
}

const game = new UIGame(state);
game.render();
game.initOneTimeListeners();
