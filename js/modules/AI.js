import {DefenseStrategyTree} from "./DefenseStrategyTree.js";
import {MANUAL_WEAPON_SLOTS} from "./Constants.js";

export class AI {
  /**
   * @param {GameState} state
   */
  constructor(state) {
    this.state = state;
    this.defenseStrategyTree = new DefenseStrategyTree();
  }

  /**
   * @param {DefenseStrategyTreeNode} treeNode
   * @return {number} rank (lower is better)
   */
  rankTarget(treeNode) {
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
    if(!attackStruct.canTargetAmbit(targetStruct.operatingAmbit)) {
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
  }

  executeTurn() {
    // defensive moves

    this.attack();
  }
}
