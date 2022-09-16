import {UIStructMapView} from "./UIStructMapView.js";
import {AmbitsUtil} from "../../modules/AmbitsUtil.js";
import {UIEmptyMapSlot} from "./UIEmptyMapSlot.js";

export class UIFleetCommand {

  /**
   * @param {Player} player
   */
  constructor(player) {
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
          this.player.commandStruct,
          this.player
        )).render();
      } else {
        html += (new UIEmptyMapSlot(
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
