import {UINavbar} from "./components/UINavbar.js";
import {StructBuilder} from "../modules/StructBuilder.js";
import {OWNER_TYPES, UNIT_TYPES} from "../modules/Constants.js";
import {UIStructMapView} from "./components/UIStructMapView.js";
import {UIStructDetails} from "./components/UIStructDetails.js";

(new UINavbar()).init('nav-wrapper');

const playerStructs = [];
const enemyStructs = [];
const structBuilder = new StructBuilder();

const playerStarFighter = structBuilder.make(UNIT_TYPES.STAR_FIGHTER);
playerStructs.push(playerStarFighter);
const playerSpaceFrigate = structBuilder.make(UNIT_TYPES.SPACE_FRIGATE);
playerSpaceFrigate.currentHealth = 2;
playerSpaceFrigate.defend(playerStarFighter);
playerStructs.push(playerSpaceFrigate);
playerStructs.push(structBuilder.make(UNIT_TYPES.GALACTIC_BATTLESHIP));
const playerStarFighter2 = structBuilder.make(UNIT_TYPES.STAR_FIGHTER);
playerStarFighter2.defend(playerSpaceFrigate);
playerStructs.push(playerStarFighter2);
playerStructs.push(structBuilder.make(UNIT_TYPES.FIGHTER_JET));
playerStructs.push(structBuilder.make(UNIT_TYPES.HIGH_ALTITUDE_INTERCEPTOR));
playerStructs.push(structBuilder.make(UNIT_TYPES.STEALTH_BOMBER));
playerStructs.push(structBuilder.make(UNIT_TYPES.FIGHTER_JET));
playerStructs.push(structBuilder.make(UNIT_TYPES.TANK));
playerStructs.push(structBuilder.make(UNIT_TYPES.ARTILLERY));
playerStructs.push(structBuilder.make(UNIT_TYPES.SAM_LAUNCHER));
playerStructs.push(structBuilder.make(UNIT_TYPES.TANK));
playerStructs.push(structBuilder.make(UNIT_TYPES.SUB));
playerStructs.push(structBuilder.make(UNIT_TYPES.DESTROYER));
playerStructs.push(structBuilder.make(UNIT_TYPES.CRUISER));
playerStructs.push(structBuilder.make(UNIT_TYPES.SUB));

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

document.getElementById('playerFleetContainer').innerHTML = renderFleet(playerStructs);
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

document.getElementById('offcanvasBottom').innerHTML = (new UIStructDetails(structBuilder.make(UNIT_TYPES.FIGHTER_JET), OWNER_TYPES.PLAYER)).render();



const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl, {
    container: 'body',
    trigger: 'focus'
  });
});
