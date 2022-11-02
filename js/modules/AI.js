import {DefenseStrategyTree} from "./DefenseStrategyTree.js";
import {AMBITS, EVENTS, MANUAL_WEAPON_SLOTS, ORDER_OF_AMBITS} from "./Constants.js";
import {AIAttackChoice} from "./AIAttackChoice.js";
import {AmbitDistribution} from "./AmbitDistribution.js";

export class AI {
  /**
   * @param {GameState} state
   */
  constructor(state) {
    this.state = state;
    this.defenseStrategyTree = new DefenseStrategyTree();
  }

  /**
   * @param {Struct} playerStruct
   * @return {boolean}
   */
  canAttackIfHidden(playerStruct) {
    if (!playerStruct.isHidden()) {
      return true;
    }

    return !!this.state.enemy.fleet[playerStruct.operatingAmbit.toLowerCase()].reduce((canAttack, aiStruct) =>
      canAttack || !aiStruct || aiStruct.canAttackAnyWeapon(playerStruct)
    , false);
  }

  /**
   * @param {DefenseStrategyTreeNode} treeNode
   * @return {number} rank (lower is better)
   */
  rankTarget(treeNode) {
    if (!this.canAttackIfHidden(treeNode.struct)) {
      return Infinity;
    }
    const attacksRequiredDistribution = treeNode.costFromRoot.add(treeNode.cost);
    const totalAttacksRequired = attacksRequiredDistribution.getAmbitValues().reduce(
      (previous, current) => previous + current,
      0
    );
    const variance = attacksRequiredDistribution.getPopulationVariance();
    return totalAttacksRequired + Math.round(Math.sqrt(variance));
  }

  /**
   * @return {Struct}
   */
  determineTarget() {
    const treeRoot = this.defenseStrategyTree.generate(this.state.player.commandStruct);
    const leafNodes = this.defenseStrategyTree.getLeafNodes(treeRoot);
    let bestChoice = {
      struct: treeRoot.struct,
      rank: Infinity
    };

    while (leafNodes.length > 0 ) {
      const leaf = leafNodes.pop();
      const rank = this.rankTarget(leaf);
      if (rank < bestChoice.rank) {
        bestChoice.rank = rank;
        bestChoice.struct = leaf.struct;
      }
    }

    return bestChoice.struct;
  }

  /**
   * @param {Struct} attackStruct
   * @param {Struct} targetStruct
   * @return {number}
   */
  getUncounterableAttackScore(attackStruct, targetStruct) {
    return !targetStruct.canCounterAttack(attackStruct) ? Infinity : 0;
  }

  /**
   * @param {Struct} attackStruct
   * @return {number}
   */
  getBlockingCommandShipAttackScore(attackStruct) {
    return (!attackStruct.defending
      || !attackStruct.defending.isCommandStruct()
      || attackStruct.operatingAmbit !== attackStruct.defending.operatingAmbit) ? 1 : 0;
  }

  /**
   * @param {Struct} attackStruct
   * @param {Struct} targetStruct
   * @return {number}
   */
  getCurrentHealthAttackScore(attackStruct, targetStruct) {
    let score = 0;
    if ((targetStruct.isCommandStruct() && attackStruct.currentHealth === 1)
      || (!targetStruct.isCommandStruct() && attackStruct.currentHealth === 2)) {
      score = 1;
    } else if (attackStruct.currentHealth === 3) {
      score = 2;
    }
    return score;
  }

  /**
   * @param {Struct} attackStruct
   * @return {number}
   */
  getAmbitTargetingCostAttackScore(attackStruct) {
    return 4 - attackStruct.getTargetableAmbits().length;
  }

  /**
   * @param {Struct} attackStruct
   * @param {Struct} targetStruct
   * @return {number}
   */
  getStructAttackScore(attackStruct, targetStruct) {
    if(attackStruct.isDestroyed || !attackStruct.canAttackAnyWeapon(targetStruct)) {
      return -1;
    }

    let score = 0;
    score += this.getUncounterableAttackScore(attackStruct, targetStruct);
    score += this.getBlockingCommandShipAttackScore(attackStruct);
    score += this.getCurrentHealthAttackScore(attackStruct, targetStruct);
    score += this.getAmbitTargetingCostAttackScore(attackStruct);

    return score;
  }

  /**
   * @param {Struct} targetStruct
   * @return {Struct}
   */
  chooseAttackStruct(targetStruct) {
    const bestAttackStruct = {
      score: -1,
      struct: this.state.enemy.commandStruct
    };

    this.state.enemy.fleet.forEachStruct(aiStruct => {
      let score = this.getStructAttackScore(aiStruct, targetStruct);

      if (score > bestAttackStruct.score) {
        bestAttackStruct.struct = aiStruct;
        bestAttackStruct.score = score;
      }
    });

    return bestAttackStruct.struct;
  }

