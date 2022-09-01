import {AMBITS, DEFENSE_COMPONENT_TYPES, IMG} from "../../modules/Constants.js";
import {Util} from "../../modules/Util.js";
import {CounterMeasure} from "../../modules/CounterMeasure.js";

export class UIStructDetails {

  /**
   * @param {Struct} struct
   * @param {string} ownerType
   */
  constructor(struct, ownerType) {
    this.struct = struct;
    this.ownerType = ownerType;
    this.util = new Util();
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
    if (weapon.probabilityOnDeath === 1) {
      icons.push(this.getOnDeathIcon());
    }
    if (weapon.probability === 1) {
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

  render() {
    return `
      <div class="offcanvas-header">
        <div class="container-fluid">
          <div class="row">
            <div class="col text-start">
              <h5 class="offcanvas-title" id="offcanvasBottomLabel">${this.util.titleCase(this.ownerType)}</h5>
            </div>
            <div class="col text-end">
              <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
          </div>
        </div>
      </div>
      <div class="offcanvas-body small">
        <div class="container-fluid">

          <div class="actions-container">
            <div class="row">
              <div class="col d-grid">
                <button type="button" class="btn btn-danger btn-sm">
                  Attack
                  <img src="${IMG.ICONS}icon-attack-range.png" alt="attack-range">
                  1
                </button>
              </div>
              <div class="col d-grid">
                <button type="button" class="btn btn-primary btn-sm">
                  Defend
                  <img src="${IMG.ICONS}icon-strength.png" alt="strength">
                </button>
              </div>
            </div>
            <div class="row">
              <div class="col d-grid">
                <button type="button" class="btn btn-danger btn-sm">
                  Attack
                  <img src="${IMG.ICONS}icon-attack-range.png" alt="attack-range">
                  2
                </button>
              </div>
              <div class="col d-grid">
                <!--button type="button" class="btn btn-secondary btn-sm">
                  Activate
                  <img src="${IMG.ICONS}icon-invisible.png" alt="invisible">
                </button-->
                <button type="button" class="btn btn-warning btn-sm">
                  Move
                  <img src="${IMG.ICONS}icon-speed.png" alt="speed">
                </button>
              </div>
            </div>
          </div>

          <div class="attributes-container">
            <div class="row">
              <div class="col-4">
                <div class="row">
                  <div class="col">
                    <img src="${this.struct.image}" style="height:80px" alt="${this.struct.unitType}">
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
                    ${this.getAmbitIcon(AMBITS.SPACE)} 1
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
            <div class="row">
              <div class="col-auto pe-1">
                <a href="javascript: void(0)"
                   data-bs-toggle="popover"
                   title="Defending"
                   data-bs-content="The struct this struct is defending."
                ><img src="${IMG.ICONS}icon-rook.png" alt="rook"></a>:
              </div>
              <div class="col-auto ps-1">
                <a href="javascript: void(0)"
                   data-bs-toggle="popover"
                   data-bs-content="Land Ambit"
                ><img src="${IMG.ICONS}icon-ambit-land.png" alt="ambit-land"></a> 2
              </div>
            </div>
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
                    <a href="javascript: void(0)"
                       data-bs-toggle="popover"
                       data-bs-content="Space Structs"
                    ><img src="${IMG.ICONS}icon-ambit-space.png" alt="ambit-space"></a> 1,2,3,4
                  </div>
                  <div class="col">
                    <a href="javascript: void(0)"
                       data-bs-toggle="popover"
                       data-bs-content="Sky Structs"
                    ><img src="${IMG.ICONS}icon-ambit-sky.png" alt="ambit-sky"></a> 1,2,3,4
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <a href="javascript: void(0)"
                       data-bs-toggle="popover"
                       data-bs-content="Land Structs"
                    ><img src="${IMG.ICONS}icon-ambit-land.png" alt="ambit-land"></a> 1,2,3,4
                  </div>
                  <div class="col">
                    <a href="javascript: void(0)"
                       data-bs-toggle="popover"
                       data-bs-content="Water Structs"
                    ><img src="${IMG.ICONS}icon-ambit-water.png" alt="ambit-water"></a> 1,2,3,4
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    `;
  }
}