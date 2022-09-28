import {DTest} from "../../DTestFramework.js";
import {TreeNode} from "../../../js/modules/data_structures/TreeNode.js";

const addChildTest = new DTest('addChildTest', function() {
  const root = new TreeNode('0', 0);
  const node = new TreeNode('1', 1, 5);

  this.assertEquals(root.nodeParent, null);
  this.assertEquals(root.nodeChildren.length, 0);
  this.assertEquals(root.weight, 0);

  root.addChild(node);

  this.assertEquals(node.nodeParent.key, root.key);
  this.assertEquals(node.weight, 5);
  this.assertEquals(root.nodeChildren.length, 1);
  this.assertEquals(root.nodeChildren[0].key, node.key);
  this.assertEquals(root.weight, 0);
});

const removeChildByKeyTest = new DTest('removeChildByKeyTest', function() {
  const root = new TreeNode('2', 2);
  const node1 = new TreeNode('1', 1);
  const node3 = new TreeNode('3', 3);

  root.addChild(node1);
  root.addChild(node3);

  this.assertEquals(root.nodeParent, null);
  this.assertEquals(root.nodeChildren.length, 2);

  const removed = root.removeChildByKey(node1.key);

  this.assertEquals(root.nodeChildren.length, 1);
  this.assertEquals(root.nodeChildren[0].key, node3.key);
  this.assertEquals(removed.key, node1.key);
  this.assertEquals(removed.nodeParent, null);
});

// Test execution
console.log('TreeNodeTest');
addChildTest.run();
removeChildByKeyTest.run();
