/**
 * This module exports the SheetsService object.
 *
 * @author {@link https://github.com/j-rewerts|Jared Rewerts}
 * @module
 */


var Provoke = require('../util/provoke.js');


/**
 * Handles operations related to getting Sheet names.
 *
 * @constructor
 */
var SheetsService = function() {

  /**
   * Gets all Sheet names.
   *
   * @return {Promise} A Promise.
   */
  this.get = function() {
    return Provoke('SheetsService', 'get');
  };

};


/** */
module.exports = SheetsService;
