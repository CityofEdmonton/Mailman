/**
 * This module exports the DocumentService object.
 *
 * @author {@link https://github.com/j-rewerts|Jared Rewerts}
 * @module
 */


var Provoke = require('../util/provoke.js');


/**
 * This service handles getting information about a Google Doc.
 *
 * @constructor
 */
var DocumentService = function() {

  var key = 'DOC_PICKER_RESPONSE';

  //***** private methods *****//

  this.init_ = function() {

  };

  //***** public methods *****//

  /**
   * Gets an ID for a Google Doc.
   *
   * @return {Promise} A Promise that resolves when the user has selected or cancelled the picker.
   */
  this.getDocument = function() {
    return Provoke('PickerService', 'openDocument', key);
  };


  this.init_();
};


/** */
module.exports = new DocumentService();