  /**
   * @param {Struct} attackStruct
   * @param {string} targetAmbit
   * @return {string}
   */
  chooseWeapon(attackStruct, targetAmbit) {
    const primary = attackStruct.manualWeaponPrimary;
    const secondary = attackStruct.manualWeaponSecondary;

    if (primary && primary.canTargetAmbit(targetAmbit)) {
      return MANUAL_WEAPON_SLOTS.PRIMARY;
    }
    if (secondary && secondary.canTargetAmbit(targetAmbit)) {
      return MANUAL_WEAPON_SLOTS.SECONDARY;
    }

    throw new Error(`Struct cannot target given ambit: ${targetAmbit}`);
  }

  /**
   * @return {AIAttackChoice}
   */
  attack() {
    // Determine the best target
    const target = this.determineTarget();

    // Determine the best struct to attack the target with
    const aiStruct = this.chooseAttackStruct(target);

    // Choose a weapon
    const weaponSlot = this.chooseWeapon(aiStruct, target.operatingAmbit);

    // If it's a Command Struct, it needs to be in the same ambit as the target to attack
    if (aiStruct.isCommandStruct() && aiStruct.operatingAmbit !== target.operatingAmbit
        && aiStruct.defenseComponent.canChangeAmbit(aiStruct.operatingAmbit, target.operatingAmbit)) {
      aiStruct.operatingAmbit = target.operatingAmbit;
    }

    // Execute attack and end turn
    aiStruct.attack(weaponSlot, target);

    return new AIAttackChoice(
      aiStruct,
      weaponSlot,
      target
    );
  }

  openingDefense() {
    this.state.enemy.fleet.forEachStruct(aiStruct => {
      aiStruct.defend(this.state.enemy.commandStruct);
    });
  }

  /**
   * @param {Fleet} fleet
   * @return {AmbitDistribution}
   */
  analyzeFleetAmbitAttackCapabilities(fleet) {
    const ambitAttackCapabilities = new AmbitDistribution();
    fleet.forEachStruct(struct => {
      if (!struct.isDestroyed) {
        const targetableAmbits = struct.getTargetableAmbits();
        targetableAmbits.forEach(ambit => {
          ambitAttackCapabilities.increment(ambit, 1);
        });
      }
    });
    return ambitAttackCapabilities;
  }

  /**
   * @param {Fleet} fleet
   * @return {AmbitDistribution}
   */
  analyzeFleetAmbitPositions(fleet) {
    const ambitPositions = new AmbitDistribution();
    fleet.forEachStruct(struct => {
      if (!struct.isDestroyed) {
        ambitPositions.increment(struct.operatingAmbit, 1);
      }
    });
    return ambitPositions;
  }

  /**
   * Find an ambit the fleet cannot attack.
   *
   * @param {Fleet} fleet
   * @return {string|null}
   */
  findFleetTargetingWeakness(fleet) {
    const ambitAttackCapabilities = this.analyzeFleetAmbitAttackCapabilities(fleet);
    const ambits = Object.values(AMBITS);
    for (let i = 0; i < ambits.length; i++) {
      if (ambitAttackCapabilities[ambits[i].toLowerCase()] === 0) {
        return ambits[i];
      }
    }
    return null;
  }

  /**
   * Find the ambit where the fleet has the most structs.
   *
   * @param fleet
   * @return {string|null}
   */
  findMostOccupiedAmbit(fleet) {
    let mostOccupiedAmbit = null;
    let mostStructs = 0;
    const ambitPositions = this.analyzeFleetAmbitPositions(fleet);
    const ambits = ORDER_OF_AMBITS;
    for (let i = 0; i < ambits.length; i++) {
      if (ambitPositions[ambits[i].toLowerCase()] > mostStructs) {
        mostStructs = ambitPositions[ambits[i].toLowerCase()];
        mostOccupiedAmbit = ambits[i];
      }
    }
    return mostOccupiedAmbit;
  }

  turnBasedDefense() {
    let changeAmbit = this.findFleetTargetingWeakness(this.state.player.fleet);

    if (!changeAmbit) {
      changeAmbit = this.findMostOccupiedAmbit(this.state.enemy.fleet);
    }

    if (changeAmbit) {
      this.state.enemy.commandStruct.operatingAmbit = changeAmbit;
    }
  }

  executeTurn() {
    if (this.state.numTurns === 2) {
      this.openingDefense();
      window.dispatchEvent(new CustomEvent(EVENTS.TURNS.END_TURN));
    } else {
      this.turnBasedDefense();
      this.attack();
    }
  }
}
