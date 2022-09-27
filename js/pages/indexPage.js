import {UINavbar} from "./components/UINavbar.js";
import {StructBuilder} from "../modules/StructBuilder.js";
import {UNIT_TYPES} from "../modules/Constants.js";
import {Player} from "../modules/Player.js";
import {UIGame} from "./components/UIGame.js";
import {GameState} from "../modules/state/GameState.js";

(new UINavbar()).init('nav-wrapper');

const structBuilder = new StructBuilder();

const player = new Player('Player');
const enemy = new Player('Enemy');

player.fleet.addStruct(structBuilder.make(UNIT_TYPES.STAR_FIGHTER));
player.fleet.addStruct(structBuilder.make(UNIT_TYPES.SPACE_FRIGATE));
player.fleet.addStruct(structBuilder.make(UNIT_TYPES.GALACTIC_BATTLESHIP));
player.fleet.addStruct(structBuilder.make(UNIT_TYPES.STAR_FIGHTER));
player.fleet.addStruct(structBuilder.make(UNIT_TYPES.FIGHTER_JET));
player.fleet.addStruct(structBuilder.make(UNIT_TYPES.HIGH_ALTITUDE_INTERCEPTOR));
player.fleet.addStruct(structBuilder.make(UNIT_TYPES.STEALTH_BOMBER));
player.fleet.addStruct(structBuilder.make(UNIT_TYPES.FIGHTER_JET));
player.fleet.addStruct(structBuilder.make(UNIT_TYPES.TANK));
player.fleet.addStruct(structBuilder.make(UNIT_TYPES.ARTILLERY));
player.fleet.addStruct(structBuilder.make(UNIT_TYPES.SAM_LAUNCHER));
player.fleet.addStruct(structBuilder.make(UNIT_TYPES.TANK));
player.fleet.addStruct(structBuilder.make(UNIT_TYPES.SUB));
player.fleet.addStruct(structBuilder.make(UNIT_TYPES.DESTROYER));
player.fleet.addStruct(structBuilder.make(UNIT_TYPES.CRUISER));
player.fleet.addStruct(structBuilder.make(UNIT_TYPES.SUB));

enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.STAR_FIGHTER));
enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.SPACE_FRIGATE));
enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.GALACTIC_BATTLESHIP));
enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.STAR_FIGHTER));
enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.FIGHTER_JET));
enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.HIGH_ALTITUDE_INTERCEPTOR));
enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.STEALTH_BOMBER));
enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.FIGHTER_JET));
enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.TANK));
enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.ARTILLERY));
enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.SAM_LAUNCHER));
enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.TANK));
enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.SUB));
enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.DESTROYER));
enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.CRUISER));
enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.SUB));

const state = new GameState();
state.player = player;
state.enemy = enemy;
state.metrics.player.initialStructCount = player.fleet.numberOfStructs() + 1; // + 1 for command struct
state.metrics.enemy.initialStructCount = player.fleet.numberOfStructs() + 1; // + 1 for command struct
state.gameContainerId = 'main-content-wrapper';
state.modalContainerId = 'modalContainer';
state.offcanvasId = 'offcanvasBottom';
state.turn = state.player;

const game = new UIGame(state);
game.render();
game.initOneTimeListeners();
