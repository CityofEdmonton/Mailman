/**
 * This module exports the SheetsService object as a singleton.
 *
 * @author {@link https://github.com/dchenier|Dan Chenier}
 * @module
 */


var Provoke = require('../util/provoke.js');
var handlebars = require('handlebars');

/**
* Handles operations related to getting rendering templates.
*
* @constructor
*/
var RenderService = function() {

  var self = this;

  //**** private functions ****//

  this.init_ = function() {

  };

  var getContext = function(sheetName, headerRowIndex) {
    return Provoke('RenderService', 'getContext', sheetName, headerRowIndex); 
  };


 //**** public functions ****//

 /**
  * Renders the specified content in the default context (active row)
  */
  this.render = function(content, sheetName, headerRowIndex) {
    return Provoke('RenderService', 'render', content, { sheetName: sheetName, headerRowIndex: headerRowIndex })
  }
  self.init_();
};

/** */
module.exports = RenderService;