/**
 * This module exports an InputCard object.
 *
 * @author {@link https://github.com/j-rewerts|Jared Rewerts}
 * @module
 */


var html = require('./document-picker.html');
var TitledCard = require('./card-titled.js');
var Util = require('../util/util.js');


/**
 * InputCards use a 1 line input field. They differ from TextareaCard in this way.
 *
 * @constructor
 * @extends module:client/js/card/card-titled~TitledCard
 * @param {jquery} appendTo The object to append this Card to.
 * @param {Object} options The configuration options for this InputCard.
 * @param {String} options.label The label the input should have when it has no text.
 * @param {Object} options.autocomplete The autocomplete configuration object. Please see setAutocomplete for a more
 *  detailed listing of this Object.
 * @param {Object} options.error The Object containing the information needed for this input to support input validation.
 * @param {string} options.error.hint The text displayed when text is invalid.
 * @param {string} options.error.pattern The regex pattern to match against.
 */
var InputCard = function(appendTo, options) {
  TitledCard.call(this, appendTo, options);

  // Private variables
  var self = this;
  var innerBase = $(html);

  var mdlObject = innerBase.find('[data-id="mdl-object"]');
  var input = innerBase.find('input');

  //***** Private Methods *****//

  this.init_ = function(appendTo, options) {
    this.append(innerBase);
    componentHandler.upgradeElement(mdlObject[0], 'MaterialTextfield');
  };

  //***** Public Methods *****//

  /**
   * Gets the value in the input.
   *
   * @return {string} The value in the input.
   */
  this.getValue = function() {
    return input.val();
  };

  /**
   * Sets the value of the input.
   *
   * @param {string} value The value to set in the input.
   */
  this.setValue = function(value) {
    mdlObject[0].MaterialTextfield.change(value);
  };

  /**
   * Sets the label shown in the input when nothing has been typed.
   *
   * @param {string} label The value to set as the label.
   */
  this.setLabel = function(label) {
    innerBase.find('label').text(label);
  };

  /**
   * Gets the HTMLInput object as a jquery object.
   *
   * @return {jquery} The input object.
   */
  this.getTextElement = function() {
    return input;
  };

  /**
   * This disables the input element.
   *
   */
  this.disableInput = function() {
    mdlObject[0].MaterialTextfield.disable();
  };

  /**
   * This enables the input element.
   *
   */
  this.enableInput = function() {
    mdlObject[0].MaterialTextfield.enable();
  };

  this.init_(appendTo, options);
};


/** */
InputCard.prototype.constructor = InputCard;
InputCard.prototype = Object.create(TitledCard.prototype);


/** */
module.exports = InputCard;
