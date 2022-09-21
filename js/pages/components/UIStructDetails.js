import {
  AMBITS,
  DEFENSE_COMPONENT_TYPES,
  DEFENSE_COMPONENTS,
  EVENTS,
  IMG,
  MANUAL_WEAPON_SLOTS
} from "../../modules/Constants.js";
import {Util} from "../../modules/util/Util.js";
import {CounterMeasure} from "../../modules/struct_components/CounterMeasure.js";
import {StructAction} from "../../modules/StructAction.js";
import {StructRef} from "../../modules/StructRef.js";

export class UIStructDetails {

  /**
   * @param {GameState} state
   * @param {Struct} struct
   * @param {Player} player
   * @param {string} offcanvasId
   */
  constructor(state, struct, player, offcanvasId) {
    this.state = state;
    this.struct = struct;
    this.player = player;
    this.offcanvasId = offcanvasId;
    this.util = new Util();
    this.primaryAttackButtonId = 'primaryAttackButton';
    this.secondaryAttackButtonId = 'secondaryAttackButton';
    this.defendButtonId = 'defendButton';
    this.defenseComponentButtonId = 'defenseComponentButton';
  }

  /**
   * @param {string} eventType
   * @param {string} actionButtonId
   * @param {string} offcanvasId
   * @param {boolean} selfDispatch
   * @param {function} applicableStructsFn
   * @return {function}
   */
  getActionFunction(
    eventType,
    actionButtonId,
    offcanvasId,
    selfDispatch = false,
    applicableStructsFn = () => true
  ) {
    const actionButton = document.getElementById(actionButtonId);
    const domOffcanvas = document.getElementById(offcanvasId);
    const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(domOffcanvas);
    return function() {
      bsOffcanvas.hide();
      const playerId = actionButton.getAttribute('data-player-id');
      const structId = actionButton.getAttribute('data-struct-id');
      const isCommandStruct = !!parseInt(actionButton.getAttribute('data-is-command-struct'));
      const action = new StructAction(
        eventType,
        new StructRef(
          playerId,
          structId,
          isCommandStruct
        )
      );
      action.applicableStructsFilter = applicableStructsFn;

      if (selfDispatch) {
        this.state.action = null;
        action.dispatchEvent();
      } else {
        this.state.action = action;
        window.dispatchEvent(new CustomEvent(EVENTS.RENDER.RENDER_GAME));
      }
    }.bind(this);
  }

  /**
   * @param {Struct} targetStruct
   */
  primaryAttackStructFilter(targetStruct) {
    return this.player.id !== targetStruct.playerId
      && this.struct.canAttack(this.struct.getManualWeapon(MANUAL_WEAPON_SLOTS.PRIMARY), targetStruct);
  }

  /**
   * @param {Struct} targetStruct
   */
  secondaryAttackStructFilter(targetStruct) {
    return this.player.id !== targetStruct.playerId
      && this.struct.canAttack(this.struct.getManualWeapon(MANUAL_WEAPON_SLOTS.SECONDARY), targetStruct);
  }

  /**
   * @param {Struct} targetStruct
   * @return {boolean}
   */
  defendStructFilter(targetStruct) {
    return this.player.id === targetStruct.playerId;
  }

  /**
   * @param {Struct} targetStruct
   * @return {boolean}
   */
  moveStructFilter(targetStruct) {
    return false;
  }

  initPrimaryAttackListener() {
    const primaryAttackButton = document.getElementById(this.primaryAttackButtonId);
    if (primaryAttackButton) {
      primaryAttackButton.addEventListener('click', this.getActionFunction(
        EVENTS.ACTIONS.ACTION_ATTACK_PRIMARY,
        this.primaryAttackButtonId,
        this.offcanvasId,
        false,
        this.primaryAttackStructFilter.bind(this)
      ));
    }
  }

