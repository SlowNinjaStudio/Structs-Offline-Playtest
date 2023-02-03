import {AIConstraintFactory} from "./constraints/AIConstraintFactory.js";
import {CONSTRAINT_ORDER, FLEET_UNIT_TYPES} from "./Constants.js";
import {StructBuilder} from "./StructBuilder.js";
import {Appraiser} from "./Appraiser.js";
import {AIConstraintSatisfyingStructDTO} from "./dtos/AIConstraintSatisfyingStructDTO.js";

export class AIBuyingStrategyManager {
  initConstraints() {
    this.constraints = {};
    this.orderedConstrainstList.forEach(constraintName => {
      this.constraints[constraintName] = this.constraintFactory.make(constraintName);
    });
  }

  /**
   * @param {GameState} state
   */
  constructor(state) {
    this.state = state;
    this.constraintFactory = new AIConstraintFactory(this.state);
    this.constraints = {};
    this.structBuilder = new StructBuilder();
    this.appraiser = new Appraiser();
    this.orderedConstrainstList = CONSTRAINT_ORDER;
    this.fleetUnitTypes = FLEET_UNIT_TYPES;

    this.initConstraints();
  }

  /**
   * @param {string} constraintName
   * @param {number} constraintIndex
   * @param {AIAttackParamsDTO} attackParams
   * @return {AIConstraintSatisfyingStructDTO}
   */
  findConstraintSatisfyingStruct(
    constraintName,
    constraintIndex,
    attackParams
  ) {
    let bestUnit = new AIConstraintSatisfyingStructDTO(constraintName);

    this.fleetUnitTypes.forEach(unitType => {

      let newUnit = new AIConstraintSatisfyingStructDTO(constraintName);
      newUnit.unit = this.structBuilder.make(unitType);
      newUnit.appraisal = this.appraiser.appraise(unitType);

      // Only need to check from the constraint index onward because
      // all previous constraints should already be fully satisfied.
      for (let i = constraintIndex; i < this.orderedConstrainstList.length; i++) {
        const constraintName = this.orderedConstrainstList[i];

        // If the best unit hasn't been evaluated for this constraint yet, do it now.
        if (bestUnit.unit && !bestUnit[constraintName]) {
          bestUnit[constraintName] = this.constraints[constraintName].couldSatisfy(
            bestUnit.unit,
            attackParams
          );
        }

        // Evaluate the new potential unit for this constraint.
        newUnit[constraintName] = this.constraints[constraintName].couldSatisfy(
          newUnit.unit,
          attackParams
        );

        // Determine if the AI can afford the new unit and if there's space for it in the fleet.
        // If so and there's current no best unit or the new unit is better, the new unit is the best unit.
        const canAfford = this.state.enemy.creditManager.credits >= newUnit.appraisal.price;
        const canFit = this.state.enemy.fleet.findFreeAmbitSlot(newUnit.unit.operatingAmbit) > -1;
        const isDefaultBestUnit = !bestUnit.unit && newUnit[constraintName] > 0;
        const isBetterUnit = bestUnit.unit && newUnit[constraintName] > bestUnit[constraintName];
        const isLesserUnit = bestUnit.unit && newUnit[constraintName] < bestUnit[constraintName];

        if (canAfford && canFit && (isDefaultBestUnit || isBetterUnit)) {
          bestUnit = newUnit;
        } else if (isLesserUnit) {
          newUnit = null;
          break;
        }
      }

      // If there's a cheaper unit that meets the same constraints, buy that instead.
      if (newUnit && bestUnit.appraisal && newUnit.appraisal.price < bestUnit.appraisal.price) {
        bestUnit = newUnit;
      }
    });

    return bestUnit;
  }

  /**
   * @param {AIAttackParamsDTO} attackParams
   */
  execute(attackParams) {
    this.orderedConstrainstList.forEach((constraintName, constraintIndex) => {
      while(!this.constraints[constraintName].isSatisfied(attackParams)) {
        const satisfyingStructDTO = this.findConstraintSatisfyingStruct(constraintName, constraintIndex, attackParams);

        if (!satisfyingStructDTO.unit) {
          break;
        }

        this.state.enemy.creditManager.pay(satisfyingStructDTO.appraisal.price);
        this.state.enemy.fleet.addStruct(satisfyingStructDTO.unit);
        this.constraints[constraintName].satisfy(satisfyingStructDTO, attackParams);
      }
    });
  }
}
