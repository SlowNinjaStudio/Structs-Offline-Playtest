import {Util} from "../../modules/Util.js";
import {COMBAT_EVENT_LABELS, EVENTS, IMG} from "../../modules/Constants.js";

export class UICombatEventViewer {
  /**
   * @param {string} offcanvasId
   * @param {Player} player
   * @param {Player} enemy
   */
  constructor(offcanvasId, player, enemy) {
    this.offcanvasId = offcanvasId;
    this.player = player;
    this.enemy = enemy;
    this.events = [];
    this.playerLeft = null;

    this.util = new Util();
  }

  initListeners() {
    Object.keys(EVENTS.COMBAT).forEach(key => {
      window.addEventListener(EVENTS.COMBAT[key], this.addEvent.bind(this));
    });
  }

  /**
   * @param {CombatEvent} e
   */
  addEvent(e) {
    if (e.type === EVENTS.COMBAT.COMBAT_TARGETED) {
      this.events = [];
      if (e.sourceStruct.playerId === this.player.id) {
        this.playerLeft = this.player;
      } else {
        this.playerLeft = this.enemy;
      }
    }
    this.events.push(e);
    this.render();
  }

  /**
   * @param {string} ambit
   * @return {string}
   */
  getAmbitIcon(ambit) {
    return `<a href="javascript: void(0)"
         data-bs-toggle="popover"
         data-bs-content="${this.util.titleCase(ambit)} Ambit"
      ><img src="${IMG.ICONS}icon-ambit-${ambit.toLowerCase()}.png" alt="${ambit.toLowerCase()} ambit"></a>`;
  }

  /**
   * @param {number} previousHealth
   * @param {number} newHealth
   * @param {number} maxHealth
   * @return {string}
   */
  renderHealth(previousHealth, newHealth, maxHealth) {
    if (previousHealth === newHealth) {
      return `${newHealth}/${maxHealth}`;
    }
    return `${previousHealth}/${maxHealth} => ${newHealth}/${maxHealth}`;
  }

  renderStruct(struct, previousHealth, newHealth) {
    return `
      <div class="col">
        <div class="row">
          <div class="col text-center">
            <a href="javascript: void(0)"
               data-bs-toggle="popover"
               title="Struct Position"
               data-bs-content="This struct's position by ambit and slot number."
            ><img src="${IMG.ICONS}icon-location-pin.png" alt="location-pin"></a><strong>:</strong>
            ${this.getAmbitIcon(struct.operatingAmbit)} ${struct.getDisplayAmbitSlot()}
          </div>
        </div>
        <div class="row">
          <div class="col text-center">
            <div class="combat-event-struct-image-wrapper">
              <img class="combat-event-struct-image img-thumbnail" src="${struct.image}" alt="${struct.unitType}">
              <div class="combat-event-struct-image-overlay ${newHealth === 0 ? 'destroyed' : ''}"></div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="col text-center">
              <a href="javascript: void(0)"
                 data-bs-toggle="popover"
                 title="Health"
                 data-bs-content="Current Health / Max Health"
              ><img src="${IMG.ICONS}icon-health.png"
                 alt="health"
              ></a><strong>:</strong>
              ${this.renderHealth(previousHealth, newHealth, struct.maxHealth)}
            </div>
          </div>
        </div>
      </div>
    `
  }

  /**
   * @param {CombatEvent} e
   * @return {string}
   */
  renderEventTypeIcon(e) {
    let html = ``;
    if (e.type === EVENTS.COMBAT.COMBAT_DEFENDER_BLOCKED) {
      html += `<img src="${IMG.LARGE_ICONS}large-icon-arrow-left-blocked.png" alt="blocked"></a>`;
    } else {
      html += `<img src="${IMG.LARGE_ICONS}large-icon-arrow-right.png" alt="arrow"></a>`;
    }
    return html;
  }

  /**
   * @param {CombatEvent} e
   * @return {string}
   */
  renderEventRow(e) {
    let damageAmount = e.damageAmount;

    let leftStruct = e.sourceStruct;
    let leftStructPreviousHealth = e.sourceStructHealth;
    let leftStructNewHealth = e.sourceStructHealth;
    let rightStruct = e.targetStruct;
    let rightStructPreviousHealth = e.targetStructPreviousHealth;
    let rightStructNewHealth = e.targetStructNewHealth;
    let isActionLeftToRight = true;

    if (e.sourceStruct.playerId !== this.playerLeft.id) {
      leftStruct = e.targetStruct;
      leftStructPreviousHealth = e.targetStructPreviousHealth;
      leftStructNewHealth = e.targetStructNewHealth;
      rightStruct = e.sourceStruct;
      rightStructPreviousHealth = e.sourceStructHealth;
      rightStructNewHealth = e.sourceStructHealth;
      isActionLeftToRight = false
    }
    return `
      <div class="row py-4 px-1 combat-event-row">

          ${this.renderStruct(leftStruct, leftStructPreviousHealth, leftStructNewHealth)}

          <div class="col">
            <div class="row">
              <div class="col combat-event-type-label">
                ${COMBAT_EVENT_LABELS[e.type]}
              </div>
            </div>
            <div class="row">
              <div class="col combat-event-icon ${isActionLeftToRight ? '' : 'flip-img-x'}">
                ${this.renderEventTypeIcon(e)}
              </div>
            </div>
            ${damageAmount !== null ? `
            <div class="row">
              <div class="col combat-event-damage">
                <a href="javascript: void(0)"
                   data-bs-toggle="popover"
                   data-bs-content="Damage Value"
                ><img src="${IMG.ICONS}icon-fire.png" alt="fire"></a> ${damageAmount}
              </div>
            </div>
            ` : ''}
          </div>

          ${this.renderStruct(rightStruct, rightStructPreviousHealth, rightStructNewHealth)}

        </div>
    `;
  }

  /**
   * @return {string}
   */
  renderEndRow() {
    return `
      <div class="row py-4 px-1 combat-event-row">
        <div class="col text-center">
            <button type="button" class="btn btn-success" data-bs-dismiss="offcanvas">Close</button>
        </div>
      </div>
    `;
  }

  render() {
    let eventRowsHtml = '';
    for (let i = 0; i < this.events.length; i++) {
      if (this.events[i].type === EVENTS.COMBAT.COMBAT_ENDED) {
        eventRowsHtml += this.renderEndRow();
      } else {
        eventRowsHtml += this.renderEventRow(this.events[i]);
      }
    }

    document.getElementById(this.offcanvasId).innerHTML = `
      <div class="offcanvas-header">
        <div class="container-fluid">
          <div class="row">
            <div class="col text-start">
              <h5 class="offcanvas-title" id="offcanvasBottomLabel">Attack Result</h5>
            </div>
            <div class="col text-end">
              <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
          </div>
        </div>
      </div>
      <div class="offcanvas-body small">
        <div class="container-fluid combat-events">
            ${eventRowsHtml}
        </div>
      </div>
    `;

    const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(document.getElementById(this.offcanvasId));
    bsOffcanvas.show();
  }
}
