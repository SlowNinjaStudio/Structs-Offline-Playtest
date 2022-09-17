import {DEFENSE_COMPONENTS, IMG, MAX_HEART_ICONS} from "../../modules/Constants.js";
import {StructsGlobalDataStore} from "../../modules/StructsGlobalDataStore.js";

export class UIStructMapView {
  /**
   * @param {Struct} struct
   * @param {Player} player
   */
  constructor(struct, player) {
    this.struct = struct;
    this.player = player;

    this.dataStore = new StructsGlobalDataStore();
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
    return (this.struct.defenders.length > 0)
      ? `<img src="${IMG.ICONS}icon-strength.png" alt="strength">`
      : '';
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

  render() {
    let isSelectable = true;
    const action = this.dataStore.getStructAction();
    if (action) {
      isSelectable = action.applicableStructsFilter(this.struct);
    }
    return `
      ${(this.struct.isDestroyed || !isSelectable) ? '' : `
      <a
        class="struct-map-view-btn"
        data-player-id="${this.player.id}"
        data-struct-id="${this.struct.id}"
        data-is-command-struct="${this.struct.isCommandStruct() ? 1 : 0}"
        href="javascript: void(0)"
        role="button"
      >
      `}
        <div class="struct ${(this.struct.isDestroyed || !isSelectable) ? 'unselectable' : ''}">
          <div>${this.renderHealthInHearts()}</div>
          <img src="${this.struct.image}" alt="${this.struct.unitType}">
          <div>${this.renderStatusIcons()}</div>
        </div>
      ${this.struct.isDestroyed ? '' : `
      </a>
      `}
    `;
  }
}
