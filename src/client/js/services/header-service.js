/**
 * This module exports the HeadersService object.
 *
 * @author {@link https://github.com/j-rewerts|Jared Rewerts}
 * @module
 */


var Provoke = require('../util/provoke.js');



/**
 * This service handles getting all the headers for a specific Sheet.
 *
 * @constructor
 */
var HeaderService = function() {

  /**
   * Gets the headers for a given Sheet and row.
   *
   * @param {string} sheet The name of the Sheet.
   * @param {string} row The row the headers are in.
   */
  this.get = function(sheet, row) {
    return Provoke('HeaderService', 'get', sheet, row);
  };
};


/** */
module.exports = HeaderService;
