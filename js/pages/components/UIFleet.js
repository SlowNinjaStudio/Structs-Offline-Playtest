import {UIFleetCommand} from "./UIFleetCommand.js";
import {UIStructMapView} from "./UIStructMapView.js";
import {AmbitsUtil} from "../../modules/util/AmbitsUtil.js";
import {UIEmptyMapSlot} from "./UIEmptyMapSlot.js";
import {GAME_PHASES, IMG} from "../../modules/Constants.js";

export class UIFleet {
  /**
   * @param {GameState} state
   * @param {Player} player
   */
  constructor(state, player) {
    this.state = state;
    this.player = player;
    this.uiFleetCommand = new UIFleetCommand(this.state, this.player);

    this.ambitsUtil = new AmbitsUtil();
  }

  /**
   * @return {string}
   */
  renderFromFleet() {
    const ambits = this.ambitsUtil.getAmbitsTopFirst(true);
    let html = '';
    for (let j = 0; j < ambits.length; j++) {
      html += `<div class="ambit ${ambits[j]}">`;
      for (let i = 0; i < this.player.fleet[ambits[j]].length; i++) {
        if (this.player.fleet[ambits[j]][i]) {
          html += (new UIStructMapView(
            this.state,
            this.player.fleet[ambits[j]][i],
            this.player
          )).render();
        } else {
          html += (new UIEmptyMapSlot(
            this.state,
            this.player,
            ambits[j].toUpperCase(),
            i,
            false
          )).render();
        }
      }
      html += `</div>`;
    }
    return html;
  }

  /**
   * @return {string}
   */
  renderTitle() {
    let titleHtml = `<div class="title">${this.player.name}</div>`;
    if (this.player.creditManager.hasBudgetAndCredits()
      && [GAME_PHASES.FLEET_SELECT_P1, GAME_PHASES.FLEET_SELECT_P2].includes(this.state.gamePhase)) {
      titleHtml = `
        <div class="title container-fluid text-white">
          <div class="row justify-content-between align-items-center">
            <div class="col-auto">${this.player.name}</div>
            <div class="col-auto fs-5">
              <span class="align-middle">${this.player.creditManager.getBudgetUsageString()}</span>
              <img src="${IMG.RASTER_ICONS}icon-watt-white-14x16.png" alt="Currency Icon">
            </div>
          </div>
        </div>
      `;
    }
    return titleHtml;
  }

  /**
   * @param {Player} viewingPlayer
   * @return {string}
   */
  render(viewingPlayer) {
    const playerOrEnemy = (viewingPlayer.id === this.player.id) ? 'player' : 'enemy';
    const titleHtml = this.renderTitle();
    const commandFleetHtml = `<div class="commandStructContainer">${this.uiFleetCommand.render()}</div>`;
    const commandFleetDivider = `<div class="commandFleetDivider"></div>`;
    const regularFleetHtml = `<div id="playerFleetContainer" class="fleetContainer">${this.renderFromFleet()}</div>`;
    const isTurn = (this.state.turn.id === this.player.id) ? 'is-turn' : '';

    let html = `<div class="side text-center ${playerOrEnemy} ${isTurn}">`;

    if (playerOrEnemy === 'player') {
      html += `
        ${titleHtml}
        ${commandFleetHtml}
        ${commandFleetDivider}
        ${regularFleetHtml}
      `;
    } else {
      html += `
        ${titleHtml}
        ${regularFleetHtml}
        ${commandFleetDivider}
        ${commandFleetHtml}
      `;
    }

    html+= `</div>`;

    return html;
  }
}
