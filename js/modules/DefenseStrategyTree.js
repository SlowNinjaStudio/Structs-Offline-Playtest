import {DefenseStrategyTreeNode} from "./data_structures/DefenseStrategyTreeNode.js";
import {AmbitDistribution} from "./AmbitDistribution.js";

export class DefenseStrategyTree {
  /**
   * @param {CommandStruct} commandStruct
   * @return {DefenseStrategyTreeNode}
   */
  generate(commandStruct) {
    const treeRoot = new DefenseStrategyTreeNode(commandStruct.id, commandStruct, new AmbitDistribution());
    let openSet = [treeRoot];

    while (openSet.length > 0) {
      const currentNode = openSet.pop();

      currentNode.cost.increment(
        currentNode.struct.operatingAmbit,
        Math.ceil(currentNode.struct.currentHealth / 2)
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
