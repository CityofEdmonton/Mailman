var Node = require('./node.js');

var List = function() {
  this._length = 0;
  this.head = null;
};

// ***** Public Functions ***** //
List.prototype.add = function(value) {
    var node = new Node(value);
    var currentNode = this.head;

    // Set up the list if this is the first node.
    if (!currentNode) {
        this.head = node;
        this._length++;

        return node;
    }

    // Add a new node to the end of the list
    while (currentNode.next) {
        currentNode = currentNode.next;
    }

    currentNode.next = node;
    node.previous = currentNode;
    this._length++;

    return node;
};

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

List.prototype.remove = function(position) {
    var currentNode = this.head;
    var length = this._length
    var count = 0;
    var beforeNodeToDelete = null;
    var nodeToDelete = null;
    var deletedNode = null;

    // Verify the position is valid.
    if (length === 0 || position < 0 || position >= length) {
        throw new Error('Failure: node not in list.');
    }

    // Head needs to be updated when it's the first node
    if (position === 0) {
        this.head = currentNode.next;
        currentNode.next.previous = null;
        deletedNode = currentNode;
        currentNode = null;
        this._length--;

        return deletedNode;
    }

    while (count < position) {
        beforeNodeToDelete = currentNode;
        nodeToDelete = currentNode.next;
        count++;
    }

    // This handles the event where it's at the end of the list.
    if (nodeToDelete.next !== null) {
      nodeToDelete.next.previous = beforeNodeToDelete;
    }
    beforeNodeToDelete.next = nodeToDelete.next;
    deletedNode = nodeToDelete;
    nodeToDelete = null;
    this._length--;

    return deletedNode;
};

module.exports = List;
