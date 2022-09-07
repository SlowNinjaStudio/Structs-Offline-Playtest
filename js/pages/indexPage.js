import {UINavbar} from "./components/UINavbar.js";
import {StructBuilder} from "../modules/StructBuilder.js";
import {OWNER_TYPES, UNIT_TYPES} from "../modules/Constants.js";
import {UIStructDetails} from "./components/UIStructDetails.js";
import {Player} from "../modules/Player.js";
import {UIFleet} from "./components/UIFleet.js";

(new UINavbar()).init('nav-wrapper');

const structBuilder = new StructBuilder();

const player = new Player('Player');
const enemy = new Player('Enemy');


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
player.fleet.addStruct(structBuilder.make(UNIT_TYPES.TANK));
player.fleet.addStruct(structBuilder.make(UNIT_TYPES.ARTILLERY));
const playerSamLauncher = structBuilder.make(UNIT_TYPES.SAM_LAUNCHER);
playerSamLauncher.defend(playerSpaceFrigate);
player.fleet.addStruct(playerSamLauncher);
player.fleet.addStruct(structBuilder.make(UNIT_TYPES.TANK));
player.fleet.addStruct(structBuilder.make(UNIT_TYPES.SUB));
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
enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.FIGHTER_JET));
enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.TANK));
enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.ARTILLERY));
enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.SAM_LAUNCHER));
enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.TANK));
enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.SUB));
enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.DESTROYER));
enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.CRUISER));
enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.SUB));

const playerFleetUI = new UIFleet(player);
const enemyFleetUI = new UIFleet(enemy);
document.getElementById('playerFleet').innerHTML = playerFleetUI.render(player);
document.getElementById('enemyFleet').innerHTML = enemyFleetUI.render(player);


const structElms = document.querySelectorAll('.struct');
structElms.forEach(structElm => {
  if (structElm.innerHTML.trim() !== '') {
    structElm.outerHTML = `
      <a
        data-bs-toggle="offcanvas"
        href="#offcanvasBottom"
        role="button"
        aria-controls="offcanvasBottom"
      >${structElm.outerHTML}</a>
    `;
  }
});

document.getElementById('offcanvasBottom').innerHTML = (new UIStructDetails(playerSpaceFrigate, OWNER_TYPES.PLAYER)).render();


document.querySelectorAll('.struct-map-view-btn').forEach(structButton => {
  structButton.addEventListener('click', function() {
    const offcanvas = bootstrap.Offcanvas.getOrCreateInstance(document.getElementById('offcanvasBottom'));
    document.getElementById('offcanvasBottom').innerHTML = (new UIStructDetails(
      player.fleet.findStructById(structButton.getAttribute('data-struct-id')),
      OWNER_TYPES.PLAYER
    )).render();
    offcanvas.show();
  });
});

const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl, {
    container: 'body',
    trigger: 'focus'
  });
});
