import {DTest, DTestSuite} from "../../DTestFramework.js";
import {DefenseStrategyTreeNode} from "../../../js/modules/data_structures/DefenseStrategyTreeNode.js";
import {StructBuilder} from "../../../js/modules/StructBuilder.js";
import {CommandStructBuilder} from "../../../js/modules/CommandStructBuilder.js";

const addChildTest = new DTest('addChildTest', function() {
  const structBuilder = new StructBuilder();
  const commandStructBuilder = new CommandStructBuilder();
  const root = new DefenseStrategyTreeNode('0', commandStructBuilder.makeCommandShip());
  const node = new DefenseStrategyTreeNode('1', structBuilder.makeStarFighter());

  this.assertEquals(root.nodeParent, null);
  this.assertEquals(root.nodeChildren.length, 0);

  root.addChild(node);

  this.assertEquals(node.nodeParent.key, root.key);
  this.assertEquals(root.nodeChildren.length, 1);
  this.assertEquals(root.nodeChildren[0].key, node.key);
});

const removeChildByKeyTest = new DTest('removeChildByKeyTest', function() {
  const structBuilder = new StructBuilder();
  const commandStructBuilder = new CommandStructBuilder();
  const root = new DefenseStrategyTreeNode('2', commandStructBuilder.makeCommandShip());
  const node1 = new DefenseStrategyTreeNode('1', structBuilder.makeStarFighter());
  const node3 = new DefenseStrategyTreeNode('3', structBuilder.makeSpaceFrigate());

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
DTestSuite.printSuiteHeader('DefenseStrategyTreeNodeTest');
addChildTest.run();
removeChildByKeyTest.run();
