import {TreeError} from "../errors/TreeError.js";

export class Tree {
  /**
   * @param {TreeNode} root
   */
  constructor(root) {
    this.root = root;
  }

  /**
   * @param {string|number} key
   * @return {TreeNode|null}
   */
  search(key) {
    let openSet = [this.root];

    while (openSet.length > 0) {
      const currentNode = openSet.pop();
      if (key === currentNode.key) {
        return currentNode;
      }
      openSet = openSet.concat(currentNode.nodeChildren);
    }

    return null;
  }

  /**
   * @param {string|number} parentKey
   * @param {TreeNode} childNode
   */
  addChildAt(parentKey, childNode) {
    const parentNode = this.search(parentKey);
    if (parentNode === null) {
      throw new TreeError('Could not find parent node');
    }
    parentNode.addChild(childNode);
  }

  /**
   * Prunes the node specified by key and it's descendents.
   * @param {string|number} key
   */
  prune(key) {
    const nodeToPrune = this.search(key);
    if (nodeToPrune === null) {
      throw new TreeError('Could not find node to prune');
    }
    if (nodeToPrune.nodeParent === null) {
      throw new TreeError('Cannot prune tree root');
    }
    const nodeParent = nodeToPrune.nodeParent;
    nodeParent.removeChildByKey(nodeToPrune.key);
  }
}
