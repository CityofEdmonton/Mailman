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

  //***** private methods *****//

  this.init_ = function() {

  };

  //***** public methods *****//

  /**
   * Gets the headers for a given Sheet and row.
   *
   * @param {string} sheet The name of the Sheet.
   * @param {string} row The row the headers are in.
   */
  this.get = function(sheet, row) {
    return new Promise(function(resolve, reject) {
      resolve(["ID", "Email", "Name", "Bung boysenberry porosity coigning repelling squillgeeing", "Mailman Email Timestamp"]);
    });
  };


  this.init_();
};


/** */
module.exports = HeaderService;
