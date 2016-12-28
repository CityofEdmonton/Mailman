var inputHTML = require('./card-input.html');
var TitledCard = require('./card-titled.js');
var AutocompleteConfig = require('./autocomplete-config.js');



/**
 * InputCards use a 1 line input field. They differ from TextareaCard in this way.
 *
 * @param {jquery} appendTo The object to append this Card to.
 * @param {Object} options The configuration options for this InputCard.
 * @param {String} options.label The label the input should have when it has no text.
 * @param {Object} options.autocomplete The autocomplete configuration object. Please see setAutocomplete for a more
 * detailed listing of this Object.
 * @constructor
 */
var InputCard = function(appendTo, options) {
  TitledCard.call(this, appendTo, options);

  // Private variables
  var self = this;
  var innerBase = $(inputHTML);
  var input = innerBase.find('input');
  var acConfig = new AutocompleteConfig(input);

  //***** Privileged Methods *****//

  /**
   * Sets autocomplete based upon some options.
   *
   * @param {Object} options The options to set up autocomplete.
   * @param {String} options.trigger A String that causes autocomplete to drop down.
   * @param {String} options.append A String to append after a selection is made.
   * @param {String} options.prepend A String to prepend to your selection.
   * @param {Number} options.maxResults A Number indicating the maximum number of displayed results.
   * @param {Boolean} options.triggerOnFocus A value indicating whether the autocomplete should trigger when focused.
   * This brings it more in line with the behaviour of a drop down list.
   * @param {Array<String>} options.results The list of results to filter through.
   */
  this.setAutocomplete = function(options) {
    var append = '';
    var prepend = '';
    var maxResults;
    var trigger;
    var results = [];

    if (options.trigger !== undefined) {
      trigger = options.trigger;
    }
    if (options.append !== undefined) {
      append = options.append;
    }
    if (options.prepend !== undefined) {
      prepend = options.prepend;
    }
    if (options.maxResults !== undefined) {
      maxResults = options.maxResults;
    }
    if (options.triggerOnFocus === true) {
      input.on('focus', function() {input.autocomplete('search', self.getValue())});
    }
    if (options.results !== undefined) {
      results = options.results;
    }

    input.autocomplete(acConfig.getAutocompleteConfig(append, prepend, maxResults, trigger, results));
  };

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
    input.val(value);
    innerBase.addClass('is-dirty');
  };

  /**
   * Sets the label shown in the input when nothing has been typed.
   *
   * @param {string} label The value to set as the label.
   */
  this.setLabel = function(label) {
    innerBase.find('label').text(label);
  };

  // constructor
  this.append(innerBase);

  if (options !== undefined) {
    if (options.label !== undefined) {
      this.setLabel(options.label);
    }
    if (options.autocomplete !== undefined) {
      this.setAutocomplete(options.autocomplete);
    }
  }

  componentHandler.upgradeElement(innerBase[0], 'MaterialTextfield');
};


/** */
InputCard.prototype.constructor = InputCard;
InputCard.prototype = Object.create(TitledCard.prototype);

//***** Public Methods *****//


/** */
module.exports = InputCard;
