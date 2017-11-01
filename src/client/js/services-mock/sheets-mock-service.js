/**
 * This module exports the SheetsService object as a singleton.
 *
 * @author {@link https://github.com/j-rewerts|Jared Rewerts}
 * @module
 */


var Provoke = require('../util/provoke.js');
var Promise = require('promise');

/**
 * Handles operations related to getting Sheet names.
 *
 * @constructor
 */
var SheetsService = function() {

  var self = this;

  //**** private functions ****//

  this.init_ = function() {

  };

  //**** public functions ****//

  /**
   * Gets all Sheet names.
   *
   * @return {Promise} A Promise.
   */
  this.get = function() {
    return new Promise(function(resolve, reject) {
      resolve(["Emails", "Fake sheet"]);
    });
  };

  self.init_();
};


/** */
module.exports = SheetsService;
