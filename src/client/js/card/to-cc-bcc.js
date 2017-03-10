var inputHTML = require('./to-cc-bcc.html');
var TitledCard = require('./card-titled.js');
var AutocompleteConfig = require('./autocomplete-config.js');



/**
 * This is a less customizeable version of the InputCard. It's meant specifically for to, cc and bcc.
 *
 * @param {jquery} appendTo The object to append this Card to.
 * @param {Object} options The configuration options for this InputCard.
 * @param {Object} options.autocomplete The autocomplete configuration object. Please see setAutocomplete for a more
 *  detailed listing of this Object.
 * @param {Object} options.error The Object containing the information needed for this input to support input validation.
 * @param {string} options.error.hint The text displayed when text is invalid.
 * @param {string} options.error.pattern The regex pattern to match against.
 * @constructor
 */
var InputCard = function(appendTo, options) {
  TitledCard.call(this, appendTo, options);

  // Private variables
  var self = this;
  var innerBase = $(inputHTML);
  var showingFields;

  var toMDL = innerBase.find('[data-id="to-mdl"]');
  var toInput = innerBase.find('[data-id="to-input"]');
  var toError = innerBase.find('[data-id="to-error"]');
  var toErrorSpacer = innerBase.find('[data-id="to-error-spacer"]');

  var ccMDL = innerBase.find('[data-id="cc-mdl"]');
  var ccInput = innerBase.find('[data-id="cc-input"]');
  var ccError = innerBase.find('[data-id="cc-error"]');
  var ccErrorSpacer = innerBase.find('[data-id="cc-error-spacer"]');

  var bccMDL = innerBase.find('[data-id="bcc-mdl"]');
  var bccInput = innerBase.find('[data-id="bcc-input"]');
  var bccError = innerBase.find('[data-id="bcc-error"]');
  var bccErrorSpacer = innerBase.find('[data-id="bcc-error-spacer"]');

  var toAutocompleteConfig;
  var ccAutocompleteConfig;
  var bccAutocompleteConfig;

  //***** Private Methods *****//

  this.init_ = function(appendTo, options) {
    this.append(innerBase);
    toAutocompleteConfig = new AutocompleteConfig(toMDL);
    ccAutocompleteConfig = new AutocompleteConfig(ccMDL);
    bccAutocompleteConfig = new AutocompleteConfig(bccMDL);

    if (options !== undefined) {
      if (options.error !== undefined) {
        this.setError(options.error);
      }
      if (options.autocomplete !== undefined) {
        this.setAutocomplete(options.autocomplete);
      }
    }

    componentHandler.upgradeElement(toMDL[0], 'MaterialTextfield');
    componentHandler.upgradeElement(ccMDL[0], 'MaterialTextfield');
    componentHandler.upgradeElement(bccMDL[0], 'MaterialTextfield');
  };

  var triggerFocus = function(e) {
    var input = $(e.currentTarget);
    var trigger = e.data.trigger;

    if (input.val() === '') {
      input.autocomplete('search', trigger);
    }
  };

  var showFields = function() {

  };

  var hideFields = function() {

  };

  //***** Public Methods *****//

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
      toInput.on('focus', {trigger: trigger}, triggerFocus);
      ccInput.on('focus', {trigger: trigger}, triggerFocus);
      bccInput.on('focus', {trigger: trigger}, triggerFocus);
    }
    if (options.results !== undefined) {
      results = options.results;
    }

    toInput.autocomplete(toAutocompleteConfig.getAutocompleteConfig(append, prepend, maxResults, trigger, results));
    ccInput.autocomplete(ccAutocompleteConfig.getAutocompleteConfig(append, prepend, maxResults, trigger, results));
    bccInput.autocomplete(bccAutocompleteConfig.getAutocompleteConfig(append, prepend, maxResults, trigger, results));
  };

  /**
   * Gets the value in the input.
   *
   * @return {string} The value in the input.
   */
  this.getValue = function() {
    return toInput.val();
  };

  /**
   * Sets the value of the input.
   *
   * @param {string} value The value to set in the input.
   */
  this.setValue = function(value) {
    toMDL[0].MaterialTextfield.change(value);
  };

  /**
   * Sets the error/input formatting required.
   *
   * @param {Object} errorObj The Object containing the information needed for this input to support input validation.
   * @param {string} errorObj.hint The text displayed when text is invalid.
   * @param {string} errorObj.pattern The regex pattern to match against.
   */
  this.setError = function(errorObj) {
    toError.text(errorObj.hint);
    toInput.attr('pattern', errorObj.pattern);
    toErrorSpacer.height(toError.actual('height'));

    ccError.text(errorObj.hint);
    ccInput.attr('pattern', errorObj.pattern);
    ccErrorSpacer.height(ccError.actual('height'));

    bccError.text(errorObj.hint);
    bccInput.attr('pattern', errorObj.pattern);
    bccErrorSpacer.height(bccError.actual('height'));
  };

  this.isValid = function() {
    if (toMDL.hasClass('is-invalid') || ccMDL.hasClass('is-invalid') || bccMDL.hasClass('is-invalid')) {
      return false;
    }
    if (self.getValue().to === '') {
      return false;
    }

    return true;
  };

  this.init_(appendTo, options);
};


/** */
InputCard.prototype.constructor = InputCard;
InputCard.prototype = Object.create(TitledCard.prototype);


/** */
module.exports = InputCard;
