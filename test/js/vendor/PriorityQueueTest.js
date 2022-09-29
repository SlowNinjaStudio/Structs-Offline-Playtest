import {DTest} from "../../DTestFramework.js";
import {PriorityQueue} from "../../../js/modules/data_structures/PriorityQueue.js";
import {PriorityQueueNode} from "../../../js/modules/data_structures/PriorityQueueNode.js";

const insertTest = new DTest('insertTest', function() {
  const queue = new PriorityQueue();
  const node1 = new PriorityQueueNode(1, 'apple');
  const node2 = new PriorityQueueNode(2, 'banana');
  const node3 = new PriorityQueueNode(3, 'clementine');
  const node4 = new PriorityQueueNode(4, 'dragon fruit');
  const node5 = new PriorityQueueNode(5, 'elderberry');

  queue.insert(node3);

  this.assertEquals(queue.getLength(), 1)
  this.assertEquals(queue.queue[0].value, 'clementine');

  queue.insert(node4);
  queue.insert(node2);

  this.assertEquals(queue.getLength(), 3)
  this.assertEquals(queue.queue[0].value, 'banana');
  this.assertEquals(queue.queue[1].value, 'clementine');
  this.assertEquals(queue.queue[2].value, 'dragon fruit');

  queue.insert(node1);
  queue.insert(node5);

  this.assertEquals(queue.getLength(), 5)
  this.assertEquals(queue.queue[0].value, 'apple');
  this.assertEquals(queue.queue[1].value, 'banana');
  this.assertEquals(queue.queue[2].value, 'clementine');
  this.assertEquals(queue.queue[3].value, 'dragon fruit');
  this.assertEquals(queue.queue[4].value, 'elderberry');
});

// Test execution
console.log('PriorityQueueTest');
insertTest.run();
