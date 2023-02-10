import {StructBuilder} from "../../modules/StructBuilder.js";
import {Appraiser} from "../../modules/Appraiser.js";
import {
  DEFENSE_COMPONENT_TYPES,
  EVENTS,
  GAME_PHASES,
  ICONS,
  PLAYER_FLEET_TYPES,
  UNITS_BY_AMBIT
} from "../../modules/Constants.js";
import {Util} from "../../modules/util/Util.js";

export class UIStructSelection {
  /**
   * @param {GameState} state
   * @param {Player} selectingPlayer
   * @param {string} ambit
   * @param {number} ambitSlot
   * @param {Struct} preselectedStruct
   * @param {boolean} isPlanetarySlot
   */
  constructor(
    state,
    selectingPlayer,
    ambit,
    ambitSlot,
    preselectedStruct = null,
    isPlanetarySlot = false
  ) {
    this.state = state;
    this.selectingPlayer = selectingPlayer;
    this.ambit = ambit;
    this.ambitSlot = ambitSlot;
    this.preselectedStruct = preselectedStruct;
    this.isPlanetarySlot = isPlanetarySlot;
    this.fleetType = this.isPlanetarySlot ? PLAYER_FLEET_TYPES.PLANET : PLAYER_FLEET_TYPES.FLEET;
    this.structBuilder = new StructBuilder();
    this.appraiser = new Appraiser();
    this.util = new Util();
    this.fleetSelectOptionBtnClass = 'fleet-select-option-btn';
    this.fleetSelectSaveBtnId = 'fleetSelectSaveBtn';
    this.currentSelectedUnitType = this.preselectedStruct ? this.preselectedStruct.unitType : '';
    this.preselectedStructPrice = this.preselectedStruct
      ? this.appraiser.calcUnitTypePrice(this.preselectedStruct.unitType) : 0;
  }

  initFleetSelectOptionsListeners() {
    document.querySelectorAll(`.${this.fleetSelectOptionBtnClass}`).forEach(button => {
      button.addEventListener('click', function() {
        this.currentSelectedUnitType = button.getAttribute('data-unit-type');
        this.render();
      }.bind(this));
    });
  }

  clearSlot() {
    if (!this.selectingPlayer[this.fleetType].isSlotAvailable(this.ambit, this.ambitSlot)) {
      const unitType = this.selectingPlayer[this.fleetType][this.ambit.toLowerCase()][this.ambitSlot].unitType;
      const refundAmount = this.appraiser.calcUnitTypePrice(unitType);
      this.selectingPlayer.creditManager.addCredits(refundAmount);
    }
    this.selectingPlayer[this.fleetType].clearSlot(this.ambit, this.ambitSlot);
  }

  initSaveSelection() {
    document.getElementById(this.fleetSelectSaveBtnId).addEventListener('click', function() {
      if (!this.currentSelectedUnitType) {
        this.clearSlot();
      } else if (!this.preselectedStruct || this.currentSelectedUnitType !== this.preselectedStruct.unitType) {
        this.clearSlot();
        const selectedUnit = this.structBuilder.make(this.currentSelectedUnitType);
        const price = this.appraiser.calcUnitTypePrice(this.currentSelectedUnitType);
        this.selectingPlayer.creditManager.pay(price);
        selectedUnit.operatingAmbit = this.ambit;
        this.selectingPlayer[this.fleetType].addStruct(selectedUnit, this.ambitSlot);

        if (this.state.gamePhase === GAME_PHASES.COMBAT) {
          this.state.metrics.unitsBuilt.logStruct(this.selectingPlayer, selectedUnit, this.state.numTurns);
          const selectingPlayerName = this.selectingPlayer.id === this.state.player.id ? 'player' : 'enemy';
          this.state.metrics[selectingPlayerName].incrementStructsBuilt();
        }
      }

      const domOffcanvas = document.getElementById(this.state.offcanvasId);
      const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(domOffcanvas);
      bsOffcanvas.hide();

      window.dispatchEvent(new CustomEvent(EVENTS.RENDER.RENDER_GAME));
    }.bind(this));
  }

