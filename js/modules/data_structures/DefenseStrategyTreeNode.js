import {AmbitDistribution} from "../AmbitDistribution.js";

export class DefenseStrategyTreeNode {
  /**
   * @param {string|number} key
   * @param {Struct} struct
   * @param {AmbitDistribution} cost
   */
  constructor(key, struct, cost = null) {
    this.key = key;
    this.struct = struct;
    this.cost = cost;
    this.costFromRoot = new AmbitDistribution();
    this.nodeParent = null;
    this.nodeChildren = [];
  }

  /**
   * @param {DefenseStrategyTreeNode} node
   */
  addChild(node) {
    node.nodeParent = this;
    this.nodeChildren.push(node);
  }

  /**
   * @param childKey
   */
  removeChildByKey(childKey) {
    const index = this.nodeChildren.findIndex(node => node.key === childKey);

    if (index > -1) {
      const removed = this.nodeChildren[index];
      removed.nodeParent = null;

      this.nodeChildren.splice(index, 1);

      return removed;
    }

    return null;
  }
}
