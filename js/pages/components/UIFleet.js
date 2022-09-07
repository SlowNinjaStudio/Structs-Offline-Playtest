import {UIFleetCommand} from "./UIFleetCommand.js";
import {UIStructMapView} from "./UIStructMapView.js";
import {AmbitsUtil} from "../../modules/AmbitsUtil.js";

export class UIFleet {
  /**
   * @param {Player} player
   */
  constructor(player) {
    this.player = player;
    this.uiFleetCommand = new UIFleetCommand(this.player);

    this.ambitsUtil = new AmbitsUtil();
  }

  renderFromFleet() {
    const ambits = this.ambitsUtil.getAmbitsTopFirst(true);
    let html = '';
    for (let j = 0; j < ambits.length; j++) {
      html += `<div class="ambit ${ambits[j]}">`;
      for (let i = 0; i < this.player.fleet[ambits[j]].length; i++) {
        html += (new UIStructMapView(
          this.player.fleet[ambits[j]][i],
          this.player
        )).render();
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

    let html = `<div class="side ${playerOrEnemy}">`;

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
