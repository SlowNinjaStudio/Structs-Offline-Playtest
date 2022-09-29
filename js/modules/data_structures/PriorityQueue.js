export class PriorityQueue {
  constructor() {
    this.queue = [];
  }

  /**
   * @param {PriorityQueueNode} node
   */
  insert(node) {
    for (let i = 0; i < this.queue.length; i++) {
      if (node.priority > this.queue[i].priority) {
        this.queue.splice(i, 0, node);
        return;
      }
    }
    this.queue.push(node);
  }

  /**
   * @return {PriorityQueueNode}
   */
  dequeue() {
    return this.queue.pop();
  }

  /**
   * @return {number}
   */
  getLength() {
    return this.queue.length;
  }
}
