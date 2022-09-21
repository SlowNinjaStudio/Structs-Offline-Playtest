import {UIFleetCommand} from "./UIFleetCommand.js";
import {UIStructMapView} from "./UIStructMapView.js";
import {AmbitsUtil} from "../../modules/util/AmbitsUtil.js";
import {UIEmptyMapSlot} from "./UIEmptyMapSlot.js";

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
   * @param {Player} viewingPlayer
   * @return {string}
   */
  render(viewingPlayer) {
    const playerOrEnemy = (viewingPlayer.id === this.player.id) ? 'player' : 'enemy';
    const titleHtml = `<div class="title">${this.player.name}</div>`;
    const commandFleetHtml = `<div class="commandStructContainer">${this.uiFleetCommand.render()}</div>`;
    const commandFleetDivider = `<div class="commandFleetDivider"></div>`;
    const regularFleetHtml = `<div id="playerFleetContainer" class="fleetContainer">${this.renderFromFleet()}</div>`;
    const isTurn = (this.state.turn.id === this.player.id) ? 'is-turn' : '';

    let html = `<div class="side ${playerOrEnemy} ${isTurn}">`;

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
