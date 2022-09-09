import {UIFleet} from "./UIFleet.js";
import {EVENTS} from "../../modules/Constants.js";
import {UIStructDetails} from "./UIStructDetails.js";
import {StructsGlobalDataStore} from "../../modules/StructsGlobalDataStore.js";
import {StructRef} from "../../modules/StructRef.js";

export class UIGame {
  constructor(elementId, player, enemy) {
    this.elementId = elementId
    this.player = player;
    this.enemy = enemy;
    this.players = [this.player, this.enemy];

    this.playerFleetUI = new UIFleet(this.player);
    this.enemyFleetUI = new UIFleet(this.enemy);
  }

  render() {
    document.getElementById(this.elementId).innerHTML = `
      <div class="container-fluid play-area">
        <div class="row">

          <div id="playerFleet" class="col">${this.playerFleetUI.render(this.player)}</div>

          <div class="col-lg-2">
            <div class="vs">VS</div><div class="vertical-align-helper"></div>
          </div>

          <div id="enemyFleet" class="col">${this.enemyFleetUI.render(this.player)}</div>

        </div>
      </div>
    `;

    const game = this;
    document.querySelectorAll('.struct-map-view-btn').forEach(structButton => {
      structButton.addEventListener('click', function() {
        const playerId = structButton.getAttribute('data-player-id');
        const structId = structButton.getAttribute('data-struct-id');
        const isCommandStruct = !!parseInt(structButton.getAttribute('data-is-command-struct'));
        const structsStore = new StructsGlobalDataStore();
        const action = structsStore.getStructAction();

        if (action && [
          EVENTS.ACTIONS.ATTACK_PRIMARY,
          EVENTS.ACTIONS.ATTACK_SECONDARY,
          EVENTS.ACTIONS.DEFEND
        ].includes(action.getType())) {
          alert(`
      action: ${action.getType()}
      player-id: ${playerId},
      struct-id: ${structId},
      is-command-struct: ${isCommandStruct}
      `);
          action.data = new StructRef(playerId, structId, isCommandStruct);
          action.dispatchEvent();
          structsStore.clearStructAction();
        } else {
          const player = game.players.find(player => player.id === playerId);
          const struct = isCommandStruct ? player.commandStruct : player.fleet.findStructById(structId);
          const domOffcanvas = document.getElementById('offcanvasBottom');
          const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(document.getElementById('offcanvasBottom'));
          const offcanvasClass = (game.player.id === playerId) ? 'player' : 'enemy';

          domOffcanvas.classList.remove('player');
          domOffcanvas.classList.remove('enemy');
          domOffcanvas.classList.add(offcanvasClass);

          domOffcanvas.innerHTML = (new UIStructDetails(struct, player)).render();

          const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
          popoverTriggerList.map(function (popoverTriggerEl) {
            return new bootstrap.Popover(popoverTriggerEl, {
              container: 'body',
              trigger: 'focus'
            });
          });

          bsOffcanvas.show();
        }
      });
    });
  }
}
