/**
 * This module exports the SheetsService object as a singleton.
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
    return Provoke('SheetsService', 'get');
  };


  /**
   * returns the currently active cell in the Sheet
   * 
   * @return {Promise} A Promise.
   */
  this.getActiveCell = function() {
    return Provoke('SheetsService', 'getActiveCell');    
  };  

  this.getFormUrl = function(sheetName) {
    return Provoke('SheetsService', 'getFormUrl', sheetName);    
  }; 
  

  self.init_();
};


/** */
module.exports = SheetsService;
