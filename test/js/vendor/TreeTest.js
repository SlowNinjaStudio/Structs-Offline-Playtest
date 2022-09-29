import {DTest} from "../../DTestFramework.js";
import {TreeNode} from "../../../js/modules/data_structures/TreeNode.js";
import {Tree} from "../../../js/modules/data_structures/Tree.js";
import {TreeError} from "../../../js/modules/errors/TreeError.js";

function getTestTree() {
  const root = new TreeNode('0', 0);
  const node1 = new TreeNode('1', 1);
  const node1dot1 = new TreeNode('1.1', 1.1);
  const node1dot2 = new TreeNode('1.2', 1.2);
  const node1dot3 = new TreeNode('1.3', 1.3);
  const node1dot3dot1 = new TreeNode('1.3.1', 1.31);
  const node2 = new TreeNode('2', 2);
  const node2dot1 = new TreeNode('2.1', 2.1);
  const node2dot2 = new TreeNode('2.2', 2.2);
  const node2dot3 = new TreeNode('2.3', 2.3);
  const node3 = new TreeNode('3', 3);
  const node3dot1 = new TreeNode('3.1', 3.1);

  node1dot3.addChild(node1dot3dot1);

  node1.addChild(node1dot1);
  node1.addChild(node1dot2);
  node1.addChild(node1dot3);

  node2.addChild(node2dot1);
  node2.addChild(node2dot2);
  node2.addChild(node2dot3);

  node3.addChild(node3dot1);

  root.addChild(node1);
  root.addChild(node2);
  root.addChild(node3);

  return new Tree(root);
}

const searchTest = new DTest('searchTest', function() {
  const tree = getTestTree();

  this.assertEquals(tree.search('foo'), null);
  this.assertEquals(tree.search('0').value, 0);
  this.assertEquals(tree.search('1.3.1').value, 1.31);
  this.assertEquals(tree.search('2.2').value, 2.2);
  this.assertEquals(tree.search('3').value, 3);
});

const addChildAtTest = new DTest('addChildAtTest', function() {
  const tree = getTestTree();
  const node1dot3dot2 = new TreeNode('1.3.2', 1.32);
  const node4 = new TreeNode('4', 4);
  const node4dot1 = new TreeNode('4.1', 4.1);

  try {
    tree.addChildAt('foo', node4);
  } catch (e) {
    this.assertEquals(e instanceof TreeError, true);
  }

  this.assertEquals(tree.search('1.3').nodeChildren.length, 1);
  tree.addChildAt('1.3', node1dot3dot2);
  this.assertEquals(tree.search('1.3').nodeChildren.length, 2);

  this.assertEquals(tree.search('0').nodeChildren.length, 3);
  tree.addChildAt('0', node4);
  this.assertEquals(tree.search('0').nodeChildren.length, 4);

  this.assertEquals(tree.search('4').nodeChildren.length, 0);
  tree.addChildAt('4', node4dot1);
  this.assertEquals(tree.search('4').nodeChildren.length, 1);
});

const pruneTest = new DTest('pruneTest', function() {
  const tree = getTestTree();

  this.assertEquals(tree.search('1.3').nodeChildren.length, 1);
  this.assertEquals(tree.search('1.3.1') !== null, true);
  tree.prune('1.3.1');
  this.assertEquals(tree.search('1.3').nodeChildren.length, 0);
  this.assertEquals(tree.search('1.3.1') === null, true);

  this.assertEquals(tree.search('0').nodeChildren.length, 3);
  this.assertEquals(tree.search('2') !== null, true);
  tree.prune('2');
  this.assertEquals(tree.search('0').nodeChildren.length, 2);
  this.assertEquals(tree.search('2') === null, true);

  try {
    tree.prune('0');
  } catch (e) {
    this.assertEquals(e instanceof TreeError, true);
  }
});

// Test execution
console.log('TreeTest');
searchTest.run();
addChildAtTest.run();
pruneTest.run();
