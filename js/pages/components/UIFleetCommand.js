import {UIStructMapView} from "./UIStructMapView.js";
import {AmbitsUtil} from "../../modules/util/AmbitsUtil.js";
import {UIEmptyMapSlot} from "./UIEmptyMapSlot.js";

export class UIFleetCommand {

  /**
   * @param {GameState} state;
   * @param {Player} player
   */
  constructor(state, player) {
    this.state = state;
    this.player = player;
    this.ambitsUtil = new AmbitsUtil();
  }

  render() {
    const ambits = this.ambitsUtil.getAmbitsTopFirst(true);
    let html = '';
    for (let i = 0; i < ambits.length; i++) {
      html += `<div class="ambit ${ambits[i]}">`;
      if (this.player.commandStruct.operatingAmbit === ambits[i].toUpperCase()) {
        html += (new UIStructMapView(
          this.state,
          this.player.commandStruct,
          this.player
        )).render();
      } else {
        html += (new UIEmptyMapSlot(
          this.state,
          this.player,
          ambits[i].toUpperCase(),
          this.player.commandStruct.ambitSlot,
          true
        )).render();
      }
      html += `</div>`;
    }
    return html;
  }
}