  initListeners() {
    this.initFleetSelectOptionsListeners();
    this.initSaveSelection();
  }

  /**
   * @param {string} capLeftContent
   * @param {string} bodyContent
   * @return {string}
   */
  renderOptionAttributeSet(capLeftContent, bodyContent) {
    return `
      <div class="row m-0 mb-2">
        <div class="col-auto pill-cap-left">${capLeftContent}<div class="vertical-align-helper"></div>
        </div>
        <div class="col pill-body py-2">
          <span class="align-middle">${bodyContent}</span>
        </div>
      </div>
    `;
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
   * @param ambits
   */
  getIconsForAmbits(ambits) {
    const icons = ambits.map(ambit => ICONS[ambit]);
    return icons.join(' ');
  }

  /**
   * @param {ManualWeapon} weapon
   * @return {string}
   */
  renderManualWeaponAttributeSet(weapon) {
    if (!weapon) {
      return '';
    }
    const damageString = this.getDamageRangeAsString(weapon.damageRange);
    const ambits = this.getIconsForAmbits(weapon.ambits);
    return this.renderOptionAttributeSet(
      weapon.isGuided ? ICONS.GUIDED : ICONS.UNGUIDED,
      `${damageString} ${ICONS.DAMAGE} vs ${ambits}`
    );
  }

  /**
   * @param {DefenseComponent} defenseComponent
   * @return {string}
   */
  renderDefenseComponentAttributeSet(defenseComponent) {
    if (defenseComponent.type === DEFENSE_COMPONENT_TYPES.DEFAULT) {
      return '';
    }
    return this.renderOptionAttributeSet(
      ICONS.DEFENSE,
      this.util.titleCase(defenseComponent.name)
    );
  }

  /**
   * @param {Struct} struct
   * @return {string}
   */
  renderPowerGeneratorAttributeSet(struct) {
    if (!struct.powerGenerator) {
      return '';
    }
    return this.renderOptionAttributeSet(
      ICONS.POWER_OUTPUT,
      this.util.titleCase(`+${struct.powerGenerator.powerOutput} Watt per turn`)
    );
  }

  /**
   * @param {Struct} struct
   * @return {string}
   */
  renderPassiveWeaponAttributeSet(struct) {
    if (!struct.passiveWeapon) {
      return '';
    }

    let sameAmbitCounterAttack = '';
    let onDeathCounterAttack = '';
    let regularTargetableAmbits = struct.isCommandStruct() ? struct.operatingAmbit : struct.getTargetableAmbits();

    if (struct.passiveWeapon.damage !== struct.passiveWeapon.damageSameAmbit) {
      sameAmbitCounterAttack = `<br>${struct.passiveWeapon.damageSameAmbit} ${ICONS.DAMAGE} vs ${ICONS[struct.operatingAmbit]}`;
      regularTargetableAmbits = regularTargetableAmbits.filter(ambit => ambit !== struct.operatingAmbit);
    }

    if (struct.passiveWeapon.probabilityOnDeath.toString() === '1/1') {
      onDeathCounterAttack = `<br>Can Counter on Death`;
    }

    const ambitIcons = regularTargetableAmbits.map(ambit => ICONS[ambit]);
    let regularCounterAttack = `${struct.passiveWeapon.damage} ${ICONS.DAMAGE} vs ${ambitIcons}`;

    return this.renderOptionAttributeSet(
      ICONS.COUNTER_ATTACK,
      `${regularCounterAttack}${sameAmbitCounterAttack}${onDeathCounterAttack}`
    );
  }

  /**
   * @param {string} unitType
   * @return {string}
   */
  renderOption(unitType) {
    let unitImage = `<div class="fleet-select-unit-image-placeholder btn-close"></div>`;
    let unitName = 'Empty';
    let unitPrice = 0;
    let unitAttributes = `<div class="text-center p-2">No unit will be deployed in this space.</div>`;

    if (unitType) {
      const unit = this.structBuilder.make(unitType);
      unitImage = `<img src="${unit.image}" class="fleet-select-unit-image" alt="${unitName}">`;
      unitName = unit.unitType;
      unitPrice = this.appraiser.calcUnitTypePrice(unitType);
      unitAttributes = `
        ${this.renderManualWeaponAttributeSet(unit.manualWeaponPrimary)}
        ${this.renderManualWeaponAttributeSet(unit.manualWeaponSecondary)}
        ${this.renderPassiveWeaponAttributeSet(unit)}
        ${this.renderDefenseComponentAttributeSet(unit.defenseComponent)}
        ${this.renderPowerGeneratorAttributeSet(unit)}
      `;
    }

    const isOverBudget = unitPrice > this.getAvailableCredits();
    const isUnselectable = isOverBudget || (this.exceedsMaxStructs() && unitType);

    return `
      <div class="col-sm-6">
        <a href="javascript:void(0);" class="${this.fleetSelectOptionBtnClass}" data-unit-type="${unitType}">
          <div class="
            fleet-select-unit
            card
            pt-2
            ${this.currentSelectedUnitType === unitType ? 'fleet-select-selected' : ''}
            ${isUnselectable ? 'fleet-select-over-budget' : ''}
          ">

            <div class="container-fluid">
              <div class="row align-items-center mb-2">
                <div class="col-auto">
                  ${unitImage}
                </div>
                <div class="col ps-0">
                  <div class="row align-items-center">
                    <div class="col">
                      ${this.util.titleCase(unitName)}
                    </div>
                    <div class="col-auto text-currency-green fw-bold">
                      ${unitPrice} <div class="watt-icon"></div>
                    </div>
                  </div>
                </div>
              </div>
              ${unitAttributes}
            </div>

          </div>
        </a>
      </div>
    `;
  }

  /**
   * @return {number}
   */
  getAvailableCredits() {
    return this.selectingPlayer.creditManager.credits + this.preselectedStructPrice;
  }

  /**
   * @return {boolean}
   */
  exceedsMaxStructs() {
    return !this.preselectedStruct && !this.selectingPlayer[this.fleetType].capacityRemaining();
  }

  render() {
    let options = '';
    let units = [...UNITS_BY_AMBIT[this.fleetType.toUpperCase()][this.ambit], ''];
    for (let i = 0; i < units.length; i++) {
      options += this.renderOption(units[i]);
    }
    const selectedPrice = this.currentSelectedUnitType ? this.appraiser.calcUnitTypePrice(this.currentSelectedUnitType) : 0;
    const isOverBudget = selectedPrice > this.getAvailableCredits();
    const isUnselectable = isOverBudget || (this.exceedsMaxStructs() && this.currentSelectedUnitType);

    document.getElementById(this.state.offcanvasId).innerHTML =  `
      <div class="offcanvas-header">
        <div class="container-fluid">
          <div class="row pb-2">
            <div class="col text-start">
              <h5 class="offcanvas-title" id="offcanvasBottomLabel">${this.util.titleCase(this.ambit)} Structs</h5>
            </div>
            <div class="col text-end">
              <span class="
                fw-bold
                align-middle
                ${isOverBudget ? 'text-danger' : 'text-void-grey' }
              ">${this.selectingPlayer.creditManager.getBudgetUsageString(this.preselectedStructPrice)}</span>
              <div class="watt-icon ${isOverBudget ? 'text-danger' : 'text-void-grey' }"></div>
              <button type="button" class="btn-close text-reset align-middle" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
          </div>
        </div>
      </div>
      <div class="offcanvas-body small">
        <div class="container-fluid">
          <div class="row g-2">
            ${options}
          </div>
          <div class="row pt-2">
            <div class="col">
              <div class="d-grid">
                <button
                  id="${this.fleetSelectSaveBtnId}"
                  class="btn btn-primary"
                  ${isUnselectable ? 'disabled' : ''}
                >Save</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.initListeners();
  }
}
