import {StructBuilder} from "../../modules/StructBuilder.js";
import {Appraiser} from "../../modules/Appraiser.js";
import {DEFENSE_COMPONENT_TYPES, ICONS, IMG, UNITS_BY_AMBIT} from "../../modules/Constants.js";
import {Util} from "../../modules/util/Util.js";

export class UIStructSelection {
  /**
   * @param {GameState} state
   * @param {Player} selectingPlayer
   * @param {string} ambit
   * @param {number} ambitSlot
   * @param {Struct} preselectedStruct
   */
  constructor(
    state,
    selectingPlayer,
    ambit,
    ambitSlot,
    preselectedStruct = null
  ) {
    this.state = state;
    this.selectingPlayer = selectingPlayer;
    this.ambit = ambit;
    this.ambitSlot = ambitSlot;
    this.preselectedStruct = preselectedStruct;
    this.structBuilder = new StructBuilder();
    this.appraiser = new Appraiser();
    this.util = new Util();
  }

  initListeners() {
    // TO DO
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
      `;
    }

    return `
      <div class="col-sm-6">
        <div class="fleet-select-unit card pt-2">

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
                    ${unitPrice} <img src="${IMG.RASTER_ICONS}icon-watt-green-16x16.png" alt="Currency Icon">
                  </div>
                </div>
              </div>
            </div>
            ${unitAttributes}
          </div>

        </div>
      </div>
    `;
  }

  render() {
    let options = '';
    let units = [...UNITS_BY_AMBIT[this.ambit], ''];
    for (let i = 0; i < units.length; i++) {
      options += this.renderOption(units[i]);
    }

    return `
      <div class="offcanvas-header">
        <div class="container-fluid">
          <div class="row">
            <div class="col text-start">
              <h5 class="offcanvas-title" id="offcanvasBottomLabel">${this.util.titleCase(this.ambit)} Structs</h5>
            </div>
            <div class="col text-end">
              <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
          </div>
        </div>
      </div>
      <div class="offcanvas-body small">
        <div class="container-fluid">
          <div class="row g-2">
            ${options}
          </div>
        </div>
      </div>
    `;
  }
}
