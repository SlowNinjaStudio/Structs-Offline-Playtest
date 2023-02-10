import {UIFleetCommand} from "./UIFleetCommand.js";
import {UIStructMapView} from "./UIStructMapView.js";
import {AmbitsUtil} from "../../modules/util/AmbitsUtil.js";
import {UIEmptyMapSlot} from "./UIEmptyMapSlot.js";
import {GAME_PHASES} from "../../modules/Constants.js";

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
   * @param {Fleet} fleet
   * @param {boolean} isPlanet
   * @return {string}
   */
  renderFromFleet(fleet, isPlanet = false) {
    const ambits = this.ambitsUtil.getAmbitsTopFirst(true);
    let html = '';
    for (let j = 0; j < ambits.length; j++) {
      html += `<div class="ambit ${ambits[j]}">`;
      for (let i = 0; i < fleet[ambits[j]].length; i++) {
        if (fleet[ambits[j]][i]) {
          html += (new UIStructMapView(
            this.state,
            fleet[ambits[j]][i],
            this.player
          )).render();
        } else {
          html += (new UIEmptyMapSlot(
            this.state,
            this.player,
            ambits[j].toUpperCase(),
            i,
            false,
            isPlanet
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
  renderBasicTitle() {
    return `<div class="title">${this.player.name}</div>`;
  }

  /**
   * @return {string}
   */
  renderFleetSetupTitle() {
    return `
      <div class="title container-fluid text-white">
        <div class="row justify-content-between align-items-center">
          <div class="col-auto">${this.player.name}</div>
          <div class="col-auto fs-5">
            <span class="align-middle">${this.player.creditManager.getBudgetUsageString()}</span>
            <div class="watt-icon fleet-title-watt-icon"></div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * @return {string}
   */
  renderTitleWithCredits() {
    return `
      <div class="title container-fluid">
        <div class="row justify-content-between align-items-center">
          <div class="col-auto">${this.player.name}</div>
          <div class="col-auto fs-5 text-white">
            <span class="align-middle">${this.player.creditManager.credits}</span>
            <div class="watt-icon fleet-title-watt-icon"></div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * @return {string}
   */
  renderTitle() {
    let titleHtml = this.renderBasicTitle();
    if (this.player.creditManager.hasBudgetAndCredits()
      && [GAME_PHASES.FLEET_SELECT_P1, GAME_PHASES.FLEET_SELECT_P2].includes(this.state.gamePhase)) {
      titleHtml = this.renderFleetSetupTitle();
    } else if (this.state.arePlanetsEnabled && this.state.gamePhase === GAME_PHASES.COMBAT) {
      titleHtml = this.renderTitleWithCredits();
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
    const planetHtml = this.state.arePlanetsEnabled ? `<div class="planetContainer">${this.renderFromFleet(this.player.planet, true)}</div>` : '';
    const commandFleetHtml = `<div class="commandStructContainer">${this.uiFleetCommand.render()}</div>`;
    const commandFleetDivider = `<div class="commandFleetDivider"></div>`;
    const regularFleetHtml = `<div class="fleetContainer">${this.renderFromFleet(this.player.fleet)}</div>`;
    const isTurn = (this.state.turn.id === this.player.id) ? 'is-turn' : '';
    const isPlanetEnabled = (this.state.arePlanetsEnabled) ? 'is-planet-enabled' : '';

    let html = `<div class="side text-center ${playerOrEnemy} ${isTurn} ${isPlanetEnabled}">`;

    if (playerOrEnemy === 'player') {
      html += `
        ${titleHtml}
        ${planetHtml}
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
        ${planetHtml}
      `;
    }

    html+= `</div>`;

    return html;
  }
}
