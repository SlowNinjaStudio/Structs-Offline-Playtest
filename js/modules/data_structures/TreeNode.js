export class TreeNode {
  /**
   * @param {string|number} key
   * @param {*} value
   * @param {number} weight
   */
  constructor(key, value, weight = 0) {
    this.key = key;
    this.value = value;
    this.weight = weight;
    this.nodeParent = null;
    this.nodeChildren = [];
  }

  /**
   * @param {TreeNode} node
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
