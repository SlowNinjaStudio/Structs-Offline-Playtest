import {IMG, MAX_HEART_ICONS} from "../../modules/Constants.js";

export class UIStructMapView {
  /**
   * @param {Struct} struct
   */
  constructor(struct) {
    this.struct = struct;
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

  render() {
    let isDefending = '';
    let isDefended = '';

    if (this.struct.defending) {
      isDefending = `<img src="${IMG.ICONS}icon-rook.png" alt="rook">`;
    }

    if (this.struct.defenders.length > 0) {
      isDefended = `<img src="${IMG.ICONS}icon-strength.png" alt="strength">`;
    }

    return `
      <div class="struct">
        <div>${this.renderHealthInHearts()}</div>
        <img src="${this.struct.image}" alt="${this.struct.unitType}">
        <div>${isDefending}${isDefended}</div>
      </div>
    `;
  }
}
