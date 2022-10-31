import {COMBAT_EVENT_LABELS, EVENTS, IMG} from "../../modules/Constants.js";

export class UICombatEventViewer {
  /**
   * @param {GameState} state
   */
  constructor(state) {
    this.state = state;
    this.events = [];
    this.playerLeft = null;
  }

  initOneTimeListeners() {
    Object.keys(EVENTS.COMBAT).forEach(key => {
      window.addEventListener(EVENTS.COMBAT[key], this.addEvent.bind(this));
    });
    document.getElementById(this.state.offcanvasId).addEventListener('hidden.bs.offcanvas', function() {
      if (this.state.player.isDefeated() || this.state.enemy.isDefeated()) {
        window.dispatchEvent(new CustomEvent(EVENTS.RENDER.RENDER_GAME));
      }
      if (this.state.turnChangeRequired) {
        this.state.turnChangeRequired = false;
        window.dispatchEvent(new CustomEvent(EVENTS.TURNS.END_TURN));
      }
    }.bind(this));
  }

  /**
   * @param {CombatEvent} e
   */
  addEvent(e) {
    if (e.type === EVENTS.COMBAT.COMBAT_TARGETED) {
      this.events = [];
      if (e.sourceStruct.playerId === this.state.player.id) {
        this.playerLeft = this.state.player;
      } else {
        this.playerLeft = this.state.enemy;
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
    return `<img src="${IMG.ICONS}icon-ambit-${ambit.toLowerCase()}.png" alt="${ambit.toLowerCase()} ambit">`;
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

  /**
   * @param {string} side (LEFT|RIGHT)
   * @param {Struct} struct
   * @param {number} previousHealth
   * @param {number} newHealth
   * @return {string}
   */
  renderStruct(side, struct, previousHealth, newHealth) {
    return `
      <div class="col">
        <div class="row">
          <div class="col text-center">
            <img src="${IMG.ICONS}icon-location-pin.png" alt="location-pin"><strong>:</strong>
            ${this.getAmbitIcon(struct.operatingAmbit)} ${struct.getDisplayAmbitSlot()}
          </div>
        </div>
        <div class="row">
          <div class="col text-center">
            <div class="combat-event-struct-image-wrapper ${side === 'LEFT' ? '' : 'flip-img-x'}">
              <img
                class="combat-event-struct-image img-thumbnail"
                src="${struct.image}"
                alt="${struct.unitType}"
              >
              <div class="combat-event-struct-image-overlay ${newHealth === 0 ? 'destroyed' : ''}"></div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="col text-center">
              <img src="${IMG.ICONS}icon-health.png"
                 alt="health"
              ><strong>:</strong>
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
      html += `<img src="${IMG.LARGE_ICONS}large-icon-arrow-right-blocked.png" alt="blocked"></a>`;
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

          ${this.renderStruct('LEFT', leftStruct, leftStructPreviousHealth, leftStructNewHealth)}

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
                <img src="${IMG.ICONS}icon-fire.png" alt="fire"> ${damageAmount}
              </div>
            </div>
            ` : ''}
          </div>

          ${this.renderStruct('RIGHT', rightStruct, rightStructPreviousHealth, rightStructNewHealth)}

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
            <button type="button" class="btn btn-success offcanvas-close" data-bs-dismiss="offcanvas">Close</button>
        </div>
      </div>
    `;
  }

  render() {
    let eventRowsHtml = '';
    for (let i = 0; i < this.events.length; i++) {
      if (this.events[i].type === EVENTS.COMBAT.COMBAT_ENDED) {
        eventRowsHtml += this.renderEndRow();
        this.state.turnChangeRequired = true;
      } else {
        eventRowsHtml += this.renderEventRow(this.events[i]);
      }
    }

    document.getElementById(this.state.offcanvasId).innerHTML = `
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

    const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(document.getElementById(this.state.offcanvasId));
    bsOffcanvas.show();
  }
}
