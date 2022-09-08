import {UINavbar} from "./components/UINavbar.js";
import {StructBuilder} from "../modules/StructBuilder.js";
import {UNIT_TYPES} from "../modules/Constants.js";
import {UIStructDetails} from "./components/UIStructDetails.js";
import {Player} from "../modules/Player.js";
import {UIFleet} from "./components/UIFleet.js";

(new UINavbar()).init('nav-wrapper');

const structBuilder = new StructBuilder();

const player = new Player('Player');
const enemy = new Player('Enemy');
const thisPlayer = player;


const playerStarFighter = structBuilder.make(UNIT_TYPES.STAR_FIGHTER);
player.fleet.addStruct(playerStarFighter);
const playerSpaceFrigate = structBuilder.make(UNIT_TYPES.SPACE_FRIGATE);
playerSpaceFrigate.currentHealth = 2;
playerSpaceFrigate.defend(playerStarFighter);
player.fleet.addStruct(playerSpaceFrigate);
playerStarFighter.defend(playerSpaceFrigate);
player.fleet.addStruct(structBuilder.make(UNIT_TYPES.GALACTIC_BATTLESHIP));
const playerStarFighter2 = structBuilder.make(UNIT_TYPES.STAR_FIGHTER);
playerStarFighter2.defend(playerSpaceFrigate);
player.fleet.addStruct(playerStarFighter2);
player.fleet.addStruct(structBuilder.make(UNIT_TYPES.FIGHTER_JET));
const playerHighAltitudeInterceptor = structBuilder.make(UNIT_TYPES.HIGH_ALTITUDE_INTERCEPTOR);
playerHighAltitudeInterceptor.defend(playerSpaceFrigate);
player.fleet.addStruct(playerHighAltitudeInterceptor);
player.fleet.addStruct(structBuilder.make(UNIT_TYPES.STEALTH_BOMBER));
player.fleet.addStruct(structBuilder.make(UNIT_TYPES.FIGHTER_JET));
// player.fleet.addStruct(structBuilder.make(UNIT_TYPES.TANK));
player.fleet.addStruct(structBuilder.make(UNIT_TYPES.ARTILLERY));
const playerSamLauncher = structBuilder.make(UNIT_TYPES.SAM_LAUNCHER);
playerSamLauncher.defend(playerSpaceFrigate);
player.fleet.addStruct(playerSamLauncher);
player.fleet.addStruct(structBuilder.make(UNIT_TYPES.TANK));
// player.fleet.addStruct(structBuilder.make(UNIT_TYPES.SUB));
player.fleet.addStruct(structBuilder.make(UNIT_TYPES.DESTROYER));
player.fleet.addStruct(structBuilder.make(UNIT_TYPES.CRUISER));
const playerSub2 = structBuilder.make(UNIT_TYPES.SUB);
playerSub2.defend(playerSpaceFrigate);
player.fleet.addStruct(playerSub2);

enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.STAR_FIGHTER));
enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.SPACE_FRIGATE));
enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.GALACTIC_BATTLESHIP));
enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.STAR_FIGHTER));
enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.FIGHTER_JET));
enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.HIGH_ALTITUDE_INTERCEPTOR));
enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.STEALTH_BOMBER));
// enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.FIGHTER_JET));
enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.TANK));
enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.ARTILLERY));
enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.SAM_LAUNCHER));
enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.TANK));
enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.SUB));
enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.DESTROYER));
// enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.CRUISER));
// enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.SUB));

const playerFleetUI = new UIFleet(player);
const enemyFleetUI = new UIFleet(enemy);
document.getElementById('playerFleet').innerHTML = playerFleetUI.render(player);
document.getElementById('enemyFleet').innerHTML = enemyFleetUI.render(player);

const players = [player, enemy];


const STRUCT_ACTION_TYPES = {
  ATTACK_PRIMARY: 'ATTACK_PRIMARY',
  ATTACK_SECONDARY: 'ATTACK_SECONDARY',
  DEFEND: 'DEFEND',
  MOVE: 'MOVE',
  STEALTH_MODE: 'STEALTH_MODE'
};

