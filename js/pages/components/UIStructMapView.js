import {DEFENSE_COMPONENTS, GAME_PHASES, IMG, MAX_HEART_ICONS} from "../../modules/Constants.js";
import {Appraiser} from "../../modules/Appraiser.js";

export class UIStructMapView {
  /**
   * @param {GameState} state
   * @param {Struct} struct
   * @param {Player} player
   */
  constructor(state, struct, player) {
    this.state = state;
    this.struct = struct;
    this.player = player;
    this.apprasier = new Appraiser();
  }

  renderHealthInHearts() {
    const healthHeartRatio = (this.struct.currentHealth / this.struct.maxHealth) * MAX_HEART_ICONS;
    const wholeHearts = Math.floor(healthHeartRatio);
    const halfHearts = Math.round((healthHeartRatio % 1) * 2);
    const emptyHearts = Math.floor(MAX_HEART_ICONS - healthHeartRatio);
    let wholeHeartsHtml = '';
    let halfHeartHtml = '';
    let emptyHeartsHtml = '';

    for (let i = 0; i < wholeHearts; i++) {
      wholeHeartsHtml += `<img src="${IMG.ICONS}icon-health.png" alt="full heart">`;
    }

    if (halfHearts) {
      halfHeartHtml = `<img src="${IMG.ICONS}icon-health-half.png" alt="half heart">`;
    }

    for (let i = 0; i < emptyHearts; i++) {
      emptyHeartsHtml += `<img src="${IMG.ICONS}icon-health-empty.png" alt="empty heart">`;
    }

    return `${wholeHeartsHtml}${halfHeartHtml}${emptyHeartsHtml}`;
  }

  /**
   * @return {string}
   */
  renderIsDefendingIcon() {
    return (this.struct.defending)
      ? `<img src="${IMG.ICONS}icon-rook.png" alt="rook">`
      : '';
  }

  /**
   * @return {string}
   */
  renderIsDefendedIcon() {
    let icon = '';
    if (this.struct.defenders.length > 2) {
      icon = `<img src="${IMG.ICONS}icon-defended-danger.png" alt="heavily defended" title="Heavily Defended">`;
    } else if (this.struct.defenders.length === 2) {
      icon = `<img src="${IMG.ICONS}icon-defended-warning.png" alt="moderately defended" title="Moderately Defended">`;
    } else if (this.struct.defenders.length === 1) {
      icon = `<img src="${IMG.ICONS}icon-defended-info.png" alt="lightly defended" title="Lightly Defended">`;
    }
    return icon;
  }

  /**
   * @return {string}
   */
  renderIsHiddenIcon() {
    let isHidden = '';
    if (this.struct.defenseComponent.name === DEFENSE_COMPONENTS.STEALTH_MODE) {
      isHidden = this.struct.defenseComponent.isActive
        ? `<img src="${IMG.ICONS}icon-invisible.png" alt="invisible">`
        : `<img src="${IMG.ICONS}icon-visible.png" alt="visible">`;
    }
    return isHidden;
  }

  /**
   * @return {string}
   */
  renderIsDestroyedIcon() {
    return (this.struct.isDestroyed)
      ? `<img src="${IMG.ICONS}icon-skull.png" alt="skull">`
      : '';
  }

  /**
   * @return {string}
   */
  renderStatusIcons() {
    let statusIcons =  this.renderIsDefendingIcon()
      + this.renderIsDefendedIcon()
      + this.renderIsHiddenIcon();
    if (this.struct.isDestroyed) {
      statusIcons = this.renderIsDestroyedIcon();
    }
    return statusIcons;
  }

  renderCost() {
    if (!this.struct || this.struct.isCommandStruct()) {
      return '';
    }

    const cost = this.apprasier.calcUnitTypePrice(this.struct.unitType);
    return `
      <span class="font-smaller text-body align-middle fw-bold">${cost} </span>
      <img src="${IMG.RASTER_ICONS}icon-watt-grey-32x32.png" alt="Currency Icon" class="icon-raster-small">
    `;
  }

  render() {
    let isSelectable = true;
    if (([GAME_PHASES.FLEET_SELECT_P1, GAME_PHASES.FLEET_SELECT_P2].includes(this.state.gamePhase))
      && this.struct.isCommandStruct()) {
      isSelectable = false;
    } else if (this.state.action) {
      isSelectable = this.state.action.applicableStructsFilter(this.struct);
    }
    const isCombatPhase = this.state.gamePhase === GAME_PHASES.COMBAT;
    return `
      ${(this.struct.isDestroyed || !isSelectable) ? '' : `
      <a
        class="map-slot-btn struct-map-view-btn"
        data-player-id="${this.player.id}"
        data-ambit="${this.struct.operatingAmbit}"
        data-ambit-slot="${this.struct.ambitSlot}"
        data-struct-id="${this.struct.id}"
        data-is-command-struct="${this.struct.isCommandStruct() ? 1 : 0}"
        data-is-command-slot="${this.struct.isCommandStruct() ? 1 : 0}"
        href="javascript: void(0)"
        role="button"
      >
      `}
        <div class="struct ${(this.struct.isDestroyed || !isSelectable) ? 'unselectable' : ''}">
          <div>${this.renderHealthInHearts()}</div>
          <img src="${this.struct.image}" alt="${this.struct.unitType}">
          <div>${isCombatPhase ? this.renderStatusIcons() : this.renderCost()}</div>
        </div>
      ${this.struct.isDestroyed ? '' : `
      </a>
      `}
    `;
  }
}
