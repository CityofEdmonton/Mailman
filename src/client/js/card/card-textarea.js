var textareaHTML = require('./card-textarea.html');
var TitledCard = require('./card-titled.js');
var AutocompleteConfig = require('./autocomplete-config.js');



/**
 * TextareaCards use a multiline input field. They differ from InputCard in this way.
 *
 * @param {jquery} appendTo The object to append this Card to.
 * @param {Object} options The configuration options for this TextareaCard.
 * @param {String} options.label The label the textarea should have when it has no text.
 * @param {Object} options.autocomplete The autocomplete configuration object. Please see setAutocomplete for a more
 * detailed listing of this Object.
 * @constructor
 */
var TextareaCard = function(appendTo, options) {
  TitledCard.call(this, appendTo, options);

  // Private variables
  var self = this;
  var innerBase = $(textareaHTML);
  var textarea = innerBase.find('textarea');
  var acConfig = new AutocompleteConfig(textarea);

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
      textarea.on('focus', function() {textarea.autocomplete('search', self.getValue())});
    }
    if (options.results !== undefined) {
      results = options.results;
    }

    textarea.autocomplete(acConfig.getAutocompleteConfig(append, prepend, maxResults, trigger, results));
  };

  /**
   * Gets the value in the textarea.
   *
   * @return {String} The value in the textarea.
   */
  this.getValue = function() {
    return textarea.val();
  };

  /**
   * Sets the value of the textarea.
   *
   * @param {String} value The value to set in the textarea.
   */
  this.setValue = function(value) {
    textarea.val(value);
    innerBase.addClass('is-dirty');
  };

  /**
   * Sets the label shown in the textarea when nothing has been typed.
   *
   * @param {String} label The value to set as the label.
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
TextareaCard.prototype.constructor = TextareaCard;
TextareaCard.prototype = Object.create(TitledCard.prototype);


/** */
module.exports = TextareaCard;
