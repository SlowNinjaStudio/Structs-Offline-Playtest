import {
  AMBITS,
  DEFENSE_COMPONENT_TYPES,
  DEFENSE_COMPONENTS,
  EVENTS,
  IMG,
  MANUAL_WEAPON_SLOTS,
  MAX_FLEET_STRUCTS_PER_AMBIT
} from "../../modules/Constants.js";
import {Util} from "../../modules/util/Util.js";
import {CounterMeasure} from "../../modules/struct_components/CounterMeasure.js";
import {StructAction} from "../../modules/StructAction.js";
import {StructRefDTO} from "../../modules/dtos/StructRefDTO.js";

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
        new StructRefDTO(
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
    return this.player.id === targetStruct.playerId
      && this.struct.id !== targetStruct.id;
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
              <img src="${IMG.ICONS}icon-defended-info.png" alt="defended">
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
              ${this.isDefenseComponentEnabled() ? '' : 'disabled'}
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
   * @param {string} imgClassName
   * @return {string}
   */
  getAmbitIcon(ambit, imgClassName = '') {
    return `<a href="javascript: void(0)"
         data-bs-toggle="popover"
         data-bs-content="${this.util.titleCase(ambit)} Ambit"
      ><img src="${IMG.ICONS}icon-ambit-${ambit.toLowerCase()}.png" class="${imgClassName}" alt="${ambit.toLowerCase()} ambit"></a>`;
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
      ><img src="${IMG.ICONS}icon-fire.png" alt="fire"></a> ${damageValue} DMG`;
  }

  /**
   * @param {boolean} isGuided
   * @param {string} labelPrefix
   */
  getGuidedIcon(isGuided, labelPrefix = '') {
    if (isGuided) {
      return `<a href="javascript: void(0)"
           data-bs-toggle="popover"
           title="Guided"
           data-bs-content="Some units can defend against guided attacks."
        ><img src="${IMG.ICONS}icon-accuracy.png" alt="guided"></a> ${labelPrefix} Guided`;
    }
    return `<a href="javascript: void(0)"
         data-bs-toggle="popover"
         title="Unguided"
         data-bs-content="Some units can defend against unguided attacks."
      ><img src="${IMG.ICONS}icon-unguided.png" alt="unguided"></a> ${labelPrefix} Unguided`;
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
   * @param {string} label
   * @return {string}
   */
  getDamageReductionIcon(damageValue, label = '') {
    return `<a href="javascript: void(0)"
         data-bs-toggle="popover"
         title="Incoming Damage Reduction"
         data-bs-content="The amount incoming damage is reduced by."
      ><img src="${IMG.ICONS}icon-damage-down.png" alt="damage-down"></a> ${label} ${damageValue}`;
  }

  /**
   * @return {string}
   */
  getMoveIcon() {
    return `<a href="javascript: void(0)"
         data-bs-toggle="popover"
         title="Movement Ability"
         data-bs-content="This struct can change ambits."
      ><img src="${IMG.ICONS}icon-speed.png" alt="speed"></a> Movement Ability: Can Move to Target a Struct in a Different Ambit or Move to an Ambit That is Better Defeneded`;
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
      ><img src="${IMG.ICONS}icon-counter-attack-cancel.png" alt="no counter attack"></a>
      Indirect Combat: Cannot Counter-Attack or be Counter-Attacked`;
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
    return `${damage}, ${guided}, Targets ${ambits}`;
  }

  /**
   * @param {Struct} struct
   * @return {string}
   */
  getPassiveWeaponIcons(struct) {
    const icons = [];
    if (struct.passiveWeapon.probabilityOnDeath.toString() === '1/1') {
      icons.push(this.getOnDeathIcon());
    }
    if (struct.passiveWeapon.probability.toString() === '1/1') {
      icons.push(this.getDamageIcon(`${struct.passiveWeapon.damage}`));
    }
    if (struct.passiveWeapon.damage !== struct.passiveWeapon.damageSameAmbit) {
      icons.push(this.getSameAmbitDamageIcon(`${struct.passiveWeapon.damageSameAmbit}`));
    }
    let iconsString = icons.join(', ');
    if (iconsString) {
      iconsString += ', Can Counter ';
      if (this.struct.isCommandStruct()) {
        iconsString += this.getIconsForAmbits([this.struct.operatingAmbit]);
      } else {
        iconsString += this.getIconsForAmbits([... new Set([
          ...this.struct.manualWeaponPrimary.ambits,
          ...(this.struct.manualWeaponSecondary ? this.struct.manualWeaponSecondary.ambits : [])
        ])]);
      }
    }

    return iconsString;
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
    return `${stealth} Stealth Mode: Can Hide from ${ambits} Attacking Structs`;
  }

  /**
   * @param {Armour|DefenseComponent} armour
   * @return {string}
   */
  getArmourIcons(armour) {
    return this.getDamageReductionIcon(`${armour.damageReduction}`, 'Armour: Reduces damage by')
  }

  /**
   * @param {CounterMeasure|DefenseComponent} counterMeasure
   * @return {string}
   */
  getCounterMeasureIcons(counterMeasure) {
    return this.getGuidedIcon(
      counterMeasure.guided,
      `${counterMeasure.probability.toString()} Chance to Evade Attacks that are`
    );
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
   * @param {string} ambit
   * @param {Struct|undefined|null} struct
   * @param {boolean} isCommandSlot
   * @return {string}
   */
  renderMiniMapSlot(ambit, struct = undefined, isCommandSlot = false) {
    const structImage = struct ? `<img src="${struct.image}" alt="${struct.unitType}" class="mini-map-struct">` : '';
    const commandSlot = isCommandSlot ? 'mini-map-command-slot' : '';
    return `
      <div class="col-auto mini-map-slot mini-map-ambit-${ambit.toLowerCase()} ${commandSlot}">
        <div class="mini-map-struct-container">${structImage}</div>
      </div>
    `;
  }

  /**
   * @param {string} ambit
   * @param {Struct[]} structs
   * @param {boolean} includeCommandColumn
   * @param {Struct} commandStruct
   * @return {string}
   */
  renderMiniMapAmbitRow(ambit, structs, includeCommandColumn = false, commandStruct = null) {
    const maxSlots = structs.reduce(
      (max, struct) => Math.max(max, parseInt(struct.getDisplayAmbitSlot())),
      MAX_FLEET_STRUCTS_PER_AMBIT[ambit]
    );

    let slots = '';
    for (let i = 1; i <= maxSlots; i++) {
      const struct = structs.find(defender => parseInt(defender.getDisplayAmbitSlot()) === i);
      slots += this.renderMiniMapSlot(ambit, struct);
    }

    if (includeCommandColumn) {
      const commandSlot = this.renderMiniMapSlot(ambit, commandStruct, true);
      slots = (this.player.id === this.state.player.id) ? `${commandSlot} ${slots}` : `${slots} ${commandSlot}`;
    }

    return `<div class="row g-0">${slots}</div>`;
  }

  /**
   * @param {Struct} struct
   * @param {string} ambit
   * @return {string}
   */
  getDefendersByAmbit(struct, ambit) {
    const ambitDefenders = struct.defenders.filter(defender => defender.operatingAmbit === ambit);
    return this.renderMiniMapAmbitRow(ambit, ambitDefenders);
  }

  /**
   * @param {Struct} struct
   * @param {string} ambit
   * @return {string}
   */
  getDefendingByAmbit(struct, ambit) {
    let defending = [];
    let commandStruct = null;

    if (struct.defending && struct.defending.operatingAmbit === ambit) {
      if (struct.defending.isCommandStruct()) {
        commandStruct = struct.defending;
      } else {
        defending.push(struct.defending);
      }
    }

    return this.renderMiniMapAmbitRow(ambit, defending, true, commandStruct);
  }

  /**
   * @param {Struct} defending
   * @return {string}
   */
  getDefendingIcons(defending) {
    const sideClass = (this.player.id === this.state.player.id) ? 'mini-map-player' : 'mini-map-enemy';
    return `
      <div class="col-6 p-2 mb-2 struct-details-group">
        <div>
          <a href="javascript: void(0)"
             data-bs-toggle="popover"
             title="Defending"
             data-bs-content="The struct this struct is defending."
          ><img src="${IMG.ICONS}icon-rook.png" alt="rook"></a> Defending:
        </div>
        <div class="${sideClass}">
          ${this.getDefendingByAmbit(this.struct, AMBITS.SPACE)}
          ${this.getDefendingByAmbit(this.struct, AMBITS.SKY)}
          ${this.getDefendingByAmbit(this.struct, AMBITS.LAND)}
          ${this.getDefendingByAmbit(this.struct, AMBITS.WATER)}
        </div>
      </div>
    `;
  }

  /**
   * @param {Struct} struct
   * @return {string}
   */
  getDefendedByIcons(struct) {
    const sideClass = (this.player.id === this.state.player.id) ? 'mini-map-player' : 'mini-map-enemy';
    return `
      <div class="col-5 p-2 mb-2 struct-details-group">
        <div class="row">
          <div class="col">
            <a href="javascript: void(0)"
               data-bs-toggle="popover"
               title="Defended By"
               data-bs-content="The list of structs defending this struct."
            ><img src="${IMG.ICONS}icon-defended-info.png" alt="defended"></a> Defended By:
          </div>
        </div>
        <div class="${sideClass}">
          ${this.getDefendersByAmbit(this.struct, AMBITS.SPACE)}
          ${this.getDefendersByAmbit(this.struct, AMBITS.SKY)}
          ${this.getDefendersByAmbit(this.struct, AMBITS.LAND)}
          ${this.getDefendersByAmbit(this.struct, AMBITS.WATER)}
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

          <div class="attributes-container container-fluid">
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
                    ></a><strong>:</strong>
                    ${this.struct.currentHealth}/${this.struct.maxHealth}
                  </div>
                </div>
                <div class="row">
                  <div class="col text-center">
                    <a href="javascript: void(0)"
                       data-bs-toggle="popover"
                       title="Struct Position"
                       data-bs-content="This struct's position by ambit and slot number."
                    ><img src="${IMG.ICONS}icon-location-pin.png" alt="location-pin"></a><strong>:</strong>
                    ${this.getAmbitIcon(this.struct.operatingAmbit)} ${this.struct.getDisplayAmbitSlot()}
                  </div>
                </div>
              </div>
              <div class="col">

                <div class="row">
                  <div class="col p-2 mb-2 struct-details-group">
                    <div>
                      <a href="javascript: void(0)"
                       data-bs-toggle="popover"
                       data-bs-content="Primary Weapon"
                      ><img src="${IMG.ICONS}icon-attack-range.png" alt="attack-range"></a>
                      ${this.struct.manualWeaponPrimary.getActionLabel()}<strong>:</strong>
                    </div>
                    <div>
                      ${this.getManualWeaponIcons(this.struct.manualWeaponPrimary)}
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col p-2 mb-2 struct-details-group">
                    <div>
                      <a href="javascript: void(0)"
                       data-bs-toggle="popover"
                       data-bs-content="Secondary Weapon"
                      ><img src="${IMG.ICONS}icon-attack-range.png" alt="attack-range"></a>
                      ${this.struct.manualWeaponSecondary ? this.struct.manualWeaponSecondary.getActionLabel() : 'N/A'}<strong>:</strong>
                    </div>
                    <div>
                      ${this.struct.manualWeaponSecondary ? this.getManualWeaponIcons(this.struct.manualWeaponSecondary) : '--'}
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col p-2 mb-2 struct-details-group">
                    <div>
                      <a href="javascript: void(0)"
                         data-bs-toggle="popover"
                         title="Counter Attack Capabilities"
                         data-bs-content="Structs counter-attack when attacked. If this struct is defending a struct that is targeted, this struct will also counter-attack."
                      ><img src="${IMG.ICONS}icon-counter-attack.png" alt="counter-attack"></a>
                      Counter-Attack<strong>:</strong>
                    </div>
                    <div>
                        ${this.struct.passiveWeapon ? this.getPassiveWeaponIcons(this.struct) : '--'}
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col p-2 mb-2 struct-details-group">
                    <div>
                      <a href="javascript: void(0)"
                         data-bs-toggle="popover"
                         data-bs-content="Defensive Capabilities"
                      ><img src="${IMG.ICONS}icon-def-melee.png" alt="def-melee"></a>
                      Defenses<strong>:</strong>
                    </div>
                    <div>
                        ${this.getDefensiveComponentIcons(this.struct.defenseComponent)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="defense-container container-fluid">
            <div class="row justify-content-between">
              ${this.getDefendingIcons(this.struct.defending)}
              ${this.getDefendedByIcons(this.struct)}
            </div>
          </div>

        </div>
      </div>
    `;
  }
}