class StructReferenceDTO { // ATTACK_*, DEFEND
  /**
   * @param {string} playerId
   * @param {string} structId
   * @param {boolean} isCommandStruct
   */
  constructor(playerId, structId, isCommandStruct = false) {
    this.playerId = playerId;
    this.structId = structId;
    this.isCommandStruct = isCommandStruct;
  }
}

class StructAction {
  /**
   * @param {string} type
   * @param {StructReferenceDTO} source
   */
  constructor(type, source) {
    this.setType(type);
    this.source = source;
    this.data = {};
  }

  /**
   * @param {string} type
   */
  setType(type) {
    if (!STRUCT_ACTION_TYPES[type]) {
      throw new Error(`Invalid struct action type: ${type}`);
    }
    this.type = type;
  }

  /**
   * @return {string}
   */
  getType() {
    return this.type;
  }

  dispatchEvent() {
    window.dispatchEvent(new CustomEvent(
      this.type,
      {
        detail: {
          source: this.source,
          data: this.data
        },
      }
    ));
  }
}

class StructsGlobalDataStore {
  constructor() {
    window.structsStore = window.structsStore || {};
  }

  /**
   * @param {string} key
   * @param {*} value
   */
  set(key, value) {
    window.structsStore[key] = value;
  }

  /**
   * @param {string} key
   * @return {*}
   */
  get(key) {
    return window.structsStore[key];
  }

  /**
   * @param {StructAction} action
   */
  setStructAction(action) {
    this.set('structAction', action);
  }

  /**
   * @return {StructAction}
   */
  getStructAction() {
    return this.get('structAction');
  }

  clearStructAction() {
    this.set('structAction', null);
  }
}

document.getElementById('testButton').addEventListener('click', function() {
  (new StructsGlobalDataStore()).setStructAction(new StructAction(
    STRUCT_ACTION_TYPES.ATTACK_PRIMARY,
    new StructReferenceDTO(
      player.id,
      player.fleet.space[1].id
    )
  ));
});

document.querySelectorAll('.struct-map-view-btn').forEach(structButton => {
  structButton.addEventListener('click', function() {
    const playerId = structButton.getAttribute('data-player-id');
    const structId = structButton.getAttribute('data-struct-id');
    const isCommandStruct = !!parseInt(structButton.getAttribute('data-is-command-struct'));
    const structsStore = new StructsGlobalDataStore();
    const action = structsStore.getStructAction();

    if (action && [
      STRUCT_ACTION_TYPES.ATTACK_PRIMARY,
      STRUCT_ACTION_TYPES.ATTACK_SECONDARY,
      STRUCT_ACTION_TYPES.DEFEND
    ].includes(action.getType())) {
      alert(`
      action: ${action.getType()}
      player-id: ${playerId},
      struct-id: ${structId},
      is-command-struct: ${isCommandStruct}
      `);
      action.data = new StructReferenceDTO(playerId, structId, isCommandStruct);
      action.dispatchEvent();
      structsStore.clearStructAction();
    } else {
      const player = players.find(player => player.id === playerId);
      const struct = isCommandStruct ? player.commandStruct : player.fleet.findStructById(structId);
      const domOffcanvas = document.getElementById('offcanvasBottom');
      const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(document.getElementById('offcanvasBottom'));
      const offcanvasClass = (thisPlayer.id === playerId) ? 'player' : 'enemy';

      domOffcanvas.classList.remove('player');
      domOffcanvas.classList.remove('enemy');
      domOffcanvas.classList.add(offcanvasClass);

      domOffcanvas.innerHTML = (new UIStructDetails(struct, player)).render();

      bsOffcanvas.show();
    }
  });
});

const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl, {
    container: 'body',
    trigger: 'focus'
  });
});

window.addEventListener(STRUCT_ACTION_TYPES.ATTACK_PRIMARY, function(e) {
  console.log(e);
});
