import {AMBITS, IMG} from "../../modules/Constants.js";
import {Util} from "../../modules/Util.js";

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
    return `
      <a href="javascript: void(0)"
         data-bs-toggle="popover"
         data-bs-content="${this.util.titleCase(ambit)} Ambit"
      ><img src="${IMG.ICONS}icon-ambit-${ambit.toLowerCase()}.png" alt="${ambit.toLowerCase()} ambit"></a>
    `;
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
                  <img src="img/icons/icon-attack-range.png" alt="attack-range">
                  1
                </button>
              </div>
              <div class="col d-grid">
                <button type="button" class="btn btn-primary btn-sm">
                  Defend
                  <img src="img/icons/icon-strength.png" alt="strength">
                </button>
              </div>
            </div>
            <div class="row">
              <div class="col d-grid">
                <button type="button" class="btn btn-danger btn-sm">
                  Attack
                  <img src="img/icons/icon-attack-range.png" alt="attack-range">
                  2
                </button>
              </div>
              <div class="col d-grid">
                <!--button type="button" class="btn btn-secondary btn-sm">
                  Activate
                  <img src="img/icons/icon-invisible.png" alt="invisible">
                </button-->
                <button type="button" class="btn btn-warning btn-sm">
                  Move
                  <img src="img/icons/icon-speed.png" alt="speed">
                </button>
              </div>
            </div>
          </div>

          <div class="attributes-container">
            <div class="row">
              <div class="col-auto">
                <div class="row">
                  <div class="col-4">
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
                    ><img src="img/icons/icon-health.png"
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
                    ><img src="img/icons/icon-location-pin.png" alt="location-pin"></a><strong>:</strong>
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
                    ><strong>1</strong> <img src="img/icons/icon-attack-range.png" alt="attack-range"></a><strong>:</strong>
                  </div>
                  <div class="col ps-1">
                    <a href="javascript: void(0)"
                       data-bs-toggle="popover"
                       data-bs-content="Damage Value"
                    ><img src="img/icons/icon-fire.png" alt="fire"></a> 2,
                    <a href="javascript: void(0)"
                       data-bs-toggle="popover"
                       data-bs-content="Guided"
                    ><img src="img/icons/icon-accuracy.png" alt="accuracy"></a>,
                    <a href="javascript: void(0)"
                       data-bs-toggle="popover"
                       data-bs-content="Water Ambit"
                    ><img src="img/icons/icon-ambit-water.png" alt="ambit-water"></a>
                    <a href="javascript: void(0)"
                       data-bs-toggle="popover"
                       data-bs-content="Land Ambit"
                    ><img src="img/icons/icon-ambit-land.png" alt="ambit-land"></a>
                    <a href="javascript: void(0)"
                       data-bs-toggle="popover"
                       data-bs-content="Sky Ambit"
                    ><img src="img/icons/icon-ambit-sky.png" alt="ambit-sky"></a>
                    <a href="javascript: void(0)"
                       data-bs-toggle="popover"
                       data-bs-content="Space Ambit"
                    ><img src="img/icons/icon-ambit-space.png" alt="ambit-space"></a>
                  </div>
                </div>
                <div class="row">
                  <div class="col-3 pe-1">
                    <a href="javascript: void(0)"
                       data-bs-toggle="popover"
                       data-bs-content="Secondary Weapon"
                    ><strong>2</strong> <img src="img/icons/icon-attack-range.png" alt="attack-range"></a><strong>:</strong>
                  </div>
                  <div class="col ps-1">
                    <a href="javascript: void(0)"
                       data-bs-toggle="popover"
                       data-bs-content="Damage Value"
                    ><img src="img/icons/icon-fire.png" alt="fire"></a> 1-3,
                    <a href="javascript: void(0)"
                       data-bs-toggle="popover"
                       data-bs-content="Guided"
                    ><img src="img/icons/icon-accuracy.png" alt="accuracy"></a>,
                    <a href="javascript: void(0)"
                       data-bs-toggle="popover"
                       data-bs-content="Water Ambit"
                    ><img src="img/icons/icon-ambit-water.png" alt="ambit-water"></a>
                    <a href="javascript: void(0)"
                       data-bs-toggle="popover"
                       data-bs-content="Land Ambit"
                    ><img src="img/icons/icon-ambit-land.png" alt="ambit-land"></a>
                    <a href="javascript: void(0)"
                       data-bs-toggle="popover"
                       data-bs-content="Sky Ambit"
                    ><img src="img/icons/icon-ambit-sky.png" alt="ambit-sky"></a>
                    <a href="javascript: void(0)"
                       data-bs-toggle="popover"
                       data-bs-content="Space Ambit"
                    ><img src="img/icons/icon-ambit-space.png" alt="ambit-space"></a>
                  </div>
                </div>
                <div class="row">
                  <div class="col-3 pe-1">
                    <a href="javascript: void(0)"
                       data-bs-toggle="popover"
                       data-bs-content="Counter Attack Capabilities"
                    ><img src="img/icons/icon-counter-attack.png" alt="counter-attack"></a><strong>:</strong>
                  </div>
                  <div class="col ps-1">
                    <a href="javascript: void(0)"
                       data-bs-toggle="popover"
                       data-bs-content="Damage Value"
                    ><img src="img/icons/icon-fire.png" alt="fire"></a> 2,
                    <a href="javascript: void(0)"
                       data-bs-toggle="popover"
                       title="On Death"
                       data-bs-content="The following attributes only apply on death."
                    ><img src="img/icons/icon-skull.png" alt="skull"></a>,
                    <a href="javascript: void(0)"
                       data-bs-toggle="popover"
                       title="Same Ambit Damage Value"
                       data-bs-content="The damage value when the attacker and defender have the same operating ambit."
                    ><img src="img/icons/icon-damage-same-ambit.png" alt="damage-same-ambit"></a> 3,
                  </div>
                </div>
                <div class="row">
                  <div class="col-3 pe-1">
                    <a href="javascript: void(0)"
                       data-bs-toggle="popover"
                       data-bs-content="Defensive Capabilities"
                    ><img src="img/icons/icon-def-melee.png" alt="def-melee"></a><strong>:</strong>
                  </div>
                  <div class="col ps-1">
                    <a href="javascript: void(0)"
                       data-bs-toggle="popover"
                       data-bs-content="Unguided"
                    ><img src="img/icons/icon-unguided.png" alt="unguided"></a> 2/3,
                    <a href="javascript: void(0)"
                       data-bs-toggle="popover"
                       title="Incoming Damage Reduction"
                       data-bs-content="The amount incoming damage is reduced by."
                    ><img src="img/icons/icon-damage-down.png" alt="damage-down"></a> -1,
                    <a href="javascript: void(0)"
                       data-bs-toggle="popover"
                       title="Stealth Mode"
                       data-bs-content="This struct can hide from attacks from the following ambits."
                    ><img src="img/icons/icon-invisible.png" alt="invisible"></a>
                    <a href="javascript: void(0)"
                       data-bs-toggle="popover"
                       data-bs-content="Water Ambit"
                    ><img src="img/icons/icon-ambit-water.png" alt="ambit-water"></a>
                    <a href="javascript: void(0)"
                       data-bs-toggle="popover"
                       data-bs-content="Land Ambit"
                    ><img src="img/icons/icon-ambit-land.png" alt="ambit-land"></a>
                    <a href="javascript: void(0)"
                       data-bs-toggle="popover"
                       data-bs-content="Sky Ambit"
                    ><img src="img/icons/icon-ambit-sky.png" alt="ambit-sky"></a>
                    <a href="javascript: void(0)"
                       data-bs-toggle="popover"
                       data-bs-content="Space Ambit"
                    ><img src="img/icons/icon-ambit-space.png" alt="ambit-space"></a>,
                    <a href="javascript: void(0)"
                       data-bs-toggle="popover"
                       title="Movement Ability"
                       data-bs-content="This struct can change ambits."
                    ><img src="img/icons/icon-speed.png" alt="speed"></a>
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
                ><img src="img/icons/icon-rook.png" alt="rook"></a>:
              </div>
              <div class="col-auto ps-1">
                <a href="javascript: void(0)"
                   data-bs-toggle="popover"
                   data-bs-content="Land Ambit"
                ><img src="img/icons/icon-ambit-land.png" alt="ambit-land"></a> 2
              </div>
            </div>
            <div class="row">
              <div class="col-auto pe-1">
                <a href="javascript: void(0)"
                   data-bs-toggle="popover"
                   title="Defended By"
                   data-bs-content="The list of structs defending this struct."
                ><img src="img/icons/icon-strength.png" alt="strength"></a>:
              </div>
              <div class="col ps-1">
                <div class="row">
                  <div class="col">
                    <a href="javascript: void(0)"
                       data-bs-toggle="popover"
                       data-bs-content="Space Structs"
                    ><img src="img/icons/icon-ambit-space.png" alt="ambit-space"></a> 1,2,3,4
                  </div>
                  <div class="col">
                    <a href="javascript: void(0)"
                       data-bs-toggle="popover"
                       data-bs-content="Sky Structs"
                    ><img src="img/icons/icon-ambit-sky.png" alt="ambit-sky"></a> 1,2,3,4
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <a href="javascript: void(0)"
                       data-bs-toggle="popover"
                       data-bs-content="Land Structs"
                    ><img src="img/icons/icon-ambit-land.png" alt="ambit-land"></a> 1,2,3,4
                  </div>
                  <div class="col">
                    <a href="javascript: void(0)"
                       data-bs-toggle="popover"
                       data-bs-content="Water Structs"
                    ><img src="img/icons/icon-ambit-water.png" alt="ambit-water"></a> 1,2,3,4
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
