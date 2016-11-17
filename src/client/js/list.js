var Node = require('./node.js');


// Used some of the code found here:
// https://code.tutsplus.com/articles/data-structures-with-javascript-singly-linked-list-and-doubly-linked-list--cms-23392
// It's worth noting that there are several errors in the list implementation on this site, so beware.



/** @constructor */
var List = function() {
  this._length = 0;
  this.head = null;
  this.tail = null;
};


// ***** Public Functions ***** //
/**
 * Adds a new node to the end of the List.
 *
 * @param {Object} value The data to be assigned to the node.
 * @return {Node} The newly created node.
 */
List.prototype.add = function(value) {
  var node = new Node(value);

  if (this._length !== 0) {
    node.previous = this.tail;
    this.tail.next = node;
    this.tail = node;
  } else {
    this.head = node;
    this.tail = node;
  }

  this._length++;

  return node;
};

/**
 * Inserts a Node at the given index.
 *
 * @param {Number} index The index to insert the Node at.
 * @param {Object} value the value of the new Node.
 * @return {Node} The newly inserted Node.
 */
List.prototype.insert = function(index, value) {
  var newNode = new Node(value);

  //Adding at the very end.
  if (index === this._length) {
    return this.add(value);
  }
  // Adding at the very start of the list
  else if (index == 0) {
    var oldNode = this.getNode(index);

    this.head = newNode

    newNode.next = oldNode;
    oldNode.previous = newNode;
  }
  else {
    var oldNode = this.getNode(index);
    var before = oldNode.previous;

    before.next = newNode;
    newNode.previous = before;
    newNode.next = oldNode;
    oldNode.previous = newNode;
  }

  this._length++;

  return newNode;
};

/**
 * Gets a node at a specified 0-based position.
 *
 * @param {Number} position The 0-based position of the node to find.
 * @return {Node} The node at position.
 */
List.prototype.getNode = function(position) {
  var currentNode = this.head;
  var length = this._length;
  var count = 0;

  // Verify the position is valid.
  if (length === 0 || position < 0 || position >= length) {
    throw new Error('Failure: node not in list.');
  }

  while (count < position) {
    currentNode = currentNode.next;
    count++;
  }

  return currentNode;
};


List.prototype.getPosition = function(node) {
  var currentNode = this.head;
  var position = -1;

  while (currentNode !== null) {
    position++;

    if (currentNode === node) {
      return position;
    }

    currentNode = currentNode.next;
  }

  return null;
};

/**
 * This function removes a node from the List.
 *
 * @param {Number} position The 0-based position of the node to remove.
 */
List.prototype.remove = function(position) {
  var currentNode = this.head;
  var length = this._length;
  var count = 0;
  var beforeNodeToDelete = null;
  var nodeToDelete = null;
  var afterNodeToDelete = null;
  //var deletedNode = null;

  // 1st use-case: an invalid position
  if (length === 0 || position < 0 || position >= length) {
    throw new Error('Failure: non-existent node in this list.');
  }

  // 2nd use-case: the first node is removed
  if (position === 0) {
    this.head = currentNode.next;

    // 2nd use-case: there is a second node
    if (this.head !== null) {
      this.head.previous = null;
    }
  // 2nd use-case: there is no second node
    else {
      this.tail = null;
    }
  }
// 3rd use-case: the last node is removed
  else if (position === this._length - 1) {
    this.tail = this.tail.previous;
    this.tail.next = null;
  }
// 4th use-case: a middle node is removed
  else {
    currentNode = this.getNode(position);

    beforeNodeToDelete = currentNode.previous;
    nodeToDelete = currentNode;
    afterNodeToDelete = currentNode.next;

    beforeNodeToDelete.next = afterNodeToDelete;
    afterNodeToDelete.previous = beforeNodeToDelete;
    nodeToDelete = null;
  }

  this._length--;
};


/** */
module.exports = List;
