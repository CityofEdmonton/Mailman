


/**
 * A node, often used in List implementations.
 *
 * @param {Object} data The data to be assigned to the node.
 * @constructor
 */
var Node = function(data) {
  this.data = data;
  this.previous = null;
  this.next = null;
};


/** */
module.exports = Node;