  initSecondaryAttackListener() {
    const secondaryAttackButton = document.getElementById(this.secondaryAttackButtonId);
    if (secondaryAttackButton) {
      secondaryAttackButton.addEventListener('click', this.getActionFunction(
        EVENTS.ACTIONS.ACTION_ATTACK_SECONDARY,
        this.secondaryAttackButtonId,
        this.offcanvasId,
        false,
        this.secondaryAttackStructFilter.bind(this)
      ));
    }
  }

  initDefendListener() {
    const defendButton = document.getElementById(this.defendButtonId);
    if (defendButton) {
      defendButton.addEventListener('click', this.getActionFunction(
        EVENTS.ACTIONS.ACTION_DEFEND,
        this.defendButtonId,
        this.offcanvasId,
        false,
        this.defendStructFilter.bind(this)
      ));
    }
  }

  initStealthModeListener() {
    const defenseComponentButton = document.getElementById(this.defenseComponentButtonId);
    if (defenseComponentButton
      && defenseComponentButton.getAttribute('data-action-event') === EVENTS.ACTIONS.ACTION_STEALTH_MODE) {
      defenseComponentButton.addEventListener('click', this.getActionFunction(
        EVENTS.ACTIONS.ACTION_STEALTH_MODE,
        this.defenseComponentButtonId,
        this.offcanvasId,
        true
      ));
    }
  }

  initMoveListener() {
    const defenseComponentButton = document.getElementById(this.defenseComponentButtonId);
    if (defenseComponentButton
      && defenseComponentButton.getAttribute('data-action-event') === EVENTS.ACTIONS.ACTION_MOVE) {
      defenseComponentButton.addEventListener('click', this.getActionFunction(
        EVENTS.ACTIONS.ACTION_MOVE,
        this.defenseComponentButtonId,
        this.offcanvasId,
        false,
        this.moveStructFilter
      ));
    }
  }

  initListeners() {
    this.initPrimaryAttackListener();
    this.initSecondaryAttackListener();
    this.initDefendListener();
    this.initStealthModeListener();
    this.initMoveListener();
  }

  /**
   * @return {string}
   */
  getUnavailableActionButton() {
    return `<button type="button" class="btn btn-sm btn-secondary" disabled>--</button>`;
  }

  /**
   * @return {boolean}
   */
  isPrimaryAttackEnabled() {
    return !this.struct.isHidden()
      && this.state.turn.id === this.player.id
      && this.state.numTurns > 2;
  }

  /**
   * @return {boolean}
   */
  isSecondaryAttackEnabled() {
    return !this.struct.isHidden()
      && this.state.turn.id === this.player.id
      && this.state.numTurns > 2;
  }

  /**
   * @return {boolean}
   */
  isDefendEnabled() {
    return !this.struct.isHidden() && this.state.turn.id === this.player.id;
  }

  /**
   * @return {boolean}
   */
  isDefenseComponentEnabled() {
    return this.state.turn.id === this.player.id;
  }

