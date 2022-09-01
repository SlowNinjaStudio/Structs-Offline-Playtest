import {UINavbar} from "./components/UINavbar.js";
import {StructBuilder} from "../modules/StructBuilder.js";
import {OWNER_TYPES, UNIT_TYPES} from "../modules/Constants.js";
import {UIStructMapView} from "./components/UIStructMapView.js";
import {UIStructDetails} from "./components/UIStructDetails.js";
import {Player} from "../modules/Player.js";

(new UINavbar()).init('nav-wrapper');

const enemyStructs = [];
const structBuilder = new StructBuilder();

const player = new Player('Player');


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

enemyStructs.push(structBuilder.make(UNIT_TYPES.STAR_FIGHTER));
enemyStructs.push(structBuilder.make(UNIT_TYPES.SPACE_FRIGATE));
enemyStructs.push(structBuilder.make(UNIT_TYPES.GALACTIC_BATTLESHIP));
enemyStructs.push(structBuilder.make(UNIT_TYPES.STAR_FIGHTER));
enemyStructs.push(structBuilder.make(UNIT_TYPES.FIGHTER_JET));
enemyStructs.push(structBuilder.make(UNIT_TYPES.HIGH_ALTITUDE_INTERCEPTOR));
enemyStructs.push(structBuilder.make(UNIT_TYPES.STEALTH_BOMBER));
enemyStructs.push(structBuilder.make(UNIT_TYPES.FIGHTER_JET));
enemyStructs.push(structBuilder.make(UNIT_TYPES.TANK));
enemyStructs.push(structBuilder.make(UNIT_TYPES.ARTILLERY));
enemyStructs.push(structBuilder.make(UNIT_TYPES.SAM_LAUNCHER));
enemyStructs.push(structBuilder.make(UNIT_TYPES.TANK));
enemyStructs.push(structBuilder.make(UNIT_TYPES.SUB));
enemyStructs.push(structBuilder.make(UNIT_TYPES.DESTROYER));
enemyStructs.push(structBuilder.make(UNIT_TYPES.CRUISER));
enemyStructs.push(structBuilder.make(UNIT_TYPES.SUB));

let renderFleet = (structs) => {
  const ambits = ['space', 'sky', 'land', 'water'];
  let html = '';
  let i = 0;
  for (let j = 0; j < ambits.length; j++) {
    html += `<div class="ambit ${ambits[j]}">`;
    for (let k = 0; k < 4 && i < structs.length; k++) {
      html += (new UIStructMapView(structs[i])).render();
      i++;
    }
    html += `</div>`;
  }
  return html;
}

let renderFromFleet = (fleet) => {
  const ambits = ['space', 'sky', 'land', 'water'];
  let html = '';
  for (let j = 0; j < ambits.length; j++) {
    html += `<div class="ambit ${ambits[j]}">`;
    for (let i = 0; i < fleet[ambits[j]].length; i++) {
      html += (new UIStructMapView(fleet[ambits[j]][i])).render();
    }
    html += `</div>`;
  }
  return html;
}

document.getElementById('playerFleetContainer').innerHTML = renderFromFleet(player.fleet);
document.getElementById('enemyFleetContainer').innerHTML = renderFleet(enemyStructs);

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



const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl, {
    container: 'body',
    trigger: 'focus'
  });
});
