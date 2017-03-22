/**
 * This module exports the {@link Node} object.
 *
 * @author {@link https://github.com/j-rewerts|Jared Rewerts}
 * @module
 */


/**
 * A node, often used in List implementations.
 *
 * @constructor
 * @alias Node
 * @param {Object} data The data to be assigned to the node.
 */
var Node = function(data) {
  this.data = data;
  this.previous = null;
  this.next = null;
};


/** */
module.exports = Node;
