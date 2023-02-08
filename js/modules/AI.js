import {DefenseStrategyTree} from "./DefenseStrategyTree.js";
import {AMBITS, DEFENSE_COMPONENT_TYPES, EVENTS, ORDER_OF_AMBITS} from "./Constants.js";
import {AIAttackChoiceDTO} from "./dtos/AIAttackChoiceDTO.js";
import {AmbitDistribution} from "./AmbitDistribution.js";
import {AIAttackParamsDTO} from "./dtos/AIAttackParamsDTO.js";

export class AI {
  /**
   * @param {GameState} state
   */
  constructor(state) {
    this.state = state;
    this.defenseStrategyTree = new DefenseStrategyTree();
  }

  placeGenerator() {
    // Override
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
  getAttackGoal() {
    return this.state.player.commandStruct;
  }

  /**
   * @return {Struct}
   */
  determineTargetOnGoal() {
    const treeRoot = this.defenseStrategyTree.generate(this.getAttackGoal());
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
  getUncounterableByTargetAttackScore(attackStruct, targetStruct) {
    return !targetStruct.canCounterAttack(attackStruct) ? 10 : 0;
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
  getUncounterableByDefendersAttackScore(attackStruct, targetStruct) {
    return targetStruct.defenders.reduce((canCounter, defender) =>
        canCounter || !defender.canCounterAttack(attackStruct)
    , false) ? 5 : 0;
  }

  /**
   * @param {Struct} attackStruct
   * @param {Struct} targetStruct
   * @return {number}
   */
  getCanBeatCounterMeasuresAttackScore(attackStruct, targetStruct) {
    return attackStruct.canDefeatStructsCounterMeasure(targetStruct) ? 15 : 0;
  }

  /**
   * @param {Struct} attackStruct
   * @param {Struct} targetStruct
   * @return {number}
   */
  getStructAttackScore(attackStruct, targetStruct) {
    if (attackStruct.isDestroyed || !attackStruct.canAttackAnyWeapon(targetStruct)) {
      return -1;
    }

    if (attackStruct.isCommandStruct()) {
      return 0;
    }

    let score = 0;
    score += this.getCanBeatCounterMeasuresAttackScore(attackStruct, targetStruct);
    score += this.getUncounterableByTargetAttackScore(attackStruct, targetStruct);
    score += this.getUncounterableByDefendersAttackScore(attackStruct, targetStruct);
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
   * @param {AIThreatDTO} threat
   * @return {boolean}
   */
  isAttackingThreatViable(threat) {
    let aiAttackStruct = this.chooseAttackStruct(threat.attackingStruct);

    return !aiAttackStruct.isCommandStruct()
      && aiAttackStruct.isCounterUnitTo(threat.attackingStruct)
      && aiAttackStruct.canDefeatStructsCounterMeasure(threat.attackingStruct)
      && threat.attackingStruct.defenseComponent.type !== DEFENSE_COMPONENT_TYPES.ARMOUR
      && threat.attackingStruct.countDefenderCounterAttacks(aiAttackStruct) === 0
      && threat.attackingStruct.countBlockingDefenders() === 0;
  }

  /**
   * @return {Struct|null}
   */
  identifyThreat() {
    let maxDamage = 0;
    let maxThreat = null;
    this.state.aiThreatTracker.threats.forEach(threat => {
      if (threat.cumulativeDamage > maxDamage && this.isAttackingThreatViable(threat)) {
        maxThreat = threat.attackingStruct;
      }
    });

    return maxThreat;
  }

  /**
   * @return {Struct}
   */
  chooseTarget() {
    if (this.state.player.commandStruct.isVulnerableToFleet(this.state.enemy.fleet)) {
      return this.state.player.commandStruct;
    }
    const onGoalTarget = this.determineTargetOnGoal();
    const threat = this.identifyThreat();
    if (!onGoalTarget.isCommandStruct() && threat) {
      return threat;
    }
    return onGoalTarget;
  }

  /**
   * @param {AIAttackParamsDTO} params
   * @return {AIAttackChoiceDTO}
   */
  attack(params) {
    const target = params.target;
    const attackingAIStruct = params.attackingAIStruct;

    // Choose a weapon
    const weaponSlot = attackingAIStruct.chooseWeapon(target);

    // If it's a Command Struct, it needs to be in the same ambit as the target to attack
    if (attackingAIStruct.isCommandStruct() && attackingAIStruct.operatingAmbit !== target.operatingAmbit
        && attackingAIStruct.defenseComponent.canChangeAmbit(attackingAIStruct.operatingAmbit, target.operatingAmbit)) {
      attackingAIStruct.operatingAmbit = target.operatingAmbit;
    }

    // Execute attack and end turn
    attackingAIStruct.attack(weaponSlot, target);

    return new AIAttackChoiceDTO(
      attackingAIStruct,
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
    const ambitAttackCapabilities = fleet.analyzeFleetAmbitAttackCapabilities();
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
   * @param {Player} player
   * @return {string|null}
   */
  findAmbitForBestDefense(player) {
    let mostOccupiedAmbit = null;
    let mostStructs = 0;
    const ambitPositions = this.analyzeFleetAmbitPositions(player.fleet);
    const ambits = ORDER_OF_AMBITS;
    for (let i = 0; i < ambits.length; i++) {
      if (ambitPositions[ambits[i].toLowerCase()] > mostStructs) {
        mostStructs = ambitPositions[ambits[i].toLowerCase()];
        mostOccupiedAmbit = ambits[i];
      }
    }
    return mostOccupiedAmbit;
  }

  /**
   * @param {Struct} potentialDefender
   * @param {Struct} attackingStruct
   * @return {number}
   */
  getCannotAttackDefenseScore(potentialDefender, attackingStruct) {
    return !attackingStruct.canAttackAnyWeapon(potentialDefender) ? 1 : 0;
  }

  /**
   * @param {Struct} potentialDefender
   * @return {number}
   */
  getAlreadyDefendingDefenseScore(potentialDefender) {
    return (!potentialDefender.defending || potentialDefender.defending.isCommandStruct()) ? 2 : 0;
  }

  /**
   * @param {Struct} potentialDefender
   * @param {Struct} structToDefend
   * @param {Struct} attackingStruct
   * @return {number}
   */
  getStructDefenseScore(potentialDefender, structToDefend, attackingStruct) {
    if (
      potentialDefender.id === structToDefend.id
      || potentialDefender.isDestroyed
      || structToDefend.isDestroyed
      || attackingStruct.isDestroyed
      || !potentialDefender.canCounterAttack(attackingStruct)
      || (potentialDefender.isBlockingCommandStruct())
    ) {
      return -1;
    }

    let score = 0;
    score += this.getCannotAttackDefenseScore(potentialDefender, attackingStruct);
    score += this.getAlreadyDefendingDefenseScore(potentialDefender);

    return score;
  }

  /**
   * @param {Struct} structToDefend
   * @param {Struct} attackingStruct
   * @return {Struct}
   */
  chooseDefenseStruct(structToDefend, attackingStruct) {
    const bestDefenseStruct = {
      score: -1,
      struct: null
    };

    this.state.enemy.fleet.forEachStruct(aiStruct => {
      let score = this.getStructDefenseScore(aiStruct, structToDefend, attackingStruct);

      if (score > bestDefenseStruct.score) {
        bestDefenseStruct.struct = aiStruct;
        bestDefenseStruct.score = score;
      }
    });

    return bestDefenseStruct.struct;
  }

  defendLastAttackedStruct() {
    const lastPlayerAttack = this.state.combatEventLog.findLastAttackByPlayer(this.state.player);

    if (!lastPlayerAttack) {
      return;
    }

    const lastAttackingStruct = this.state.player.fleet.findStructById(lastPlayerAttack.sourceStructId);
    const lastAttackedStruct = this.state.enemy.fleet.findStructById(lastPlayerAttack.targetStructId);

    if (lastAttackedStruct && !lastAttackedStruct.isDestroyed
      && lastAttackingStruct && !lastAttackingStruct.isDestroyed) {
      const potentialDefender = this.chooseDefenseStruct(lastAttackedStruct, lastAttackingStruct);
      if (potentialDefender) {
        potentialDefender.defend(lastAttackedStruct);
      }
    }
  }

  moveCommandStructToMostDefensibleAmbit() {
    let changeAmbit = this.findFleetTargetingWeakness(this.state.player.fleet);

    if (!changeAmbit) {
      changeAmbit = this.findAmbitForBestDefense(this.state.enemy);
    }

    if (changeAmbit) {
      this.state.enemy.commandStruct.operatingAmbit = changeAmbit;
      this.state.enemy.fleet[changeAmbit.toLowerCase()].forEach(struct => {
        if (struct && !struct.isDestroyed) {
          struct.defend(this.state.enemy.commandStruct);
        }
      });
    }
  }

  defendCommandStructWithUnused() {
    this.state.enemy.fleet.forEachStruct(struct => {
      if (!struct.isDestroyed && !struct.defending) {
        struct.defend(this.state.enemy.commandStruct);
      }
    });
  }

  turnBasedDefense() {
    this.moveCommandStructToMostDefensibleAmbit();
    this.defendLastAttackedStruct();
    this.defendCommandStructWithUnused();
  }

  executeTurn() {
    if (this.state.numTurns === 2) {
      this.openingDefense();
      window.dispatchEvent(new CustomEvent(EVENTS.TURNS.END_TURN));
    } else {
      this.turnBasedDefense();

      const target = this.chooseTarget();
      const attackParams = new AIAttackParamsDTO(
        target,
        this.chooseAttackStruct(target)
      );

      this.attack(attackParams);
    }
  }
}
