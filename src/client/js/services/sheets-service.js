/**
 * This module exports the SheetsService object as a singleton.
 *
 * @author {@link https://github.com/j-rewerts|Jared Rewerts}
 * @module
 */


var Provoke = require('../util/provoke.js');


/**
 * Handles operations related to getting Sheet names. This object is used as a singleton.
 * It has basic caching abilties.
 *
 * @constructor
 */
var SheetsService = function() {

  var sheets = null;
  var REFRESH_DURATION = 30000;
  var self = this;

  //**** private functions ****//

  this.init_ = function() {
    window.setInterval(resetCache, REFRESH_DURATION);
  };

  var resetCache = function() {
    sheets = null;
  };

  //**** public functions ****//

  /**
   * Gets all Sheet names.
   *
   * @return {Promise} A Promise.
   */
  this.get = function() {
    if (sheets === null) {
      sheets = Provoke('SheetsService', 'get');
    }

    return sheets;
  };

  self.init_();
};


/** */
module.exports = new SheetsService();
