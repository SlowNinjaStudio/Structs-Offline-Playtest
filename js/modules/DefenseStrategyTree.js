import {DefenseStrategyTreeNode} from "./data_structures/DefenseStrategyTreeNode.js";
import {AmbitDistribution} from "./AmbitDistribution.js";
import {DEFENSE_COMPONENTS} from "./Constants.js";

export class DefenseStrategyTree {
  /**
   * @param {Struct} struct
   * @return {number}
   */
  calculateCost(struct) {
    let attackDamage = 2;
    if (struct.defenseComponent && struct.defenseComponent.type === DEFENSE_COMPONENTS.ARMOUR) {
      attackDamage = 1;
    }
    return Math.ceil(struct.currentHealth / attackDamage);
  }

  /**
   * @param {Struct} commandStruct
   * @return {DefenseStrategyTreeNode}
   */
  generate(commandStruct) {
    const treeRoot = new DefenseStrategyTreeNode(commandStruct.id, commandStruct, new AmbitDistribution());
    let openSet = [treeRoot];

    while (openSet.length > 0) {
      const currentNode = openSet.pop();

      currentNode.cost.increment(
        currentNode.struct.operatingAmbit,
        this.calculateCost(currentNode.struct)
      );

      openSet = openSet.concat(currentNode.struct.defenders.map(defender => {
        const defenderNode = new DefenseStrategyTreeNode(defender.id, defender, new AmbitDistribution());
        defenderNode.costFromRoot = currentNode.costFromRoot.add(currentNode.cost);
        currentNode.addChild(defenderNode);
        return defenderNode;
      }));
    }

    return treeRoot;
  }

  /**
   * @param {DefenseStrategyTreeNode} treeRoot
   * @return {DefenseStrategyTreeNode[]}
   */
  getLeafNodes(treeRoot) {
    const leafNodes = [];
    let openSet = [treeRoot];

    while (openSet.length > 0) {
      const currentNode = openSet.pop();

      if (currentNode.nodeChildren.length === 0) {
        leafNodes.push(currentNode);
      } else {
        openSet = openSet.concat(currentNode.nodeChildren);
      }
    }

    return leafNodes;
  }
}