  /**
   * @return {string}
   */
  getActionButtons() {
    return `
      <div class="actions-container">
        <div class="row">
          <div class="col d-grid">
          ${this.struct.manualWeaponPrimary ? `
            <button
              id="${this.primaryAttackButtonId}"
              type="button"
              class="btn btn-danger btn-sm"
              data-player-id="${this.player.id}"
              data-struct-id="${this.struct.id}"
              data-is-command-struct="${this.struct.isCommandStruct() ? 1: 0}"
              ${this.isPrimaryAttackEnabled() ? '' : 'disabled'}
            >
              ${this.struct.manualWeaponPrimary.getActionLabel()}
              <img src="${IMG.ICONS}icon-attack-range.png" alt="attack-range">
              (1)
            </button>
          ` : this.getUnavailableActionButton()}
          </div>
          <div class="col d-grid">
          ${this.struct.canDefend ? `
            <button
              id="${this.defendButtonId}"
              type="button"
              class="btn btn-primary btn-sm"
              data-player-id="${this.player.id}"
              data-struct-id="${this.struct.id}"
              data-is-command-struct="${this.struct.isCommandStruct() ? 1: 0}"
              ${this.isDefendEnabled() ? '' : 'disabled'}
            >
              Defend
              <img src="${IMG.ICONS}icon-strength.png" alt="strength">
            </button>
          ` : this.getUnavailableActionButton()}
          </div>
        </div>
        <div class="row">
          <div class="col d-grid">
          ${this.struct.manualWeaponSecondary ? `
            <button
              id="${this.secondaryAttackButtonId}"
              type="button"
              class="btn btn-danger btn-sm"
              data-player-id="${this.player.id}"
              data-struct-id="${this.struct.id}"
              data-is-command-struct="${this.struct.isCommandStruct() ? 1: 0}"
              ${this.isSecondaryAttackEnabled() ? '' : 'disabled'}
            >
              ${this.struct.manualWeaponSecondary.getActionLabel()}
              <img src="${IMG.ICONS}icon-attack-range.png" alt="attack-range">
              (2)
            </button>
          ` : this.getUnavailableActionButton()}
          </div>
          <div class="col d-grid">
          ${this.struct.defenseComponent.name === DEFENSE_COMPONENTS.STEALTH_MODE ? `
            <button
              id="${this.defenseComponentButtonId}"
              type="button"
              class="btn btn-secondary btn-sm btn-dark"
              data-player-id="${this.player.id}"
              data-struct-id="${this.struct.id}"
              data-is-command-struct="${this.struct.isCommandStruct() ? 1: 0}"
              data-action-event="${EVENTS.ACTIONS.ACTION_STEALTH_MODE}"
              ${this.isDefenseComponentEnabled() ? '' : 'disabled'}
            >
              ${this.struct.defenseComponent.getActionLabel()}
              ${this.struct.defenseComponent.isActive ? `
              <img src="${IMG.ICONS}icon-visible.png" alt="visible">
              `: `
              <img src="${IMG.ICONS}icon-invisible.png" alt="invisible">
              `}
            </button>
          ` : (this.struct.defenseComponent.type === DEFENSE_COMPONENT_TYPES.AFTERMARKET_ENGINE ? `
            <button
              id="${this.defenseComponentButtonId}"
              type="button"
              class="btn btn-warning btn-sm"
              data-player-id="${this.player.id}"
              data-struct-id="${this.struct.id}"
              data-is-command-struct="${this.struct.isCommandStruct() ? 1: 0}"
              data-action-event="${EVENTS.ACTIONS.ACTION_MOVE}"
            >
              ${this.struct.defenseComponent.getActionLabel()}
              <img src="${IMG.ICONS}icon-speed.png" alt="speed">
            </button>
          ` : this.getUnavailableActionButton())}
          </div>
        </div>
      </div>
    `;
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
   * @param ambits
   */
  getIconsForAmbits(ambits) {
    const icons = ambits.map(ambit => this.getAmbitIcon(ambit));
    return icons.join(' ');
  }

  /**
   * @param {string} damageValue
   * @return {string}
   */
  getDamageIcon(damageValue) {
    return `<a href="javascript: void(0)"
         data-bs-toggle="popover"
         data-bs-content="Damage Value"
      ><img src="${IMG.ICONS}icon-fire.png" alt="fire"></a> ${damageValue}`;
  }

  /**
   * @param {boolean} isGuided
   */
  getGuidedIcon(isGuided) {
    if (isGuided) {
      return `<a href="javascript: void(0)"
           data-bs-toggle="popover"
           data-bs-content="Guided"
        ><img src="${IMG.ICONS}icon-accuracy.png" alt="guided"></a>`;
    }
    return `<a href="javascript: void(0)"
         data-bs-toggle="popover"
         data-bs-content="Unguided"
      ><img src="${IMG.ICONS}icon-unguided.png" alt="unguided"></a>`;
  }

  /**
   * @param {array} damageRange
   * @return {string}
   */
  getDamageRangeAsString(damageRange) {
    if (damageRange.length === 1) {
      return `${damageRange[0]}`;
    } else if (damageRange.length > 1) {
      let sortedDamagedRange = [...damageRange].sort();
      return `${sortedDamagedRange[0]}-${sortedDamagedRange[sortedDamagedRange.length - 1]}`;
    } else {
      return '';
    }
  }

  /**
   * @return {string}
   */
  getOnDeathIcon() {
    return `<a href="javascript: void(0)"
         data-bs-toggle="popover"
         title="On Death"
         data-bs-content="The following attributes only apply on death."
      ><img src="${IMG.ICONS}icon-skull.png" alt="skull"></a>`;
  }

  /**
   * @param {string} damageValue
   * @return {string}
   */
  getSameAmbitDamageIcon(damageValue) {
    return `<a href="javascript: void(0)"
         data-bs-toggle="popover"
         title="Same Ambit Damage Value"
         data-bs-content="The damage value when the attacker and defender have the same operating ambit."
      ><img src="${IMG.ICONS}icon-damage-same-ambit.png" alt="same ambit damage"></a> ${damageValue}`;
  }

  /**
   * @param {string} damageValue
   * @return {string}
   */
  getDamageReductionIcon(damageValue) {
    return `<a href="javascript: void(0)"
         data-bs-toggle="popover"
         title="Incoming Damage Reduction"
         data-bs-content="The amount incoming damage is reduced by."
      ><img src="${IMG.ICONS}icon-damage-down.png" alt="damage-down"></a> -${damageValue}`;
  }

  /**
   * @return {string}
   */
  getMoveIcon() {
    return `<a href="javascript: void(0)"
         data-bs-toggle="popover"
         title="Movement Ability"
         data-bs-content="This struct can change ambits."
      ><img src="${IMG.ICONS}icon-speed.png" alt="speed"></a>`;
  }

  /**
   * @return {string}
   */
  getStealthIcon() {
    return `<a href="javascript: void(0)"
         data-bs-toggle="popover"
         title="Stealth Mode"
         data-bs-content="This struct can hide from attacks from the following ambits."
      ><img src="${IMG.ICONS}icon-invisible.png" alt="invisible"></a>`;
  }

  /**
   * @return {string}
   */
  getIndirectCombatIcon() {
    return `<a href="javascript: void(0)"
         data-bs-toggle="popover"
         title="Indirect Combat"
         data-bs-content="This struct cannot counter attack or be counter attacked."
      ><img src="${IMG.ICONS}icon-counter-attack-cancel.png" alt="no counter attack"></a>`;
  }

  /**
   * @param {ManualWeapon} weapon
   * @return {string}
   */
  getManualWeaponIcons(weapon) {
    const damageString = this.getDamageRangeAsString(weapon.damageRange);
    const damage = this.getDamageIcon(damageString);
    const guided = this.getGuidedIcon(weapon.isGuided);
    const ambits = this.getIconsForAmbits(weapon.ambits);
    return `${damage}, ${guided}, ${ambits}`;
  }

  /**
   * @param {PassiveWeapon} weapon
   * @return {string}
   */
  getPassiveWeaponIcons(weapon) {
    const icons = [];
    if (weapon.probabilityOnDeath.toString() === '1/1') {
      icons.push(this.getOnDeathIcon());
    }
    if (weapon.probability.toString() === '1/1') {
      icons.push(this.getDamageIcon(`${weapon.damage}`));
    }
    if (weapon.damage !== weapon.damageSameAmbit) {
      icons.push(this.getSameAmbitDamageIcon(`${weapon.damageSameAmbit}`));
    }
    return icons.join(', ');
  }

  /**
   * @return {string}
   */
  getAftermarketEngineIcons() {
    return this.getMoveIcon();
  }

  /**
   * @param {AmbitDefense|DefenseComponent} ambitDefense
   * @return {string}
   */
  getAmbitDefenseIcons(ambitDefense) {
    const stealth = this.getStealthIcon();
    const ambits = this.getIconsForAmbits(ambitDefense.ambitsDefendedAgainst);
    return `${stealth} ${ambits}`;
  }

  /**
   * @param {Armour|DefenseComponent} armour
   * @return {string}
   */
  getArmourIcons(armour) {
    return this.getDamageReductionIcon(`${armour.damageReduction}`)
  }

  /**
   * @param {CounterMeasure|DefenseComponent} counterMeasure
   * @return {string}
   */
  getCounterMeasureIcons(counterMeasure) {
    const guided = this.getGuidedIcon(counterMeasure.guided);
    return `${guided} ${counterMeasure.probability.toString()}`;
  }

  /**
   * @return {string}
   */
  getEvadeCounterAttackIcons() {
    return this.getIndirectCombatIcon();
  }

  /**
   * @param {DefenseComponent} defenseComponent
   * @return {string}
   */
  getDefensiveComponentIcons(defenseComponent) {
    let icons = '--';
    switch(defenseComponent.type) {
      case DEFENSE_COMPONENT_TYPES.AFTERMARKET_ENGINE:
        icons = this.getAftermarketEngineIcons();
        break;
      case DEFENSE_COMPONENT_TYPES.AMBIT_DEFENSE:
        icons = this.getAmbitDefenseIcons(defenseComponent);
        break;
      case DEFENSE_COMPONENT_TYPES.ARMOUR:
        icons = this.getArmourIcons(defenseComponent);
        break;
      case DEFENSE_COMPONENT_TYPES.COUNTER_MEASURE:
        icons = this.getCounterMeasureIcons(defenseComponent);
        break;
      case DEFENSE_COMPONENT_TYPES.EVADE_COUNTER_ATTACK:
        icons = this.getEvadeCounterAttackIcons();
        break;
    }
    return icons;
  }

  /**
   * @param {Struct} defending
   * @return {string}
   */
  getDefendingIcons(defending) {
    return `
      <div class="row">
        <div class="col-auto pe-1">
          <a href="javascript: void(0)"
             data-bs-toggle="popover"
             title="Defending"
             data-bs-content="The struct this struct is defending."
          ><img src="${IMG.ICONS}icon-rook.png" alt="rook"></a>:
        </div>
        <div class="col-auto ps-1">
        ${defending ? `
          ${this.getAmbitIcon(defending.operatingAmbit)} ${defending.getDisplayAmbitSlot()}
        ` : '--'}
        </div>
      </div>
    `;
  }

  /**
   * @param {Struct} struct
   * @param {string} ambit
   * @return {string}
   */
  getDefendersByAmbit(struct, ambit) {
    const ambitDefenders = struct.defenders.filter(defender => defender.operatingAmbit === ambit);
    let slots = ambitDefenders.reduce((slotsList, defender) => `${slotsList}, ${defender.getDisplayAmbitSlot()}`, '');
    slots = slots.length > 2 ? slots.slice(2) : '--';
    return `${this.getAmbitIcon(ambit)} ${slots}`;
  }

  /**
   * @param {Struct} struct
   * @return {string}
   */
  getDefendedByIcons(struct) {
    return `
      <div class="row">
        <div class="col-auto pe-1">
          <a href="javascript: void(0)"
             data-bs-toggle="popover"
             title="Defended By"
             data-bs-content="The list of structs defending this struct."
          ><img src="${IMG.ICONS}icon-strength.png" alt="strength"></a>:
        </div>
        <div class="col ps-1">
          <div class="row">
            <div class="col">
              ${this.getDefendersByAmbit(this.struct, AMBITS.SPACE)}
            </div>
            <div class="col">
              ${this.getDefendersByAmbit(this.struct, AMBITS.SKY)}
            </div>
          </div>
          <div class="row">
            <div class="col">
              ${this.getDefendersByAmbit(this.struct, AMBITS.LAND)}
            </div>
            <div class="col">
              ${this.getDefendersByAmbit(this.struct, AMBITS.WATER)}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  render() {
    return `
      <div class="offcanvas-header">
        <div class="container-fluid">
          <div class="row">
            <div class="col text-start">
              <h5 class="offcanvas-title" id="offcanvasBottomLabel">${this.util.titleCase(this.player.name)}</h5>
            </div>
            <div class="col text-end">
              <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
          </div>
        </div>
      </div>
      <div class="offcanvas-body small">
        <div class="container-fluid">

          ${this.getActionButtons()}

          <div class="attributes-container">
            <div class="row">
              <div class="col-4">
                <div class="row">
                  <div class="col text-center">
                    <img src="${this.struct.image}" alt="${this.struct.unitType}" class="struct-image img-thumbnail">
                  </div>
                </div>
                <div class="row">
                  <div class="col text-center">${this.struct.getUnitTypeLabel()}</div>
                </div>
                <div class="row">
                  <div class="col text-center">
                    <a href="javascript: void(0)"
                       data-bs-toggle="popover"
                       title="Health"
                       data-bs-content="Current Health / Max Health"
                    ><img src="${IMG.ICONS}icon-health.png"
                       alt="health"
                    ></a><strong>:</strong> ${this.struct.currentHealth}/${this.struct.maxHealth}
                  </div>
                </div>
              </div>
              <div class="col">
                <div class="row">
                  <div class="col-3 pe-1">
                    <a href="javascript: void(0)"
                       data-bs-toggle="popover"
                       title="Struct Position"
                       data-bs-content="This struct's position by ambit and slot number."
                    ><img src="${IMG.ICONS}icon-location-pin.png" alt="location-pin"></a><strong>:</strong>
                  </div>
                  <div class="col ps-1">
                    ${this.getAmbitIcon(this.struct.operatingAmbit)} ${this.struct.getDisplayAmbitSlot()}
                  </div>
                </div>
                <div class="row">
                  <div class="col-3 pe-1">
                    <a href="javascript: void(0)"
                       data-bs-toggle="popover"
                       data-bs-content="Primary Weapon"
                    ><strong>1</strong> <img src="${IMG.ICONS}icon-attack-range.png" alt="attack-range"></a><strong>:</strong>
                  </div>
                  <div class="col ps-1">
                    ${this.getManualWeaponIcons(this.struct.manualWeaponPrimary)}
                  </div>
                </div>
                <div class="row">
                  <div class="col-3 pe-1">
                    <a href="javascript: void(0)"
                       data-bs-toggle="popover"
                       data-bs-content="Secondary Weapon"
                    ><strong>2</strong> <img src="${IMG.ICONS}icon-attack-range.png" alt="attack-range"></a><strong>:</strong>
                  </div>
                  <div class="col ps-1">
                    ${this.struct.manualWeaponSecondary ? this.getManualWeaponIcons(this.struct.manualWeaponSecondary) : '--'}
                  </div>
                </div>

                <div class="row">
                  <div class="col-3 pe-1">
                    <a href="javascript: void(0)"
                       data-bs-toggle="popover"
                       data-bs-content="Counter Attack Capabilities"
                    ><img src="${IMG.ICONS}icon-counter-attack.png" alt="counter-attack"></a><strong>:</strong>
                  </div>
                  <div class="col ps-1">
                    ${this.struct.passiveWeapon ? this.getPassiveWeaponIcons(this.struct.passiveWeapon) : '--'}
                  </div>
                </div>
                <div class="row">
                  <div class="col-3 pe-1">
                    <a href="javascript: void(0)"
                       data-bs-toggle="popover"
                       data-bs-content="Defensive Capabilities"
                    ><img src="${IMG.ICONS}icon-def-melee.png" alt="def-melee"></a><strong>:</strong>
                  </div>
                  <div class="col ps-1">
                    ${this.getDefensiveComponentIcons(this.struct.defenseComponent)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="defense-container">
            ${this.getDefendingIcons(this.struct.defending)}
            ${this.getDefendedByIcons(this.struct)}
          </div>

        </div>
      </div>
    `;
  }
}
