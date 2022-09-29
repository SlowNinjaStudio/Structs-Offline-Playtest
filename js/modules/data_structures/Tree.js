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
}
